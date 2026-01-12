/**
 * ImageGrid 组件
 * 图片网格（图片知识库）
 */

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Space,
  Spin,
  message,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { ImageGridProps } from '../types';
import { PhotoInfo, DocumentStatus } from '../types';
import { DOCUMENT_STATUS_MAP } from '../utils/constants';
import styles from '../styles';

const { Search } = Input;
const { TextArea } = Input;

const ImageGrid: React.FC<ImageGridProps> = ({
  datasetId,
  captionType,
  onUpload,
  onRefresh,
  onUpdateCaption,
  fetchImages: propFetchImages,
  deleteImages: propDeleteImages,
}) => {
  const [images, setImages] = useState<PhotoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<number | undefined>();
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<PhotoInfo | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    fetchImages();
  }, [datasetId, pagination.current]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      if (propFetchImages) {
        const imgs = await propFetchImages(datasetId, pagination.current);
        setImages(imgs);
        setPagination(prev => ({ ...prev, total: imgs.length }));
      } else {
        setImages([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      message.error('获取图片列表失败');
      setImages([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCaption = async () => {
    if (!currentImage || !onUpdateCaption) {
      return;
    }

    try {
      await onUpdateCaption(currentImage.document_id, editCaption);
      setEditModalVisible(false);
      setCurrentImage(null);
      setEditCaption('');
      fetchImages();
      onRefresh?.();
    } catch (error) {
      message.error('更新图片描述失败');
    }
  };

  const handleEditClick = (image: PhotoInfo) => {
    setCurrentImage(image);
    setEditCaption(image.caption);
    setEditModalVisible(true);
  };

  const handleDelete = (imageIds: string[]) => {
    Modal.confirm({
      title: '确认删除',
      content: (
        <div>
          <p>确定删除选中的 <strong>{imageIds.length}</strong> 张图片吗？</p>
          <p style={{ color: '#ff4d4f' }}>此操作无法撤销，请谨慎操作。</p>
        </div>
      ),
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          if (propDeleteImages) {
            await propDeleteImages(imageIds);
            message.success('图片删除成功');
            setSelectedIds([]);
            fetchImages();
            onRefresh?.();
          } else {
            message.warning('删除功能暂不可用');
          }
        } catch (error) {
          message.error('图片删除失败');
        }
      },
    });
  };

  const filteredImages = images.filter(img => {
    const matchStatus = filterStatus === undefined || img.status === filterStatus;
    const matchSearch = !searchText || img.caption.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  const toggleSelect = (imageId: string) => {
    if (selectedIds.includes(imageId)) {
      setSelectedIds(selectedIds.filter(id => id !== imageId));
    } else {
      setSelectedIds([...selectedIds, imageId]);
    }
  };

  return (
    <div>
      {/* 操作栏 */}
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={onUpload}
            style={styles.buttonStyles.botBtnPrimary}
          >
            上传图片
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedIds.length === 0}
            onClick={() => handleDelete(selectedIds)}
          >
            批量删除 {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => { fetchImages(); onRefresh?.(); }}>
            刷新
          </Button>
          <Search
            placeholder="搜索图片描述..."
            allowClear
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="筛选状态"
            allowClear
            style={{ width: 120 }}
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Select.Option value="0">处理中</Select.Option>
            <Select.Option value="1">完成</Select.Option>
            <Select.Option value="9">失败</Select.Option>
          </Select>
        </Space>
      </div>

      {/* 图片网格 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 100 }}>
          <Spin size="large" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 100, color: '#8c8c8c' }}>
          {searchText || filterStatus !== undefined ? '未找到匹配的图片' : '暂无图片'}
        </div>
      ) : (
        <div className="image-grid">
          {filteredImages.map(image => (
            <div
              key={image.document_id}
              className="image-card"
              style={{
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s',
                border: selectedIds.includes(image.document_id) ? '2px solid #FF6B6B' : '2px solid transparent',
              }}
            >
              <img src={image.url} alt={image.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />

              {/* 状态遮罩 */}
              {image.status === DocumentStatus.PROCESSING && (
                <div className="image-status-overlay">
                  <Spin indicator={<LoadingOutlined spin />} />
                  <span>处理中...</span>
                </div>
              )}

              {/* 选择框 */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 2,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(image.document_id)}
                  onChange={() => toggleSelect(image.document_id)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
              </div>

              {/* Hover 显示操作 */}
              <div className="image-actions">
                <div className="image-caption">{image.caption || '无描述'}</div>
                <Space>
                  {captionType === 1 && (
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEditClick(image)}
                    >
                      编辑描述
                    </Button>
                  )}
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete([image.document_id])}
                  >
                    删除
                  </Button>
                </Space>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 编辑描述弹窗 */}
      <Modal
        title="编辑图片描述"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentImage(null);
          setEditCaption('');
        }}
        onOk={handleUpdateCaption}
        okText="保存"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="图片描述">
            <TextArea
              rows={4}
              placeholder="请输入图片描述..."
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ImageGrid;
