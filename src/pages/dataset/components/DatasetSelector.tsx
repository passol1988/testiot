/**
 * DatasetSelector 组件
 * 知识库多选器（用于 Bot 集成）
 */

import React from 'react';
import { Select, Typography } from 'antd';
import type { DatasetSelectorProps } from '../types';
import { DATASET_TYPE_MAP } from '../utils/constants';

const { Text } = Typography;

const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  value = [],
  onChange,
  disabled = false,
  datasets = [],
}) => {
  return (
    <div>
      <Select
        mode="multiple"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="选择知识库"
        style={{ width: '100%' }}
        options={datasets.map(d => ({
          label: `${d.name} (${DATASET_TYPE_MAP[d.format_type]})`,
          value: d.dataset_id,
        }))}
        filterOption={(input, option) =>
          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
        }
        showSearch
        allowClear
        maxTagCount={3}
        maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}...`}
      />
      {disabled && (
        <div style={{ marginTop: 4 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            提示：创建智能体后，可在编辑页面绑定知识库
          </Text>
        </div>
      )}
    </div>
  );
};

export default DatasetSelector;
