/**
 * DatasetDetail 组件
 * 知识库详情页
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tabs, Space, Descriptions, Tag, message, Modal } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import type { DatasetDetailProps } from '../types';
import { DatasetFormatType } from '../types';
import { DATASET_TYPE_MAP } from '../utils/constants';
import { useDatasetApi } from '../hooks/use-dataset-api';
import FileList from './FileList';
import ImageGrid from './ImageGrid';
import FileUploadModal from './FileUploadModal';
import UploadProgressModal from './UploadProgressModal';
import styles from '../styles';

const DatasetDetail: React.FC<DatasetDetailProps> = ({
  datasetId,
  dataset: propDataset,
  onBack,
  onEdit,
}) => {
  const navigate = useNavigate();
  const api = useDatasetApi();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [progressData] = useState<any[]>([]);

  const dataset = propDataset;
  const formatType = dataset?.format_type ?? DatasetFormatType.TEXT;
  const captionType = dataset?.chunk_strategy.caption_type ?? 0;

  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除知识库',
      content: (
        <div>
          <p>确定删除知识库 <strong>{dataset?.name}</strong> 吗？</p>
          <p style={{ color: '#ff4d4f' }}>
            此操作将删除知识库及其所有文件，且无法撤销。
          </p>
        </div>
      ),
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // await api.deleteDataset(datasetId);
          message.success('知识库删除成功');
          navigate('/datasets');
        } catch (error) {
          message.error('知识库删除失败');
        }
      },
    });
  };

  const handleUploadSuccess = () => {
    setUploadModalVisible(false);
    // 触发文件列表刷新
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN');
  };

  const formatBytes = (bytes: string): string => {
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '0 B';
    if (num === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return Math.round(num / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!dataset) {
    return (
      <div className="dataset-detail" style={styles.containerStyles}>
        <div style={{ textAlign: 'center', padding: 100 }}>
          知识库不存在
        </div>
      </div>
    );
  }

  const isImageType = dataset.format_type === DatasetFormatType.IMAGE;

  return (
    <div className="dataset-detail" style={styles.containerStyles}>
      {/* 头部 */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            返回列表
          </Button>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {dataset.name}
          </span>
          <Tag color="blue">{DATASET_TYPE_MAP[dataset.format_type]}</Tag>
        </Space>
        <Space>
          {dataset.can_edit && (
            <Button icon={<EditOutlined />} onClick={onEdit}>
              编辑
            </Button>
          )}
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
            删除
          </Button>
        </Space>
      </div>

      {/* 基本信息 */}
      <div style={{ padding: '24px' }}>
        <Descriptions title="基本信息" bordered column={2}>
          <Descriptions.Item label="知识库ID">{dataset.dataset_id}</Descriptions.Item>
          <Descriptions.Item label="空间ID">{dataset.space_id}</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {dataset.description || '暂无描述'}
          </Descriptions.Item>
          <Descriptions.Item label="文档数量">{dataset.doc_count}</Descriptions.Item>
          <Descriptions.Item label="分段数量">{dataset.slice_count}</Descriptions.Item>
          <Descriptions.Item label="命中次数">{dataset.hit_count}</Descriptions.Item>
          <Descriptions.Item label="使用次数">{dataset.bot_used_count}</Descriptions.Item>
          <Descriptions.Item label="总大小">{formatBytes(String(dataset.all_file_size))}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatTime(dataset.create_time)}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{formatTime(dataset.update_time)}</Descriptions.Item>
          <Descriptions.Item label="创建者">{dataset.creator_name}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={dataset.status === 1 ? 'success' : 'default'}>
              {dataset.status === 1 ? '已启用' : '未启用'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* Tab 内容 */}
      <style>{`
        .dataset-tabs-no-ink .ant-tabs-ink-bar {
          display: none !important;
        }
      `}</style>
      <Tabs
        defaultActiveKey="files"
        className="dataset-tabs-no-ink"
        tabBarStyle={{
          padding: '0 24px',
          marginBottom: 0,
          background: 'white',
          borderRadius: '16px 16px 0 0',
          borderBottom: 'none',
        }}
        items={[
          {
            key: 'files',
            label: isImageType ? (
              <span>
                <PictureOutlined /> 图片管理
              </span>
            ) : (
              <span>
                <FileTextOutlined /> 文件管理
              </span>
            ),
            children: (
              <div className="dataset-detail-content">
                {isImageType ? (
                  <ImageGrid
                    key={`images-${refreshKey}`}
                    datasetId={datasetId}
                    captionType={captionType}
                    onUpload={() => setUploadModalVisible(true)}
                    onRefresh={handleRefresh}
                    onUpdateCaption={async (documentId, caption) => {
                      try {
                        // await api.updateImageCaption(documentId, caption);
                        message.success('图片描述更新成功');
                        return true;
                      } catch (error) {
                        message.error('图片描述更新失败');
                        return false;
                      }
                    }}
                    fetchImages={api.fetchImages}
                    deleteImages={api.deleteDocuments}
                  />
                ) : (
                  <FileList
                    key={`files-${refreshKey}`}
                    datasetId={datasetId}
                    formatType={dataset.format_type}
                    onUpload={() => setUploadModalVisible(true)}
                    onRefresh={handleRefresh}
                    fetchDocuments={api.fetchDocuments}
                    deleteDocuments={api.deleteDocuments}
                    updateDocument={api.updateDocument}
                  />
                )}
              </div>
            ),
          },
        ]}
      />

      {/* 上传弹窗 */}
      {uploadModalVisible && (
        <FileUploadModal
          visible={uploadModalVisible}
          datasetId={datasetId}
          formatType={formatType}
          captionType={captionType}
          onClose={() => setUploadModalVisible(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* 进度弹窗 */}
      <UploadProgressModal
        visible={progressData.length > 0}
        progressData={progressData}
      />
    </div>
  );
};

export default DatasetDetail;
