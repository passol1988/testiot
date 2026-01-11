/**
 * DatasetCard 组件
 * 知识库卡片
 */

import React from 'react';
import { Card, Avatar, Space, Button, Tag, Statistic, Row, Col } from 'antd';
import { FileTextOutlined, PictureOutlined, EditOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons';
import type { DatasetCardProps } from '../types';
import { DATASET_TYPE_MAP } from '../utils/constants';
import styles from '../styles';

const DatasetCard: React.FC<DatasetCardProps> = ({
  dataset,
  onEdit,
  onDelete,
  onManage,
}) => {
  const formatBytes = (bytes: string): string => {
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '0 B';
    if (num === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return Math.round(num / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('zh-CN');
  };

  const getDatasetIcon = () => {
    if (dataset.icon_url || dataset.avatar_url) {
      return (
        <Avatar
          size={48}
          src={dataset.icon_url || dataset.avatar_url}
        />
      );
    }
    const icon = dataset.format_type === 2
      ? <PictureOutlined style={{ fontSize: 24 }} />
      : <FileTextOutlined style={{ fontSize: 24 }} />;
    return (
      <Avatar
        size={48}
        style={{
          backgroundColor: dataset.format_type === 2 ? '#87d068' : '#1890ff',
        }}
        icon={icon}
      />
    );
  };

  return (
    <Card
      hoverable
      className="dataset-card"
      style={{
        ...styles.cardStyles.botCard,
        height: '100%',
      }}
    >
      {/* 头部：图标和基本信息 */}
      <div style={{ marginBottom: 16 }}>
        <Space size={12}>
          {getDatasetIcon()}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                marginBottom: 4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {dataset.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#8c8c8c',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {dataset.description || '暂无描述'}
            </div>
          </div>
        </Space>
      </div>

      {/* 标签 */}
      <div style={{ marginBottom: 16 }}>
        <Space size={8}>
          <Tag color="blue">
            {DATASET_TYPE_MAP[dataset.format_type]}
          </Tag>
          <Tag color={dataset.status === 1 ? 'success' : 'default'}>
            {dataset.status === 1 ? '已启用' : '未启用'}
          </Tag>
        </Space>
      </div>

      {/* 统计数据 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic
            title="文档数"
            value={dataset.doc_count}
            valueStyle={{ fontSize: 14 }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="分段数"
            value={dataset.slice_count}
            valueStyle={{ fontSize: 14 }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="使用"
            value={dataset.bot_used_count}
            valueStyle={{ fontSize: 14 }}
          />
        </Col>
      </Row>

      {/* 文件大小和更新时间 */}
      <div
        style={{
          fontSize: 12,
          color: '#8c8c8c',
          marginBottom: 16,
        }}
      >
        <div>总大小: {formatBytes(dataset.all_file_size)}</div>
        <div>更新时间: {formatTime(dataset.update_time)}</div>
      </div>

      {/* 操作按钮 */}
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          size="small"
          icon={<FolderOpenOutlined />}
          onClick={() => onManage(dataset.dataset_id)}
          style={styles.buttonStyles.botBtnPrimary}
        >
          管理
        </Button>
        <Space>
          {dataset.can_edit && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(dataset.dataset_id)}
            >
              编辑
            </Button>
          )}
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(dataset)}
          >
            删除
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default DatasetCard;
