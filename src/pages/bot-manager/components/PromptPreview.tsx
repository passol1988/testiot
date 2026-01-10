/**
 * PromptPreview 组件
 * Prompt 预览弹窗
 */

import { Drawer } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { PromptPreviewProps } from '../types';
import { formatPromptForPreview } from '../utils/prompt-template';

const PromptPreview = ({ prompt, visible, onToggle }: PromptPreviewProps) => {
  return (
    <>
      {/* 预览触发按钮 */}
      <Button
        size="small"
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          borderRadius: 16,
          padding: '4px 12px',
        }}
      >
        <EyeOutlined />
        预览 Prompt
      </Button>

      {/* 预览弹窗 */}
      <Drawer
        title="Prompt 预览"
        placement="right"
        onClose={onToggle}
        open={visible}
        width={480}
        styles={{
          body: { padding: 16 },
        }}
      >
        <div className="prompt-preview-content">
          {formatPromptForPreview(prompt)}
        </div>

        <div style={{
          marginTop: 16,
          padding: 12,
          background: '#FFF3E0',
          borderRadius: 8,
          fontSize: 12,
          color: '#F57C00',
        }}>
          <strong>提示：</strong>
          <br />
          • 总长度：{prompt.length} 字符
          <br />
          • 限制：最大 4000 字符
          <br />
          {prompt.length > 4000 && (
            <span style={{ color: '#D32F2F' }}>
              ⚠️ 当前 Prompt 超过长度限制，请精简内容
            </span>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default PromptPreview;
