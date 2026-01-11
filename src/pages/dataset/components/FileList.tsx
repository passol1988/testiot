/**
 * FileList 组件
 * 文件列表（文本知识库）
 */

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Tooltip,
  Space,
  Pagination,
  Modal,
  Input,
  Select,
  Checkbox,
  message,
} from 'antd';
import {
  DeleteOutlined,
  UploadOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FileListProps } from '../types';
import { DocumentStatus, DocumentInfo } from '../types';
import { DOCUMENT_STATUS_MAP, PAGINATION_CONFIG } from '../utils/constants';

const FileList: React.FC<FileListProps> = ({
  datasetId,
  formatType,
  onUpload,
  onRefresh,
}) => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: PAGINATION_CONFIG.defaultPageSize,
    total: 0,
  });

  useEffect(() => {
    fetchDocuments();
  }, [datasetId, pagination.current]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // 这里需要调用 API，暂时使用 mock 数据
      // const api = useDatasetApi();
      // const docs = await api.fetchDocuments(datasetId, pagination.current);
      setDocuments([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } catch (error) {
      message.error('获取文件列表失败');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN');
  };

  const renderStatus = (status: DocumentStatus, record: DocumentInfo) => {
    const statusConfig = DOCUMENT_STATUS_MAP[status];
    if (status === DocumentStatus.PROCESSING) {
      return (
        <Tooltip title={`预计剩余时间: ${record.update_interval}秒`}>
          <Tag color={statusConfig.color} icon={<LoadingOutlined />}>
            {statusConfig.text}...
          </Tag>
        </Tooltip>
      );
    }
    if (status === DocumentStatus.COMPLETED) {
      return (
        <Tag color={statusConfig.color} icon={<CheckCircleOutlined />}>
          {statusConfig.text}
        </Tag>
      );
    }
    if (status === DocumentStatus.FAILED) {
      return (
        <Tooltip title={record.tos_uri || '处理失败，请重新上传'}>
          <Tag color={statusConfig.color} icon={<CloseCircleOutlined />}>
            {statusConfig.text}
          </Tag>
        </Tooltip>
      );
    }
    return <Tag>{statusConfig.text}</Tag>;
  };

  const handleDelete = async (documentIds: string[]) => {
    Modal.confirm({
      title: '确认删除',
      content: (
        <div>
          <p>确定删除选中的 <strong>{documentIds.length}</strong> 个文件吗？</p>
          <p style={{ color: '#ff4d4f' }}>此操作无法撤销，请谨慎操作。</p>
        </div>
      ),
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // await deleteDocuments(documentIds);
          message.success('文件删除成功');
          setSelectedIds([]);
          fetchDocuments();
          onRefresh?.();
        } catch (error) {
          message.error('文件删除失败');
        }
      },
    });
  };

  const columns: ColumnsType<DocumentInfo> = [
    {
      title: '',
      dataIndex: 'document_id',
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedIds.includes(record.document_id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds([...selectedIds, record.document_id]);
            } else {
              setSelectedIds(selectedIds.filter(id => id !== record.document_id));
            }
          }}
        />
      ),
    },
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatBytes(size),
    },
    {
      title: '分段数',
      dataIndex: 'slice_count',
      key: 'slice_count',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: DocumentStatus, record: DocumentInfo) => renderStatus(status, record),
    },
    {
      title: '上传时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 160,
      render: (time: number) => formatTime(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button
          size="small"
          danger
          onClick={() => handleDelete([record.document_id])}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 操作栏 */}
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={onUpload}
          >
            上传文件
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedIds.length === 0}
            onClick={() => handleDelete(selectedIds)}
          >
            批量删除 {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => { fetchDocuments(); onRefresh?.(); }}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 文件表格 */}
      <Table
        columns={columns}
        dataSource={documents}
        loading={loading}
        rowKey="document_id"
        pagination={false}
        size="middle"
      />

      {/* 分页 */}
      {pagination.total > 0 && (
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
            showSizeChanger
            showTotal={(total) => `共 ${total} 个文件`}
            onChange={(page, pageSize) => {
              setPagination({ current: page, pageSize, total: pagination.total });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FileList;
