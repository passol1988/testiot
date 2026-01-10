/**
 * Call Page - 通话页面
 * 语音通话界面
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, Select, Slider, message, Tooltip } from 'antd';
import {
  PhoneOutlined,
  PhoneFilled,
  SoundOutlined,
  SoundFilled,
  RobotOutlined,
} from '@ant-design/icons';
import { WsChatClient, WsChatEventNames, WsToolsUtils } from '@coze/api/ws-tools';
import type { CommonErrorEvent, ConversationAudioTranscriptUpdateEvent } from '@coze/api';

import { AudioConfig, type AudioConfigRef } from '../../../components/audio-config';
import ReceiveMessage from '../../chat/receive-message';
import SentenceMessage, { type SentenceMessageRef } from '../../chat/sentence-message';
import SendMessage from '../../chat/send-message';
import EventInput from '../../../components/event-input';
import IoTHeader from '../../iot-toys/IoTHeader';
import './call.css';
import { getAuth } from '../utils/storage';

const { Content } = Layout;

type CallState = 'idle' | 'calling' | 'connected';

// 获取回复模式配置
const getReplyMode = (): 'stream' | 'sentence' =>
  localStorage.getItem('replyMode') === 'sentence' ? 'sentence' : 'stream';

// Helper function to get chatUpdate config based on turn detection mode
const getChatUpdateConfig = (_botId: string, voiceId: string, turnDetectionType: string, _extConfig: any) => ({
  data: {
    input_audio: { format: 'pcm', codec: 'pcm', sample_rate: 48000 },
    output_audio: {
      codec: 'pcm',
      pcm_config: { sample_rate: 24000 },
      voice_id: voiceId || undefined,
    },
    turn_detection: { type: turnDetectionType },
    need_play_prologue: true,
  },
});

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
  const sentenceMessageRef = useRef<SentenceMessageRef>(null);
  const recordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTouchY = useRef<number>(0);

  // 状态管理
  const [callState, setCallState] = useState<CallState>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [durationTimer, setDurationTimer] = useState<NodeJS.Timeout | null>(null);

  // 找到对应的智能体信息
  const botInfo = botList.find(bot => bot.bot_id === botId) || {
    bot_id: botId || '',
    name: '智能助手',
    description: '',
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
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');

  // 对话模式和回复模式
  const [turnDetectionType] = useState('server_vad');
  const [replyMode] = useState<'stream' | 'sentence'>(getReplyMode());

  // 按键说话状态
  const [isPressRecording, setIsPressRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isCancelRecording, setIsCancelRecording] = useState(false);
  const maxRecordingTime = 60;

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
      setInputDevices(devices.audioInputs);
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
  }, [callState]);

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
      baseWsURL: 'wss://ws.coze.cn/v1',
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

      const chatUpdate: any = getChatUpdateConfig(botId || '', extConfig.voiceId, turnDetectionType, extConfig);
      if (chatUpdate.data.output_audio.voice_id === '') {
        delete chatUpdate.data.output_audio.voice_id;
      }

      await clientRef.current?.connect({ chatUpdate });
      setCallState('connected');
      message.success('通话已连接');
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
   * 按键说话
   */
  const handleVoiceButtonMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (callState === 'connected' && clientRef.current && turnDetectionType === 'client_interrupt') {
      startPressRecord(e);
    }
  };

  const handleVoiceButtonMouseUp = () => {
    if (isPressRecording && !isCancelRecording) finishPressRecord();
    else if (isPressRecording && isCancelRecording) cancelPressRecord();
  };

  const handleVoiceButtonMouseLeave = () => {
    if (isPressRecording) cancelPressRecord();
  };

  const handleVoiceButtonMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPressRecording && startTouchY.current) {
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      if (clientY < startTouchY.current - 50) setIsCancelRecording(true);
      else setIsCancelRecording(false);
    }
  };

  const startPressRecord = async (e: React.MouseEvent | React.TouchEvent) => {
    if (callState === 'connected' && clientRef.current) {
      try {
        setIsPressRecording(true);
        setRecordingDuration(0);
        setIsCancelRecording(false);
        if ('clientY' in e) startTouchY.current = (e as React.MouseEvent).clientY;
        else if ('touches' in e && e.touches.length > 0) startTouchY.current = e.touches[0].clientY;
        else startTouchY.current = 0;
        await clientRef.current.startRecord();
        recordTimer.current = setInterval(() => {
          setRecordingDuration(prev => {
            const newDuration = prev + 1;
            if (newDuration >= maxRecordingTime) finishPressRecord();
            return newDuration;
          });
        }, 1000);
      } catch (error: any) {
        message.error(`开始录音错误: ${error.message || '未知错误'}`);
        if (recordTimer.current) clearInterval(recordTimer.current);
        recordTimer.current = null;
        setIsPressRecording(false);
        setRecordingDuration(0);
      }
    }
  };

  const finishPressRecord = () => {
    if (isPressRecording && clientRef.current) {
      try {
        if (recordTimer.current) clearInterval(recordTimer.current);
        recordTimer.current = null;
        if (recordingDuration < 1) {
          cancelPressRecord();
          return;
        }
        clientRef.current.stopRecord();
        setIsPressRecording(false);
        message.success(`发送了 ${recordingDuration} 秒的语音消息`);
      } catch (error: any) {
        message.error(`结束录音错误: ${error.message || '未知错误'}`);
      }
    }
  };

  const cancelPressRecord = async () => {
    if (isPressRecording && clientRef.current) {
      try {
        if (recordTimer.current) clearInterval(recordTimer.current);
        recordTimer.current = null;
        await clientRef.current?.stopRecord();
        setIsPressRecording(false);
        setIsCancelRecording(false);
        message.info('取消了语音消息');
      } catch (error: any) {
        message.error(`取消录音错误: ${error.message || '未知错误'}`);
      }
    }
  };

  // 清理
  useEffect(() => {
    return () => {
      if (recordTimer.current) clearInterval(recordTimer.current);
      if (clientRef.current) clientRef.current.disconnect();
    };
  }, []);

  const onSendText = useCallback((text: string) => {
    sentenceMessageRef.current?.addMessage(text);
  }, []);

  // 高级配置内容
  const advancedSettingsContent = (
    <div style={{ width: 300 }}>
      <AudioConfig clientRef={clientRef} ref={audioConfigRef} />
      <EventInput
        defaultValue={JSON.stringify(getChatUpdateConfig(botId || '', extConfig.voiceId, turnDetectionType, extConfig), null, 2)}
      />
    </div>
  );

  /**
   * 渲染空闲状态
   */
  const renderIdleState = () => (
    <div className="call-content">
      <div className="call-avatar-container">
        <img
          src={botInfo.icon_url}
          alt={botInfo.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://files.coze.cn/files/default-avatar.png';
          }}
        />
      </div>

      <div className="call-bot-name">{botInfo.name}</div>
      <div className="call-bot-description">{botInfo.description || '点击下方按钮开始通话'}</div>

      <button
        className="call-action-button call-start-button"
        onClick={handleStartCall}
      >
        <PhoneOutlined style={{ fontSize: 28, color: 'white' }} />
      </button>
      <div style={{ marginTop: 16, fontSize: 14, opacity: 0.8 }}>点击开始通话</div>
    </div>
  );

  /**
   * 渲染呼叫中状态
   */
  const renderCallingState = () => (
    <div className="call-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="call-avatar-container">
        <img
          src={botInfo.icon_url}
          alt={botInfo.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://files.coze.cn/files/default-avatar.png';
          }}
        />
      </div>

      <div className="call-bot-name">正在连接...</div>
      <div className="call-bot-description">请稍候</div>

      <div className="audio-wave-container">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="audio-wave-bar" />
        ))}
      </div>
    </div>
  );

  /**
   * 渲染通话中状态
   */
  const renderConnectedState = () => (
    <div className="call-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="call-avatar-container">
        <img
          src={botInfo.icon_url}
          alt={botInfo.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://files.coze.cn/files/default-avatar.png';
          }}
        />
      </div>

      <div className="call-bot-name">{botInfo.name}</div>
      <div className="call-bot-description" style={{ fontSize: 18 }}>
        {formatDuration(callDuration)}
      </div>

      <SendMessage isConnected={callState === 'connected'} clientRef={clientRef} onSendText={onSendText} />
      <div style={{ margin: '16px 0' }}>语音识别结果：{transcript}</div>

      {turnDetectionType === 'client_interrupt' && callState === 'connected' && (
        <div style={{ maxWidth: '400px', margin: '0 auto 16px' }}>
          <div
            className={`voice-button ${isPressRecording ? 'recording' : ''}`}
            onMouseDown={handleVoiceButtonMouseDown}
            onMouseUp={handleVoiceButtonMouseUp}
            onMouseLeave={handleVoiceButtonMouseLeave}
            onMouseMove={handleVoiceButtonMouseMove}
            onTouchStart={handleVoiceButtonMouseDown}
            onTouchEnd={handleVoiceButtonMouseUp}
            onTouchCancel={handleVoiceButtonMouseLeave}
            onTouchMove={handleVoiceButtonMouseMove}
          >
            {isPressRecording ? '松开 发送' : '按住 说话'}
          </div>
          {isPressRecording && (
            <div className="recording-status">
              <div className="recording-time">{Math.floor(recordingDuration / 60).toString().padStart(2, '0')}:{(recordingDuration % 60).toString().padStart(2, '0')}</div>
              <div className="recording-progress-container">
                <div className="recording-progress" style={{ width: `${(recordingDuration / maxRecordingTime) * 100}%` }}></div>
              </div>
              <div className={`recording-tip ${isCancelRecording ? 'cancel-tip' : ''}`}>{isCancelRecording ? '松开手指，取消发送' : '上滑取消发送'}</div>
            </div>
          )}
        </div>
      )}

      {replyMode === 'stream' ? <ReceiveMessage clientRef={clientRef} /> : <SentenceMessage ref={sentenceMessageRef} clientRef={clientRef} />}

      <div className="control-panel">
        <div className="volume-control">
          <Tooltip title={`音量: ${volume}%`}>
            <div className="volume-icon">{volume > 0 ? <SoundFilled /> : <SoundOutlined />}</div>
          </Tooltip>
          <Slider min={0} max={100} value={volume} onChange={handleVolumeChange} className="volume-slider" />
          <span className="volume-value">{volume}%</span>
        </div>
        <Select placeholder="选择麦克风" value={selectedInputDevice} onChange={setSelectedInputDevice} className="device-select" suffixIcon={<SoundOutlined />}>
          {inputDevices.map(device => (<Select.Option key={device.deviceId} value={device.deviceId}>{device.label}</Select.Option>))}
        </Select>
      </div>

      <button
        className="call-action-button call-hangup-button"
        onClick={handleEndCall}
      >
        <PhoneFilled style={{ fontSize: 28, color: 'white' }} />
      </button>
      <div style={{ marginTop: 16, fontSize: 14, opacity: 0.8 }}>点击结束通话</div>
    </div>
  );

  return (
    <Layout className="iot-toys-page" style={{ height: '100%' }}>
      <IoTHeader
        title={botInfo.name}
        advancedSettingsContent={advancedSettingsContent}
        extraContent={
          <Button type="default" icon={<RobotOutlined />} onClick={() => navigate('/bot-manager')}>
            返回列表
          </Button>
        }
      />
      <Content className="iot-toys-container">
        {callState === 'idle' && renderIdleState()}
        {callState === 'calling' && renderCallingState()}
        {callState === 'connected' && renderConnectedState()}
      </Content>
    </Layout>
  );
};

export default CallPage;
