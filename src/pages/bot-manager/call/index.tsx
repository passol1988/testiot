/**
 * Call Page - 通话页面（重新设计版）
 * 分屏布局 + 状态切换动画
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, Slider, message, Tooltip } from 'antd';
import {
  PhoneOutlined,
  PhoneFilled,
  SoundOutlined,
  SoundFilled,
  RobotOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { WsChatClient, WsChatEventNames, WsToolsUtils } from '@coze/api/ws-tools';
import type { CommonErrorEvent, ConversationAudioTranscriptUpdateEvent } from '@coze/api';

import { AudioConfig, type AudioConfigRef } from '../../../components/audio-config';
import SendMessage from '../../chat/send-message';
import EventInput from '../../../components/event-input';
import IoTHeader from '../../iot-toys/IoTHeader';
import { getAuth } from '../utils/storage';
import ChatMessageList from './components/ChatMessageList';
import VoiceSelector from '../components/VoiceSelector';

const { Content } = Layout;

type CallState = 'idle' | 'calling' | 'connected';

interface CallPageProps {
  botList: Array<{
    bot_id: string;
    name: string;
    description: string;
    icon_url: string;
    is_published: boolean;
    create_time: number;
    update_time: number;
  }>;
}

/**
 * CallPage 组件
 */
const CallPage = ({ botList }: CallPageProps) => {
  const { botId } = useParams<{ botId: string }>();
  const navigate = useNavigate();
  const auth = getAuth();

  // Refs
  const clientRef = useRef<WsChatClient>();
  const audioConfigRef = useRef<AudioConfigRef>(null);

  // 状态管理
  const [callState, setCallState] = useState<CallState>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [durationTimer, setDurationTimer] = useState<NodeJS.Timeout | null>(null);

  // 找到对应的智能体信息
  const botInfo = botList.find(bot => bot.bot_id === botId) || {
    bot_id: botId || '',
    name: '智能助手',
    description: '点击开始通话',
    icon_url: 'https://files.coze.cn/files/default-avatar.png',
    is_published: false,
    create_time: 0,
    update_time: 0,
  };

  // 获取扩展配置
  const getExtConfig = useCallback(() => {
    const ext = localStorage.getItem(`bot-manager_ext_${botId}`);
    return ext ? JSON.parse(ext) : { voiceId: '', voicePitch: 1, voiceSpeed: 1 };
  }, [botId]);

  const extConfig = getExtConfig();

  // 音频配置状态
  const [volume, setVolume] = useState(100);
  const [transcript, setTranscript] = useState('');
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');

  // TTS 设置状态
  const [ttsVisible, setTtsVisible] = useState(false);
  const [localVoiceId, setLocalVoiceId] = useState(extConfig.voiceId || '');
  const [localVoicePitch, setLocalVoicePitch] = useState(extConfig.voicePitch || 1);
  const [localVoiceSpeed, setLocalVoiceSpeed] = useState(extConfig.voiceSpeed || 1);

  // 检查登录状态
  useEffect(() => {
    if (!auth) {
      navigate('/bot-manager');
    }
  }, [auth, navigate]);

  // 获取音频设备
  useEffect(() => {
    const getDevices = async () => {
      const devices = await WsToolsUtils.getAudioDevices();
      if (devices.audioInputs.length > 0) {
        setSelectedInputDevice(devices.audioInputs[0].deviceId);
      }
    };
    getDevices();
  }, []);

  // 通话计时
  useEffect(() => {
    if (callState === 'connected') {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      setDurationTimer(timer);
    } else {
      if (durationTimer) {
        clearInterval(durationTimer);
        setDurationTimer(null);
      }
    }

    return () => {
      if (durationTimer) {
        clearInterval(durationTimer);
      }
    };
  }, [callState, durationTimer]);

  /**
   * 格式化通话时长
   */
  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * 初始化客户端
   */
  const initClient = async () => {
    if (!auth) {
      throw new Error('请先登录');
    }
    if (!botId) {
      throw new Error('智能体 ID 不存在');
    }

    const permission = await WsToolsUtils.checkDevicePermission();
    if (!permission.audio) throw new Error('需要麦克风访问权限');

    const audioConfig = audioConfigRef.current?.getSettings();
    const client = new WsChatClient({
      token: auth.pat,
      baseWsURL: 'wss://ws.coze.cn',
      allowPersonalAccessTokenInBrowser: true,
      botId: botId,
      debug: audioConfig?.debug,
      voiceId: extConfig.voiceId || undefined,
      aiDenoisingConfig: !audioConfig?.noiseSuppression ? {
        mode: audioConfig?.denoiseMode,
        level: audioConfig?.denoiseLevel,
        assetsPath: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket',
      } : undefined,
      audioCaptureConfig: {
        echoCancellation: audioConfig?.echoCancellation,
        noiseSuppression: audioConfig?.noiseSuppression,
        autoGainControl: audioConfig?.autoGainControl,
      },
      wavRecordConfig: { enableSourceRecord: false, enableDenoiseRecord: false },
      deviceId: selectedInputDevice || undefined,
      audioMutedDefault: false,
      enableLocalLoopback: audioConfig?.isHuaweiMobile,
    });

    if (!audioConfig?.noiseSuppression && !WsToolsUtils.checkDenoiserSupport()) {
      message.info('当前浏览器不支持AI降噪');
    }

    clientRef.current = client;
    handleMessageEvent();
  };

  /**
   * 处理消息事件
   */
  const handleMessageEvent = () => {
    clientRef.current?.on(WsChatEventNames.SERVER_ERROR, (_, event: unknown) => {
      console.log('[bot-manager-call] error', event);
      message.error(`发生错误：${(event as CommonErrorEvent)?.data?.msg}`);
      clientRef.current?.disconnect();
      clientRef.current = undefined;
      setCallState('idle');
    });
    clientRef.current?.on(WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE, (_, data) => {
      const event = data as ConversationAudioTranscriptUpdateEvent;
      if (event.data.content) setTranscript(event.data.content);
    });
  };

  /**
   * 开始通话
   */
  const handleStartCall = async () => {
    try {
      setCallState('calling');
      if (!clientRef.current) await initClient();

      const chatUpdate: any = {
        event_type: 'chat.update',
        data: {
          input_audio: { format: 'pcm', codec: 'pcm', sample_rate: 48000 },
          output_audio: {
            codec: 'pcm',
            pcm_config: { sample_rate: 24000 },
            voice_id: extConfig.voiceId || undefined,
          },
          turn_detection: { type: 'server_vad' },
          need_play_prologue: true,
        },
      };
      if (chatUpdate.data.output_audio.voice_id === '') {
        delete chatUpdate.data.output_audio.voice_id;
      }

      await clientRef.current?.connect({ chatUpdate });

      // 连接成功后切换到分屏布局
      setTimeout(() => {
        setCallState('connected');
      }, 500);
    } catch (error) {
      console.error(error);
      message.error(`连接错误：${(error as Error).message}`);
      setCallState('idle');
    }
  };

  /**
   * 结束通话
   */
  const handleEndCall = async () => {
    if (clientRef.current) {
      await clientRef.current.disconnect();
      clientRef.current = undefined;
    }
    setCallState('idle');
    setCallDuration(0);
    if (durationTimer) {
      clearInterval(durationTimer);
      setDurationTimer(null);
    }
    message.success('通话已结束');
  };

  /**
   * 音量变化
   */
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (clientRef.current) clientRef.current.setPlaybackVolume(value / 100);
  };

  /**
   * 静音切换
   */
  const [isMicMuted, setIsMicMuted] = useState(false);

  const handleMicToggle = async () => {
    const newState = !isMicMuted;
    setIsMicMuted(newState);
    if (clientRef.current) {
      try {
        await clientRef.current.setAudioEnable(!newState);
        message.success(newState ? '麦克风已静音' : '麦克风已开启');
      } catch (error) {
        message.error(`切换麦克风状态失败：${error}`);
        // 恢复状态
        setIsMicMuted(!newState);
      }
    }
  };

  // 清理
  useEffect(() => {
    return () => {
      if (clientRef.current) clientRef.current.disconnect();
    };
  }, []);

  // 文本消息发送回调（SendMessage 组件需要但当前不使用）
  const onSendText = useCallback((_text: string) => {
    // 用户发送的文本消息，ChatMessageList 会自动监听并显示
  }, []);

  // 高级配置内容
  const advancedSettingsContent = (
    <div style={{ width: 300 }}>
      <AudioConfig clientRef={clientRef} ref={audioConfigRef} />
      <EventInput
        defaultValue={JSON.stringify({
          event_type: 'chat.update',
          data: {
            input_audio: { format: 'pcm', codec: 'pcm', sample_rate: 48000 },
            output_audio: {
              codec: 'pcm',
              pcm_config: { sample_rate: 24000 },
              voice_id: extConfig.voiceId,
            },
            turn_detection: { type: 'server_vad' },
            need_play_prologue: true,
          },
        }, null, 2)}
      />
    </div>
  );

  // TTS 设置内容
  const ttsSettingsContent = (
    <div style={{ width: 320 }}>
      <VoiceSelector
        voiceId={localVoiceId}
        pitch={localVoicePitch}
        speed={localVoiceSpeed}
        onVoiceChange={setLocalVoiceId}
        onPitchChange={setLocalVoicePitch}
        onSpeedChange={setLocalVoiceSpeed}
        supportEmotion={false}
      />
      <Button
        type="primary"
        block
        style={{ marginTop: 16 }}
        onClick={() => {
          const newExtConfig = { voiceId: localVoiceId, voicePitch: localVoicePitch, voiceSpeed: localVoiceSpeed };
          localStorage.setItem(`bot-manager_ext_${botId}`, JSON.stringify(newExtConfig));
          message.success('TTS设置已保存，重新连接后生效');
          setTtsVisible(false);
        }}
      >
        保存设置
      </Button>
    </div>
  );

  /**
   * 渲染空闲状态（居中布局）
   */
  const renderIdleState = () => (
    <div className="call-state call-state--idle">
      <div className="idle-state">
        <div className="avatar-container avatar-float">
          <img
            src={botInfo.icon_url}
            alt={botInfo.name}
            className="avatar avatar-large"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://files.coze.cn/files/default-avatar.png';
            }}
          />
        </div>

        <h1 className="bot-name">{botInfo.name}</h1>
        <p className="bot-description">{botInfo.description}</p>

        <button className="start-call-button" onClick={handleStartCall}>
          <PhoneOutlined style={{ fontSize: 28, marginRight: 8 }} />
          开始通话
        </button>
      </div>
    </div>
  );

  /**
   * 渲染呼叫中状态（居中布局 + 音浪）
   */
  const renderCallingState = () => (
    <div className="call-state call-state--calling">
      <div className="calling-state">
        <div className="avatar-container">
          <img
            src={botInfo.icon_url}
            alt={botInfo.name}
            className="avatar avatar-large"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://files.coze.cn/files/default-avatar.png';
            }}
          />
          <div className="audio-ripple"></div>
          <div className="audio-ripple"></div>
          <div className="audio-ripple"></div>
        </div>

        <p className="connecting-text">正在连接...</p>
      </div>
    </div>
  );

  /**
   * 渲染通话中状态（分屏布局）
   */
  const renderConnectedState = () => (
    <div className="call-state call-state--connected">
      {/* 左侧面板 */}
      <div className="left-panel">
        <img
          src={botInfo.icon_url}
          alt={botInfo.name}
          className="avatar avatar-medium"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://files.coze.cn/files/default-avatar.png';
          }}
        />

        <div className="call-info">
          <div className="call-timer">{formatDuration(callDuration)}</div>
        </div>

        <div className="audio-waves">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="audio-wave-bar" />
          ))}
        </div>

        <div className="control-buttons">
          <button
            className={`control-button microphone ${isMicMuted ? 'muted' : ''}`}
            onClick={handleMicToggle}
          >
            <span className="mic-icon">{isMicMuted ? '🔇' : '🎙️'}</span>
          </button>

          <button className="control-button hangup" onClick={handleEndCall}>
            <PhoneFilled style={{ fontSize: 24, color: 'white' }} />
          </button>
        </div>
      </div>

      {/* 右侧对话区域 */}
      <div className="right-panel chat-area">
        <div className="chat-messages">
          <SendMessage isConnected={true} clientRef={clientRef} onSendText={onSendText} />
          <div className="transcript">语音识别：{transcript || '...'}</div>
          <ChatMessageList clientRef={clientRef} />
        </div>

        {/* 音量控制 */}
        <div className="volume-control">
          <Tooltip title={`音量: ${volume}%`}>
            <span className="volume-icon">{volume > 0 ? <SoundFilled /> : <SoundOutlined />}</span>
          </Tooltip>
          <Slider min={0} max={100} value={volume} onChange={handleVolumeChange} className="volume-slider" />
        </div>
      </div>
    </div>
  );

  return (
    <Layout className="call-page-container" style={{ height: '100%' }}>
      <IoTHeader
        title={botInfo.name}
        advancedSettingsContent={advancedSettingsContent}
        ttsButton={
          <Button
            icon={<AudioOutlined />}
            onClick={() => setTtsVisible(true)}
          >
            TTS设置
          </Button>
        }
        ttsSettingsContent={ttsSettingsContent}
        ttsVisible={ttsVisible}
        onTtsVisibleChange={setTtsVisible}
        extraContent={
          <Button type="default" icon={<RobotOutlined />} onClick={() => navigate('/bot-manager')}>
            返回列表
          </Button>
        }
      />
      <Content className="call-page-content">
        {callState === 'idle' && renderIdleState()}
        {callState === 'calling' && renderCallingState()}
        {callState === 'connected' && renderConnectedState()}
      </Content>
    </Layout>
  );
};

export default CallPage;
