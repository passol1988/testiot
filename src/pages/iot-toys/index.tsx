import { useRef, useState, useEffect } from 'react';

import { Button, message, Layout, Select, Modal, Slider, Tooltip, Radio } from 'antd';
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

const localStorageKey = 'iot-toys';
const config = getConfig(localStorageKey);

// 获取回复模式配置
const getReplyMode = (): 'stream' | 'sentence' =>
  localStorage.getItem('replyMode') === 'sentence' ? 'sentence' : 'stream';



const IoTToys = () => {
  const clientRef = useRef<WsChatClient>();
  const audioConfigRef = useRef<AudioConfigRef>(null);
  const sentenceMessageRef = useRef<SentenceMessageRef>(null);

  // 状态管理
  const [callState, setCallState] = useState<CallState>('idle');
  const [isConnecting, setIsConnecting] = useState(false);

  // 音频配置状态
  const [volume, setVolume] = useState(100);
  const [transcript, setTranscript] = useState('');
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // 对话模式和回复模式
  const [turnDetectionType, setTurnDetectionType] = useState('server_vad');
  const [replyMode, setReplyMode] = useState<'stream' | 'sentence'>(
    getReplyMode(),
  );

  // 获取音频设备
  const [selectedInputDevice, setSelectedInputDevice] = useState<string>('');

  // 按键说话状态
  const [isPressRecording, setIsPressRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxRecordingTime = 60; // 最大录音时长（秒）
  const [isCancelRecording, setIsCancelRecording] = useState(false);
  const startTouchY = useRef<number>(0);

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
            type: turnDetectionType,
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

  // 处理按住说话按钮
  const handleVoiceButtonMouseDown = (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    if (
      callState === 'connected' &&
      clientRef.current &&
      turnDetectionType === 'client_interrupt'
    ) {
      startPressRecord(e);
    }
  };

  const handleVoiceButtonMouseUp = () => {
    if (isPressRecording && !isCancelRecording) {
      finishPressRecord();
    } else if (isPressRecording && isCancelRecording) {
      cancelPressRecord();
    }
  };

  const handleVoiceButtonMouseLeave = () => {
    if (isPressRecording) {
      cancelPressRecord();
    }
  };

  const handleVoiceButtonMouseMove = (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    if (isPressRecording && startTouchY.current) {
      // 上滑超过50px则取消发送
      const clientY =
        'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      if (clientY < startTouchY.current - 50) {
        setIsCancelRecording(true);
      } else {
        setIsCancelRecording(false);
      }
    }
  };

  // 开始按键录音
  const startPressRecord = async (e: React.MouseEvent | React.TouchEvent) => {
    if (callState === 'connected' && clientRef.current) {
      try {
        // 重置录音状态
        setIsPressRecording(true);
        setRecordingDuration(0);
        setIsCancelRecording(false);
        // Store initial touch position for determining sliding direction
        if ('clientY' in e) {
          startTouchY.current = (e as React.MouseEvent).clientY;
        } else if ('touches' in e && e.touches.length > 0) {
          startTouchY.current = e.touches[0].clientY;
        } else {
          startTouchY.current = 0;
        }

        // 开始录音
        await clientRef.current.startRecord();

        // 开始计时
        recordTimer.current = setInterval(() => {
          setRecordingDuration(prev => {
            const newDuration = prev + 1;
            // 超过最大录音时长自动结束
            if (newDuration >= maxRecordingTime) {
              finishPressRecord();
            }
            return newDuration;
          });
        }, 1000);
      } catch (error: any) {
        message.error(`开始录音错误: ${error.message || '未知错误'}`);
        console.trace('开始录音错误:', error);
        // Clean up timer if it was set
        if (recordTimer.current) {
          clearInterval(recordTimer.current);
          recordTimer.current = null;
        }
        // Reset recording state
        setIsPressRecording(false);
        setRecordingDuration(0);
      }
    }
  };

  // 结束按键录音并发送
  const finishPressRecord = () => {
    if (isPressRecording && clientRef.current) {
      try {
        // 停止计时
        if (recordTimer.current) {
          clearInterval(recordTimer.current);
          recordTimer.current = null;
        }

        // 如果录音时间太短（小于1秒），视为无效
        if (recordingDuration < 1) {
          cancelPressRecord();
          return;
        }

        // 停止录音并发送
        clientRef.current.stopRecord();
        setIsPressRecording(false);

        // 显示提示
        message.success(`发送了 ${recordingDuration} 秒的语音消息`);
      } catch (error: any) {
        message.error(`结束录音错误: ${error.message || '未知错误'}`);
        console.error('结束录音错误:', error);
      }
    }
  };

  // 取消按键录音
  const cancelPressRecord = async () => {
    if (isPressRecording && clientRef.current) {
      try {
        // 停止计时
        if (recordTimer.current) {
          clearInterval(recordTimer.current);
          recordTimer.current = null;
        }

        // 取消录音
        await clientRef.current?.stopRecord();
        setIsPressRecording(false);
        setIsCancelRecording(false);

        // 显示提示
        message.info('取消了语音消息');
      } catch (error: any) {
        message.error(`取消录音错误: ${error.message || '未知错误'}`);
        console.error('取消录音错误:', error);
      }
    }
  };

  // 清理资源
  useEffect(() => {
    return () => {
      if (recordTimer.current) {
        clearInterval(recordTimer.current);
      }
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
              <div className="mode-selector">
                <Tooltip title="选择对话模式">
                  <Radio.Group
                    value={turnDetectionType}
                    onChange={e => setTurnDetectionType(e.target.value)}
                    size="small"
                  >
                    <Radio.Button value="server_vad">自动检测</Radio.Button>
                    <Radio.Button value="client_interrupt">按键说话</Radio.Button>
                  </Radio.Group>
                </Tooltip>
              </div>
              <div className="mode-selector" style={{ marginLeft: '8px' }}>
                <Tooltip title="选择回复模式">
                  <Radio.Group
                    value={replyMode}
                    onChange={e => {
                      setReplyMode(e.target.value);
                      localStorage.setItem('replyMode', e.target.value);
                    }}
                    size="small"
                  >
                    <Radio.Button value="stream">流式</Radio.Button>
                    <Radio.Button value="sentence">音字同步</Radio.Button>
                  </Radio.Group>
                </Tooltip>
              </div>
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

          {/* 按键说话功能区 */}
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

              {/* 录音状态提示 */}
              {isPressRecording && (
                <div className="recording-status">
                  <div className="recording-time">
                    {Math.floor(recordingDuration / 60)
                      .toString()
                      .padStart(2, '0')}
                    :{(recordingDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="recording-progress-container">
                    <div
                      className="recording-progress"
                      style={{
                        width: `${(recordingDuration / maxRecordingTime) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div
                    className={`recording-tip ${isCancelRecording ? 'cancel-tip' : ''}`}
                  >
                    {isCancelRecording ? '松开手指，取消发送' : '上滑取消发送'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 根据回复模式选择对应的消息组件 */}
          {replyMode === 'stream' ? (
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
