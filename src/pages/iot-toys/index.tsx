import { useRef, useState, useEffect } from 'react';

import { Button, message, Layout, Select, Modal, Slider, Tooltip } from 'antd';
import {
  PhoneOutlined,
  PhoneFilled,
  RobotOutlined,
  SoundOutlined,
  SoundFilled,
  AudioOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  WsChatClient,
  WsChatEventNames,
  WsToolsUtils,
} from '@coze/api/ws-tools';
import {
  type ConversationMessageCompletedEvent,
  type ConversationChatCreatedEvent,
  type CommonErrorEvent,
  type ConversationAudioTranscriptUpdateEvent,
} from '@coze/api';

import { AudioConfig, type AudioConfigRef } from '../../components/audio-config';

// Coze API 类型定义
interface MessageData {
  id: string;
  conversation_id: string;
  bot_id: string;
  chat_id: string;
  meta_data: Record<string, string>;
  role: 'user' | 'assistant';
  content: string;
  content_type: 'text' | 'object_string' | 'card' | 'audio';
  type: 'question' | 'answer' | 'function_call' | 'tool_output' | 'tool_response' | 'follow_up' | 'verbose';
}

interface ChatData {
  id: string;
  conversation_id: string;
  bot_id: string;
  created_at?: number;
  last_error?: {
    code: number;
    msg: string;
  };
  meta_data?: Record<string, string>;
  status?: string;
}

import './index.css';
import getConfig from '../../utils/config';
import Settings from '../../components/settings2';
import { getChatMessages } from '../../utils/api';

const { Content } = Layout;

type CallState = 'idle' | 'calling' | 'connected' | 'ended';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface ChatSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  messages: ChatMessage[];
}

const IoTToys = () => {
  const clientRef = useRef<WsChatClient>();
  const audioConfigRef = useRef<AudioConfigRef>(null);
  const localStorageKey = 'iot-toys';
  const config = getConfig(localStorageKey);

  // 状态管理
  const [callState, setCallState] = useState<CallState>('idle');
  const [isConnecting, setIsConnecting] = useState(false);
  const [subtitleList, setSubtitleList] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  // 音频配置状态
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // 当前会话ID
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sessionStartTime, setSessionStartTime] = useState<string>('');

  // Coze API 会话信息
  const [conversationId, setConversationId] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');

  // 获取音频设备
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');

  useEffect(() => {
    const getDevices = async () => {
      const devices = await WsToolsUtils.getAudioDevices();
      setInputDevices(devices.audioInputs);
      if (devices.audioInputs.length > 0) {
        setSelectedInputDevice(devices.audioInputs[0].deviceId);
      }
    };
    getDevices();

    // 加载历史记录
    loadChatHistory();
  }, []);

  // 从 localStorage 加载聊天历史
  const loadChatHistory = () => {
    try {
      const userId = config.getUserId() || 'default';
      const storedHistory = localStorage.getItem(`iot-toys-history-${userId}`);
      if (storedHistory) {
        const history = JSON.parse(storedHistory) as ChatSession[];
        setChatHistory(history);
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    }
  };

  // 保存聊天历史到 localStorage
  const saveChatHistory = (sessions: ChatSession[]) => {
    try {
      const userId = config.getUserId() || 'default';
      localStorage.setItem(`iot-toys-history-${userId}`, JSON.stringify(sessions));
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  };

  // 初始化客户端
  async function initClient() {
    const permission = await WsToolsUtils.checkDevicePermission();
    if (!permission.audio) {
      throw new Error('需要麦克风访问权限');
    }

    if (!config.getPat()) {
      throw new Error('请先配置个人访问令牌');
    }

    if (!config.getBotId()) {
      throw new Error('请先配置智能体ID');
    }

    const audioConfig = audioConfigRef.current?.getSettings();
    console.log('audioConfig', audioConfig);

    const client = new WsChatClient({
      token: config.getPat(),
      baseWsURL: config.getBaseWsUrl(),
      allowPersonalAccessTokenInBrowser: true,
      botId: config.getBotId(),
      debug: audioConfig?.debug,
      voiceId: config.getVoiceId(),
      workflowId: config.getWorkflowId() || undefined,
      aiDenoisingConfig: !audioConfig?.noiseSuppression
        ? {
            mode: audioConfig?.denoiseMode,
            level: audioConfig?.denoiseLevel,
            assetsPath:
              'https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket',
          }
        : undefined,
      audioCaptureConfig: {
        echoCancellation: audioConfig?.echoCancellation,
        noiseSuppression: audioConfig?.noiseSuppression,
        autoGainControl: audioConfig?.autoGainControl,
      },
      wavRecordConfig: {
        enableSourceRecord: false,
        enableDenoiseRecord: false,
      },
      deviceId: selectedInputDevice || undefined,
      audioMutedDefault: false,
      enableLocalLoopback: audioConfig?.isHuaweiMobile,
    });

    if (
      !audioConfig?.noiseSuppression &&
      !WsToolsUtils.checkDenoiserSupport()
    ) {
      message.info('当前浏览器不支持AI降噪');
    }

    clientRef.current = client;

    // 监听事件
    handleMessageEvent();
  }

  // 处理消息事件
  const handleMessageEvent = () => {
    // 监听对话创建事件，获取 conversation_id 和 chat_id
    clientRef.current?.on(
      WsChatEventNames.CONVERSATION_CHAT_CREATED,
      (_, data) => {
        const event = data as ConversationChatCreatedEvent;
        const chatData = event.data as ChatData;

        console.log('Chat created:', chatData);

        if (chatData.conversation_id && chatData.id) {
          setConversationId(chatData.conversation_id);
          setChatId(chatData.id);
        }
      },
    );

    // 监听消息完成事件，获取完整的对话消息（包含 role）
    clientRef.current?.on(
      WsChatEventNames.CONVERSATION_MESSAGE_COMPLETED,
      (_, data) => {
        const event = data as ConversationMessageCompletedEvent;
        const msgData = event.data as MessageData;

        if (msgData.content) {
          const newMessage: ChatMessage = {
            role: msgData.role,
            content: msgData.content,
            time: new Date().toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          };

          setSubtitleList(prev => [...prev, newMessage]);
        }
      },
    );

    // 错误处理
    clientRef.current?.on(
      WsChatEventNames.SERVER_ERROR,
      (_: string, event: unknown) => {
        console.log('[iot-toys] error', event);
        message.error(
          `发生错误：${(event as CommonErrorEvent)?.data?.msg} logid: ${
            (event as CommonErrorEvent)?.detail.logid
          }`,
        );
        clientRef.current?.disconnect();
        clientRef.current = undefined;
        setCallState('ended');
      },
    );

    // 处理音频转录更新事件
    clientRef.current?.on(
      WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE,
      (_, data) => {
        const event = data as ConversationAudioTranscriptUpdateEvent;
        if (event.data.content) {
          setTranscript(event.data.content);
        }
      },
    );

    // 处理音频状态变化
    clientRef.current?.on(WsChatEventNames.AUDIO_MUTED, () => {
      console.log('麦克风已关闭');
      setIsMuted(true);
    });

    clientRef.current?.on(WsChatEventNames.AUDIO_UNMUTED, () => {
      console.log('麦克风已打开');
      setIsMuted(false);
    });
  };

  // 开始通话
  const handleStartCall = async () => {
    try {
      setIsConnecting(true);
      setCallState('calling');

      // 生成新的会话ID
      const sessionId = `session-${Date.now()}`;
      setCurrentSessionId(sessionId);
      setSessionStartTime(new Date().toLocaleString('zh-CN'));

      if (!clientRef.current) {
        await initClient();
      }

      const chatUpdate: any = {
        event_type: 'chat.update',
        data: {
          input_audio: {
            format: 'pcm',
            codec: 'pcm',
            sample_rate: 48000,
          },
          output_audio: {
            codec: 'pcm',
            pcm_config: {
              sample_rate: 24000,
            },
            voice_id: config.getVoiceId(),
          },
          turn_detection: {
            type: 'server_vad',
          },
          need_play_prologue: true,
        },
      };

      await clientRef.current?.connect({ chatUpdate });

      setCallState('connected');
      setSubtitleList([]); // 清空字幕列表
      setIsConnecting(false);
      message.success('通话已连接');
    } catch (error) {
      console.error(error);
      message.error(`连接错误：${(error as Error).message}`);
      setIsConnecting(false);
      setCallState('idle');
    }
  };

  // 挂断通话
  const handleEndCall = async () => {
    if (clientRef.current) {
      await clientRef.current.disconnect();
      clientRef.current = undefined;
    }

    // 使用 Coze API 获取完整的消息列表
    if (conversationId && chatId) {
      try {
        const messages = await getChatMessages(conversationId, chatId, localStorageKey);

        // 转换消息格式
        const chatMessages: ChatMessage[] = messages
          .filter(msg => {
            // 只保留真正的对话消息
            return (
              msg.content && // 有内容
              (msg.type === 'question' || msg.type === 'answer') && // 是问答类型的消息
              (msg.role === 'user' || msg.role === 'assistant') // 是用户或 AI 消息
            );
          })
          .map(msg => ({
            role: msg.role,
            content: msg.content,
            time: new Date().toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          }));

        // 如果有消息，保存到历史记录
        if (chatMessages.length > 0) {
          const session: ChatSession = {
            id: currentSessionId,
            userId: config.getUserId() || 'default',
            startTime: sessionStartTime,
            endTime: new Date().toLocaleString('zh-CN'),
            messages: chatMessages,
          };

          // 加载现有历史记录，添加新会话
          loadChatHistory();
          setChatHistory(prev => {
            const updated = [session, ...prev];
            saveChatHistory(updated);
            return updated;
          });
        }
      } catch (error) {
        console.error('获取历史消息失败:', error);
        message.error('保存聊天记录失败');
      }
    }

    // 清空状态
    setConversationId('');
    setChatId('');
    setCallState('ended');
    setSubtitleList([]);
    message.success('通话已结束');
  };

  // 重新拨打
  const handleRecall = () => {
    setCallState('idle');
    setChatHistory([]);
    handleStartCall();
  };

  // 返回初始状态
  const handleBackToIdle = () => {
    setCallState('idle');
    setChatHistory([]);
  };

  // 静音/取消静音（仅显示状态，暂不实现实际静音功能）
  const handleToggleMute = () => {
    // TODO: 实现静音功能，等待 SDK 支持
    message.info('静音功能开发中');
  };

  // 音量控制
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (clientRef.current) {
      clientRef.current.setPlaybackVolume(value / 100);
    }
  };

  // 清理资源
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  function handleSettingsChange() {
    console.log('Settings changed');
    window.location.reload();
  }

  // 渲染初始状态界面
  const renderIdleState = () => (
    <div className="hero-section">
      <h1>生活物联网 AI 玩具演示平台</h1>
      <p>体验智能对话，开启物联网新时代</p>
      <button className="call-button" onClick={handleStartCall}>
        <span className="phone-icon"><PhoneOutlined /></span>
        <span className="button-text">开始对话</span>
      </button>
    </div>
  );

  // 渲染通话中界面
  const renderCallingState = () => (
    <div className="calling-section">
      {isConnecting ? (
        <div className="loading-container">
          <div className="loading-ring"></div>
          <div className="loading-text">正在连接 AI 玩具...</div>
        </div>
      ) : (
        <>
          <div className="call-header">
            <div className="call-status">
              <span className="status-dot"></span>
              <span>通话中</span>
            </div>
            <div className="header-actions">
              <Button
                type="text"
                icon={<SettingOutlined />}
                onClick={() => setIsConfigModalOpen(true)}
                className="config-btn"
              >
                配置
              </Button>
              <Settings
                onSettingsChange={handleSettingsChange}
                localStorageKey={localStorageKey}
                fields={['base_ws_url', 'bot_id', 'pat', 'voice_id', 'user_id']}
                className="settings-button"
              />
            </div>
          </div>

          <div className="assistant-avatar">🤖</div>

          {/* 实时识别结果 */}
          {transcript && (
            <div className="transcript-section">
              <div className="transcript-label">🎤 实时识别</div>
              <div className="transcript-content">{transcript}</div>
            </div>
          )}

          <div className="subtitle-section">
            <h3>实时字幕</h3>
            {subtitleList.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <div className="empty-text">等待对话内容...</div>
              </div>
            ) : (
              subtitleList.map((item, index) => (
                <div
                  key={index}
                  className={`subtitle-item ${item.role}`}
                >
                  <div className="role">
                    {item.role === 'user' ? '👤 用户' : '🤖 AI 玩具'}
                  </div>
                  <div className="content">{item.content}</div>
                </div>
              ))
            )}
          </div>

          <div className="control-panel">
            {/* 音量控制 */}
            <div className="volume-control">
              <Tooltip title={`音量: ${volume}%`}>
                <div className="volume-icon">
                  {volume > 0 ? <SoundFilled /> : <SoundOutlined />}
                </div>
              </Tooltip>
              <Slider
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                disabled={isMuted}
              />
              <span className="volume-value">{volume}%</span>
            </div>

            {/* 静音按钮 */}
            <Tooltip title={isMuted ? '取消静音' : '静音'}>
              <Button
                type={isMuted ? 'primary' : 'default'}
                icon={<AudioOutlined />}
                onClick={handleToggleMute}
                className="mute-button"
              >
                {isMuted ? '取消静音' : '静音'}
              </Button>
            </Tooltip>

            {/* 输入设备选择 */}
            <Select
              placeholder="选择麦克风"
              value={selectedInputDevice}
              onChange={setSelectedInputDevice}
              className="device-select"
              suffixIcon={<SoundOutlined />}
            >
              {inputDevices.map(device => (
                <Select.Option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="control-buttons">
            <button className="btn-hangup" onClick={handleEndCall}>
              <span><PhoneFilled /></span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  // 渲染挂断后界面
  const renderEndedState = () => {
    // 按会话分组历史记录
    const groupedSessions = chatHistory.map(session => ({
      ...session,
    }));

    return (
      <div className="chat-history-section">
        <div className="chat-history-header">
          <h2>聊天记录</h2>
          <div className="header-actions">
            <Button
              icon={<RobotOutlined />}
              onClick={handleRecall}
              size="large"
              type="primary"
            >
              重新拨打
            </Button>
            <Button onClick={handleBackToIdle} size="large">
              返回
            </Button>
          </div>
        </div>

        {groupedSessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <div className="empty-text">暂无聊天记录</div>
          </div>
        ) : (
          <div className="chat-list">
            {groupedSessions.map(session => (
              <div key={session.id} className="session-group">
                <div className="session-separator">
                  <div className="line"></div>
                  <div className="session-info">
                    💬 {session.startTime} - {session.endTime}
                  </div>
                  <div className="line"></div>
                </div>

                {session.messages.map((message, messageIndex) => (
                  <div
                    key={`${session.id}-${messageIndex}`}
                    className={`chat-item ${message.role}`}
                  >
                    <div className="role">
                      {message.role === 'user' ? '👤 用户' : '🤖 AI 玩具'}
                    </div>
                    <div className="content">{message.content}</div>
                    <div className="time">{message.time}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout className="iot-toys-page">
      <div className="settings-container">
        <Settings
          onSettingsChange={handleSettingsChange}
          localStorageKey={localStorageKey}
          fields={['base_ws_url', 'bot_id', 'pat', 'voice_id', 'user_id']}
          className="settings-button"
        />
      </div>
      <Content className="iot-toys-container">
        {callState === 'idle' && renderIdleState()}
        {callState === 'calling' && renderCallingState()}
        {callState === 'connected' && renderCallingState()}
        {callState === 'ended' && renderEndedState()}
      </Content>

      {/* 音频配置模态框 */}
      <Modal
        title="音频配置"
        open={isConfigModalOpen}
        onCancel={() => setIsConfigModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsConfigModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={600}
        className="audio-config-modal"
      >
        <AudioConfig clientRef={clientRef} ref={audioConfigRef} />
      </Modal>
    </Layout>
  );
};

export default IoTToys;
