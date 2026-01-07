import { useRef, useState, useEffect } from 'react';

import { Button, message, Layout, Select, Modal, Slider, Tooltip } from 'antd';
import {
  PhoneOutlined,
  PhoneFilled,
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
  type CommonErrorEvent,
  type ConversationAudioTranscriptUpdateEvent,
} from '@coze/api';

import { AudioConfig, type AudioConfigRef } from '../../components/audio-config';

import './index.css';
import getConfig from '../../utils/config';
import Settings from '../../components/settings2';

const { Content } = Layout;

type CallState = 'idle' | 'calling' | 'connected';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
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

  // 音频配置状态
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

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
    // 监听消息完成事件，获取完整的对话消息（包含 role）
    clientRef.current?.on(
      WsChatEventNames.CONVERSATION_MESSAGE_COMPLETED,
      (_, data) => {
        const event = data as ConversationMessageCompletedEvent;
        const msgData = event.data as any;

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
        setCallState('idle');
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

    setCallState('idle');
    setSubtitleList([]);
    message.success('通话已结束');
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
