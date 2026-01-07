import { useRef, useState, useEffect } from 'react';

import { Button, message, Layout, Select, Modal, Slider, Tooltip } from 'antd';
import {
  PhoneOutlined,
  PhoneFilled,
  SoundOutlined,
  SoundFilled,
  SettingOutlined,
} from '@ant-design/icons';
import {
  WsChatClient,
  WsChatEventNames,
  WsToolsUtils,
} from '@coze/api/ws-tools';
import {
  type CommonErrorEvent,
  type ConversationAudioTranscriptUpdateEvent,
} from '@coze/api';

import { AudioConfig, type AudioConfigRef } from '../../components/audio-config';

import './index.css';
import getConfig from '../../utils/config';
import ReceiveMessage from '../chat/receive-message';
import SentenceMessage, {
  type SentenceMessageRef,
} from '../chat/sentence-message';
import SendMessage from '../chat/send-message';

const { Content } = Layout;

type CallState = 'idle' | 'calling' | 'connected';



const IoTToys = () => {
  const clientRef = useRef<WsChatClient>();
  const audioConfigRef = useRef<AudioConfigRef>(null);
  const sentenceMessageRef = useRef<SentenceMessageRef>(null);
  const localStorageKey = 'iot-toys';
  const config = getConfig(localStorageKey);

  // 状态管理
  const [callState, setCallState] = useState<CallState>('idle');
  const [isConnecting, setIsConnecting] = useState(false);

  // 音频配置状态
  const [volume, setVolume] = useState(100);
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
    message.success('通话已结束');
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

  // 渲染初始状态界面
  const renderIdleState = () => (
    <div className="hero-section">
      <h1>生活物联网 AI 玩具演示平台</h1>
      <p>体验智能对话，开启物联网新时代</p>
      <div className="button-group">
        <Button
          type="primary"
          icon={<SettingOutlined />}
          onClick={() => setIsConfigModalOpen(true)}
          style={{ marginBottom: 20 }}
        >
          配置
        </Button>
      </div>
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
            </div>
          </div>

          <div className="assistant-avatar">🤖</div>

          {/* 发送文本消息 */}
          <SendMessage
            isConnected={callState === 'connected'}
            clientRef={clientRef}
            onSendText={(text: string) => {
              sentenceMessageRef.current?.addMessage(text);
            }}
          />

          {/* 显示实时识别结果 */}
          <div style={{ margin: '16px 0' }}>
            语音识别结果：{transcript}
          </div>

          {/* 根据回复模式选择对应的消息组件 */}
          {'stream' === 'stream' ? (
            <ReceiveMessage clientRef={clientRef} />
          ) : (
            <SentenceMessage ref={sentenceMessageRef} clientRef={clientRef} />
          )}

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
              />
              <span className="volume-value">{volume}%</span>
            </div>

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
