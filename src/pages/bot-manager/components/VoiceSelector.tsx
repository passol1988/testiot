/**
 * VoiceSelector 组件
 * 音色选择器
 */

import { useState, useEffect, useRef } from 'react';
import { Card, Slider, Space, Select, Spin, Empty } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { CozeAPI } from '@coze/api';
import { getAuth } from '../utils/storage';
import type { VoiceSelectorProps } from '../types';

interface VoiceOption {
  voice_id: string;
  voice_name: string;
  language: string;
  is_system_voice?: boolean;
  support_emotions?: string[];
}

const PAGE_SIZE = 50;

const VoiceSelector = ({
  voiceId,
  speed,
  onVoiceChange,
  onSpeedChange,
  supportEmotion
}: VoiceSelectorProps) => {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const apiRef = useRef<CozeAPI | null>(null);

  // 初始化 API
  useEffect(() => {
    const auth = getAuth();
    if (auth?.pat) {
      apiRef.current = new CozeAPI({
        baseURL: 'https://api.coze.cn',
        token: auth.pat,
        allowPersonalAccessTokenInBrowser: true,
      });
    }
  }, []);

  // 加载音色列表
  const fetchVoices = async (pageNum: number, append = false) => {
    if (!apiRef.current) {
      setLoading(false);
      return;
    }

    try {
      const result = await apiRef.current.audio.voices.list({
        page_size: PAGE_SIZE,
        page_num: pageNum,
      });

      // 过滤出中文音色，并映射数据
      const chineseVoices = result.voice_list
        .filter(v => v.language_code === 'zh')
        .map(v => ({
          voice_id: v.voice_id,
          voice_name: v.name,
          language: v.language_code,
          is_system_voice: v.is_system_voice,
          support_emotions: v.support_emotions?.map(e => e.emotion || e.display_name || ''),
        }));

      if (append) {
        setVoices(prev => [...prev, ...chineseVoices]);
      } else {
        setVoices(chineseVoices);
      }

      // 检查是否还有更多数据
      const hasMoreData = result.has_more ?? (chineseVoices.length >= PAGE_SIZE);
      setHasMore(hasMoreData);
    } catch (error) {
      console.error('获取音色失败:', error);
      if (!append) {
        setVoices([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (apiRef.current) {
      fetchVoices(1, false);
    }
  }, [apiRef.current]);

  // 处理下拉框滚动
  const handlePopupScroll = (e: any) => {
    const target = e.target as HTMLElement;
    // 滚动到底部附近时加载更多
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
      if (!loadingMore && hasMore && apiRef.current) {
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        fetchVoices(nextPage, true);
      }
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      {/* 音色选择 */}
      <Card title="选择音色" size="small">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="small" />
            <div style={{ marginTop: 8, color: '#999' }}>加载音色中...</div>
          </div>
        ) : voices.length === 0 ? (
          <Empty description="暂无可用音色" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Select
            value={voiceId}
            onChange={(value) => onVoiceChange?.(value)}
            placeholder="请选择音色"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={voices.map(voice => ({
              value: voice.voice_id,
              label: voice.voice_name,
            }))}
            style={{ width: '100%' }}
            suffixIcon={<AudioOutlined />}
            onPopupScroll={handlePopupScroll}
            notFoundContent={<Empty description="未找到匹配音色" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            loading={loadingMore}
          />
        )}
      </Card>

      {/* 语速调节 */}
      <Card title="语速调节" size="small">
        <div style={{ padding: '0 8px' }}>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>缓慢 (0.5x)</span>
            <span style={{ fontWeight: 500 }}>{speed.toFixed(1)}x</span>
            <span>快速 (2.0x)</span>
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
          <div style={{ marginTop: 8, fontSize: 12, color: '#999', textAlign: 'center' }}>
            API speech_rate: {Math.round((speed - 1) * 100)}
          </div>
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
