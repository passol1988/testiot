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
  Form,
  message,
} from 'antd';
import {
  DeleteOutlined,
  UploadOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  EditOutlined,
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
  fetchDocuments: propFetchDocuments,
  deleteDocuments: propDeleteDocuments,
  updateDocument: propUpdateDocument,
}) => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentInfo | null>(null);
  const [editForm] = Form.useForm();
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
      if (propFetchDocuments) {
        const docs = await propFetchDocuments(datasetId, pagination.current);
        setDocuments(docs);
        setPagination(prev => ({ ...prev, total: docs.length }));
      } else {
        setDocuments([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      message.error('获取文件列表失败');
      setDocuments([]);
      setPagination(prev => ({ ...prev, total: 0 }));
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
          if (propDeleteDocuments) {
            await propDeleteDocuments(documentIds);
            message.success('文件删除成功');
            setSelectedIds([]);
            fetchDocuments();
            onRefresh?.();
          } else {
            message.warning('删除功能暂不可用');
          }
        } catch (error) {
          message.error('文件删除失败');
        }
      },
    });
  };

  const handleEdit = (document: DocumentInfo) => {
    setCurrentDocument(document);
    editForm.setFieldsValue({
      document_name: document.name,
      update_type: document.update_type,
      update_interval: document.update_interval,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (propUpdateDocument && currentDocument) {
        await propUpdateDocument(currentDocument.document_id, {
          document_name: values.document_name,
          update_rule: {
            update_type: values.update_type,
            update_interval: values.update_interval,
          },
        });
        message.success('文件更新成功');
        setEditModalVisible(false);
        setCurrentDocument(null);
        fetchDocuments();
        onRefresh?.();
      } else {
        message.warning('更新功能暂不可用');
      }
    } catch (error) {
      message.error('文件更新失败');
    }
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
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleDelete([record.document_id])}
          >
            删除
          </Button>
        </Space>
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

      {/* 编辑文件弹窗 */}
      <Modal
        title="编辑文件"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentDocument(null);
          editForm.resetFields();
        }}
        onOk={handleEditSubmit}
        okText="保存"
        cancelText="取消"
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          initialValues={{
            update_type: 0,
            update_interval: 24,
          }}
        >
          <Form.Item
            label="文件名"
            name="document_name"
            rules={[{ required: true, message: '请输入文件名' }]}
          >
            <Input placeholder="请输入文件名" maxLength={100} />
          </Form.Item>

          <Form.Item label="自动更新">
            <Form.Item name="update_type" noStyle>
              <Select>
                <Select.Option value={0}>不自动更新</Select.Option>
                <Select.Option value={1}>自动更新</Select.Option>
              </Select>
            </Form.Item>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.update_type !== currentValues.update_type}
          >
            {({ getFieldValue }) =>
              getFieldValue('update_type') === 1 ? (
                <Form.Item
                  label="更新频率（小时）"
                  name="update_interval"
                  rules={[
                    { required: true, message: '请输入更新频率' },
                    { type: 'number', min: 24, message: '更新频率最小为 24 小时' },
                  ]}
                >
                  <Input type="number" placeholder="24" min={24} />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FileList;
