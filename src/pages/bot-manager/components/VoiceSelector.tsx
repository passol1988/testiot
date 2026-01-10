/**
 * VoiceSelector 组件
 * 音色选择器
 */

import { useState, useEffect } from 'react';
import { Card, Slider, Space, Radio, Tag } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import type { VoiceSelectorProps } from '../types';

interface VoiceOption {
  voice_id: string;
  voice_name: string;
  language: string;
}

const VoiceSelector = ({
  voiceId,
  pitch,
  speed,
  onVoiceChange,
  onPitchChange,
  onSpeedChange,
  supportEmotion
}: VoiceSelectorProps) => {
  const [voices, setVoices] = useState<VoiceOption[]>([]);

  useEffect(() => {
    // 模拟音色数据
    setVoices([
      { voice_id: 'zh_female_wan_warm', voice_name: '温婉女声', language: 'zh' },
      { voice_id: 'zh_male_calm', voice_name: '沉稳男声', language: 'zh' },
      { voice_id: 'zh_female_wan_tian', voice_name: '甜美女声', language: 'zh' },
      { voice_id: 'zh_male_warm', voice_name: '温暖男声', language: 'zh' },
    ]);
  }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      {/* 音色选择 */}
      <Card title="选择音色" size="small">
        <Radio.Group
          value={voiceId}
          onChange={(e) => onVoiceChange?.(e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {voices.map(voice => (
              <Radio
                key={voice.voice_id}
                value={voice.voice_id}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  marginBottom: 8,
                }}
              >
                <Space>
                  <AudioOutlined />
                  <span>{voice.voice_name}</span>
                  <Tag color="blue">{voice.language}</Tag>
                </Space>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Card>

      {/* 音调调节 */}
      <Card title="音调调节" size="small">
        <div style={{ padding: '0 8px' }}>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>低沉</span>
            <span style={{ fontWeight: 500 }}>{pitch.toFixed(1)}x</span>
            <span>高昂</span>
          </div>
          <Slider
            min={0.5}
            max={2.0}
            step={0.1}
            value={pitch}
            onChange={onPitchChange}
            marks={{
              0.5: '0.5x',
              1.0: '1.0x',
              1.5: '1.5x',
              2.0: '2.0x',
            }}
          />
        </div>
      </Card>

      {/* 语速调节 */}
      <Card title="语速调节" size="small">
        <div style={{ padding: '0 8px' }}>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>缓慢</span>
            <span style={{ fontWeight: 500 }}>{speed.toFixed(1)}x</span>
            <span>快速</span>
          </div>
          <Slider
            min={0.5}
            max={2.0}
            step={0.1}
            value={speed}
            onChange={onSpeedChange}
            marks={{
              0.5: '0.5x',
              1.0: '1.0x',
              1.5: '1.5x',
              2.0: '2.0x',
            }}
          />
        </div>
      </Card>

      {supportEmotion && (
        <Card size="small">
          <div style={{ textAlign: 'center', color: '#52C41A', fontSize: 13 }}>
            🎭 当前音色支持情感表达
          </div>
        </Card>
      )}
    </Space>
  );
};

export default VoiceSelector;
