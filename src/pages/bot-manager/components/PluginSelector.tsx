/**
 * PluginSelector 组件
 * 插件选择器
 */

import { Checkbox, Space } from 'antd';
import type { PluginSelectorProps } from '../types';

const PluginSelector = ({ value = [], onChange, options }: PluginSelectorProps) => {
  const handleChange = (checkedValues: string[]) => {
    onChange?.(checkedValues);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Checkbox.Group
        value={value}
        onChange={handleChange}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {options.map(plugin => (
            <Checkbox
              key={plugin.id}
              value={plugin.id}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                margin: 0,
              }}
            >
              <div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{plugin.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{plugin.description}</div>
              </div>
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </Space>
  );
};

export default PluginSelector;
