import { useRef, useState, useEffect } from 'react';

import { Button, message, Spin, Layout } from 'antd';
import { PhoneOutlined, PhoneFilled, MessageOutlined } from '@ant-design/icons';
import {
  WsChatClient,
  WsChatEventNames,
  WsToolsUtils,
} from '@coze/api/ws-tools';
import {
  type ConversationAudioTranscriptUpdateEvent,
  type CommonErrorEvent,
} from '@coze/api';

import './index.css';
import getConfig from '../../utils/config';
import Settings from '../../components/settings2';

const { Content } = Layout;

type CallState = 'idle' | 'calling' | 'connected' | 'ended';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const IoTToys = () => {
  const clientRef = useRef<WsChatClient>();
  const localStorageKey = 'iot-toys';
  const config = getConfig(localStorageKey);

  // 状态管理
  const [callState, setCallState] = useState<CallState>('idle');
  const [isConnecting, setIsConnecting] = useState(false);
  const [subtitleList, setSubtitleList] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // 获取音频设备
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');

  useEffect(() => {
    const getDevices = async () => {
      const devices = await WsToolsUtils.getAudioDevices();
      if (devices.audioInputs.length > 0) {
        setSelectedInputDevice(devices.audioInputs[0].deviceId);
      }
    };
    getDevices();
  }, []);

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

    const client = new WsChatClient({
      token: config.getPat(),
      baseWsURL: config.getBaseWsUrl(),
      allowPersonalAccessTokenInBrowser: true,
      botId: config.getBotId(),
      voiceId: config.getVoiceId(),
      workflowId: config.getWorkflowId() || undefined,
      deviceId: selectedInputDevice || undefined,
      audioMutedDefault: false,
    });

    clientRef.current = client;

    // 监听事件
    handleMessageEvent();
  }

  // 处理消息事件
  const handleMessageEvent = () => {
    clientRef.current?.on(
      WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE,
      (_, data) => {
        const event = data as ConversationAudioTranscriptUpdateEvent;
        if (event.data.content) {
          // 添加字幕
          const newMessage: ChatMessage = {
            role: 'assistant',
            content: event.data.content,
            time: new Date().toLocaleTimeString(),
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
  };

  // 开始通话
  const handleStartCall = async () => {
    try {
      setIsConnecting(true);
      setCallState('calling');

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

    // 保存聊天记录
    setChatHistory([...subtitleList]);
    setCallState('ended');
    setSubtitleList([]);
    message.success('通话已结束');
  };

  // 重新拨打
  const handleRecall = () => {
    setChatHistory([]);
    handleStartCall();
  };

  // 返回初始状态
  const handleBackToIdle = () => {
    setCallState('idle');
    setChatHistory([]);
    setSubtitleList([]);
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
        <PhoneOutlined style={{ fontSize: 32 }} />
        <span>开始对话</span>
      </button>
    </div>
  );

  // 渲染通话中界面
  const renderCallingState = () => (
    <div className="calling-section">
      {isConnecting && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#666' }}>正在连接...</div>
        </div>
      )}

      {!isConnecting && (
        <>
          <div className="call-header">
            <div className="call-status">
              <span className="status-dot"></span>
              <span>通话中</span>
            </div>
            <Settings
              onSettingsChange={handleSettingsChange}
              localStorageKey={localStorageKey}
              fields={['base_ws_url', 'bot_id', 'pat', 'voice_id', 'user_id']}
              className="settings-button"
            />
          </div>

          <div className="assistant-avatar">🤖</div>

          <div className="subtitle-section">
            <h3>实时字幕</h3>
            {subtitleList.length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
                等待对话内容...
              </div>
            )}
            {subtitleList.map((item, index) => (
              <div
                key={index}
                className={`subtitle-item ${item.role}`}
              >
                <div className="role">
                  {item.role === 'user' ? '你' : 'AI 助手'}
                </div>
                <div className="content">{item.content}</div>
              </div>
            ))}
          </div>

          <div className="control-buttons">
            <button className="btn-hangup" onClick={handleEndCall}>
              <PhoneFilled />
            </button>
          </div>
        </>
      )}
    </div>
  );

  // 渲染挂断后界面
  const renderEndedState = () => (
    <div className="chat-history-section">
      <div className="chat-history-header">
        <h2>聊天记录</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<MessageOutlined />} onClick={handleRecall}>
            重新拨打
          </Button>
          <Button onClick={handleBackToIdle}>返回</Button>
        </div>
      </div>

      {chatHistory.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
          暂无聊天记录
        </div>
      ) : (
        <div className="chat-list">
          {chatHistory.map((item, index) => (
            <div key={index} className={`chat-item ${item.role}`}>
              <div className="role">
                {item.role === 'user' ? '你' : 'AI 助手'}
              </div>
              <div className="content">{item.content}</div>
              <div className="time">{item.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
    </Layout>
  );
};

export default IoTToys;
