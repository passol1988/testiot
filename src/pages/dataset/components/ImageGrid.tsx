/**
 * ImageGrid 组件
 * 图片列表（图片知识库）- 列表布局
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Space,
  Spin,
  message,
  Checkbox,
} from 'antd';
import {
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

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredImages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredImages.map(img => img.document_id));
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN');
  };

  const renderStatus = (status: DocumentStatus) => {
    const statusConfig = DOCUMENT_STATUS_MAP[status];
    if (status === DocumentStatus.PROCESSING) {
      return (
        <Tag color={statusConfig.color} icon={<LoadingOutlined />}>
          {statusConfig.text}
        </Tag>
      );
    }
    if (status === DocumentStatus.COMPLETED) {
      return (
        <Tag color={statusConfig.color}>
          {statusConfig.text}
        </Tag>
      );
    }
    return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>;
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

      {/* 图片列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 100 }}>
          <Spin size="large" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 100, color: '#8c8c8c' }}>
          {searchText || filterStatus !== undefined ? '未找到匹配的图片' : '暂无图片'}
        </div>
      ) : (
        <div>
          {/* 列表头 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 120px 1px 1fr 120px 120px 180px 120px',
            gap: '16px',
            padding: '12px 16px',
            background: '#fafafa',
            borderRadius: '8px 8px 0 0',
            borderBottom: '1px solid #f0f0f0',
            fontSize: '13px',
            fontWeight: 500,
            color: '#666',
          }}>
            <div>
              <Checkbox
                checked={selectedIds.length === filteredImages.length && filteredImages.length > 0}
                indeterminate={selectedIds.length > 0 && selectedIds.length < filteredImages.length}
                onChange={toggleSelectAll}
              />
            </div>
            <div>图片</div>
            <div></div>
            <div>描述</div>
            <div>大小</div>
            <div>状态</div>
            <div>上传时间</div>
            <div style={{ textAlign: 'right' }}>操作</div>
          </div>

          {/* 列表内容 */}
          <div style={{
            borderRadius: '0 0 8px 8px',
            border: '1px solid #f0f0f0',
            borderTop: 'none',
            maxHeight: '600px',
            overflowY: 'auto',
          }}>
            {filteredImages.map((image, index) => (
              <div
                key={image.document_id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 120px 1px 1fr 120px 120px 180px 120px',
                  gap: '16px',
                  padding: '12px 16px',
                  borderBottom: index < filteredImages.length - 1 ? '1px solid #f0f0f0' : 'none',
                  alignItems: 'center',
                  background: selectedIds.includes(image.document_id) ? '#fff5f5' : 'white',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!selectedIds.includes(image.document_id)) {
                    e.currentTarget.style.background = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedIds.includes(image.document_id)) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                {/* 选择框 */}
                <div>
                  <Checkbox
                    checked={selectedIds.includes(image.document_id)}
                    onChange={() => toggleSelect(image.document_id)}
                  />
                </div>

                {/* 图片缩略图 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0',
                    background: '#fafafa',
                  }}>
                    <img
                      src={image.url}
                      alt={image.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                </div>

                {/* 分隔线 */}
                <div style={{ width: '1px', height: '60px', background: '#f0f0f0' }}></div>

                {/* 描述 */}
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.5',
                  }}>
                    {image.caption || <span style={{ color: '#999' }}>无描述</span>}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#999',
                    marginTop: 4,
                  }}>
                    {image.name}
                  </div>
                </div>

                {/* 大小 */}
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {formatBytes(image.size)}
                </div>

                {/* 状态 */}
                <div>
                  {renderStatus(image.status)}
                </div>

                {/* 上传时间 */}
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {formatTime(image.create_time)}
                </div>

                {/* 操作 */}
                <div style={{ textAlign: 'right' }}>
                  <Space size="small">
                    {captionType === 1 && (
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditClick(image)}
                      >
                        编辑
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
