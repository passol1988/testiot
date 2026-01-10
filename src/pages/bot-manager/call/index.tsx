/**
 * Call Page - 通话页面
 * 语音通话界面
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Slider } from 'antd';
import {
  ArrowLeftOutlined,
  SettingOutlined,
  PhoneOutlined,
  PhoneFilled,
  CaretUpOutlined,
} from '@ant-design/icons';
import type { CallState, TurnDetectionType, ReplyMode } from '../types';
import type { BotInfo } from '../types';
import { isLoggedIn } from '../utils/storage';
import './call.css';

/**
 * CallPage 组件
 */
const CallPage = () => {
  const { botId } = useParams<{ botId: string }>();
  const navigate = useNavigate();

  // 状态管理
  const [callState, setCallState] = useState<CallState>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [botInfo, setBotInfo] = useState<BotInfo>({
    bot_id: botId || '',
    name: '智能助手',
    description: '',
    icon_url: '',
    is_published: false,
    create_time: 0,
    update_time: 0,
  });
  const [advancedConfigVisible, setAdvancedConfigVisible] = useState(false);
  const [turnDetectionType, setTurnDetectionType] = useState<TurnDetectionType>('server_vad');
  const [replyMode, setReplyMode] = useState<ReplyMode>('sentence');
  const [silenceDuration, setSilenceDuration] = useState(500);

  // 计时器引用
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/bot-manager');
    }
  }, [navigate]);

  // 加载智能体信息
  useEffect(() => {
    if (botId) {
      // TODO: 从 API 加载智能体信息
      setBotInfo({
        bot_id: botId,
        name: '智能助手',
        description: '这是一个智能助手',
        icon_url: 'https://files.coze.cn/files/default-avatar.png',
        is_published: true,
        create_time: Date.now(),
        update_time: Date.now(),
      });
    }
  }, [botId]);

  // 通话计时
  useEffect(() => {
    if (callState === 'connected') {
      durationTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    }

    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
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
   * 开始通话
   */
  const handleStartCall = useCallback(() => {
    setCallState('calling');

    // 模拟连接过程
    setTimeout(() => {
      setCallState('connected');
    }, 2000);
  }, []);

  /**
   * 结束通话
   */
  const handleEndCall = useCallback(() => {
    setCallState('idle');
    setCallDuration(0);
  }, []);

  /**
   * 返回列表
   */
  const handleBack = useCallback(() => {
    if (callState === 'connected') {
      Modal.confirm({
        title: '确认结束通话？',
        content: '通话正在进行中，确定要结束并返回吗？',
        okText: '结束通话',
        cancelText: '取消',
        onOk: () => {
          handleEndCall();
          navigate('/bot-manager');
        },
      });
    } else {
      navigate('/bot-manager');
    }
  }, [callState, navigate, handleEndCall]);

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

      <div className="audio-wave-container">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="audio-wave-bar" />
        ))}
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
    <div className="call-page-container">
      {/* 头部 */}
      <div className="call-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ color: 'white' }}
          >
            返回
          </Button>

          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {botInfo.name}
          </div>

          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setAdvancedConfigVisible(true)}
            style={{ color: 'white' }}
          >
            设置
          </Button>
        </div>

        {callState === 'connected' && (
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 14, opacity: 0.8 }}>
            {formatDuration(callDuration)}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      {callState === 'idle' && renderIdleState()}
      {callState === 'calling' && renderCallingState()}
      {callState === 'connected' && renderConnectedState()}

      {/* 高级配置弹窗 */}
      <Modal
        title="高级配置"
        open={advancedConfigVisible}
        onCancel={() => setAdvancedConfigVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAdvancedConfigVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          {/* 对话模式 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>对话模式</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div
                className={`selector-card ${turnDetectionType === 'server_vad' ? 'selected' : ''}`}
                onClick={() => setTurnDetectionType('server_vad')}
                style={{ flex: 1 }}
              >
                <CaretUpOutlined style={{ fontSize: 20, marginBottom: 4 }} />
                <div style={{ fontSize: 12 }}>自动检测</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>服务端 VAD</div>
              </div>
              <div
                className={`selector-card ${turnDetectionType === 'client_interrupt' ? 'selected' : ''}`}
                onClick={() => setTurnDetectionType('client_interrupt')}
                style={{ flex: 1 }}
              >
                <PhoneOutlined style={{ fontSize: 20, marginBottom: 4 }} />
                <div style={{ fontSize: 12 }}>按键说话</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>手动控制</div>
              </div>
            </div>
          </div>

          {/* 回复模式 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>回复模式</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div
                className={`selector-card ${replyMode === 'stream' ? 'selected' : ''}`}
                onClick={() => setReplyMode('stream')}
                style={{ flex: 1 }}
              >
                <div style={{ fontSize: 12 }}>流式回复</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>实时输出</div>
              </div>
              <div
                className={`selector-card ${replyMode === 'sentence' ? 'selected' : ''}`}
                onClick={() => setReplyMode('sentence')}
                style={{ flex: 1 }}
              >
                <div style={{ fontSize: 12 }}>整句回复</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>更自然</div>
              </div>
            </div>
          </div>

          {/* 静音时长 */}
          {turnDetectionType === 'server_vad' && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                静音检测时长：{silenceDuration}ms
              </div>
              <Slider
                min={200}
                max={2000}
                step={100}
                value={silenceDuration}
                onChange={setSilenceDuration}
                marks={{
                  200: '200ms',
                  500: '500ms',
                  1000: '1000ms',
                  2000: '2000ms',
                }}
              />
              <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                检测到静音多长时间后开始回复
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CallPage;
