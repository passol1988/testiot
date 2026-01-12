/**
 * DatasetForm 组件
 * 知识库创建/编辑表单
 */

import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  Upload,
  Button,
  Space,
  message,
  Avatar,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { DatasetFormProps, DatasetFormData } from '../types';
import { DatasetFormatType } from '../types';
import { DATASET_TYPE_OPTIONS, CAPTION_TYPE_OPTIONS } from '../utils/constants';
import styles from '../styles';

const { TextArea } = Input;

const DatasetForm: React.FC<DatasetFormProps> = ({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  uploadFile,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState<string>('');
  const [iconFileId, setIconFileId] = useState<string>('');
  const [formatType, setFormatType] = useState<DatasetFormatType>(DatasetFormatType.TEXT);
  const [existingIconUrl, setExistingIconUrl] = useState<string>('');

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setFormatType(initialValues.format_type || DatasetFormatType.TEXT);
      if (initialValues.icon_file_id) {
        setIconFileId(initialValues.icon_file_id);
      }
      // Set existing icon URL for editing
      if (mode === 'edit' && (initialValues.icon_url || initialValues.avatar_url || initialValues.icon_uri)) {
        setExistingIconUrl(initialValues.icon_url || initialValues.avatar_url || initialValues.icon_uri || '');
      }
    }
  }, [initialValues, form, mode]);

  const handleIconUpload = async (file: File) => {
    if (!uploadFile) {
      message.error('上传功能不可用');
      return false;
    }

    // 预览
    setIconPreview(URL.createObjectURL(file));

    // 上传
    try {
      const fileId = await uploadFile(file);
      if (fileId) {
        setIconFileId(fileId);
        message.success('图标上传成功');
      }
    } catch (error) {
      message.error('图标上传失败');
    }

    return false;
  };

  const handleSubmit = async (values: DatasetFormData) => {
    setLoading(true);
    try {
      const submitData: DatasetFormData = {
        ...values,
        icon_file_id: iconFileId || values.icon_file_id,
      };

      const result = await onSubmit(submitData);
      if (result) {
        form.resetFields();
        setIconPreview('');
        setIconFileId('');
        setExistingIconUrl('');
      }
    } finally {
      setLoading(false);
    }
  };

  const isImageType = formatType === DatasetFormatType.IMAGE;

  return (
    <Modal
      title={mode === 'create' ? '创建知识库' : '编辑知识库'}
      open={true}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          format_type: DatasetFormatType.TEXT,
          caption_type: 0,
        }}
      >
        {/* 图标上传 */}
        <Form.Item label="知识库图标">
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={handleIconUpload}
            accept="image/*"
            style={{ width: 'auto' }}
          >
            {iconPreview || iconFileId || existingIconUrl ? (
              <Avatar size={64} src={iconPreview || existingIconUrl} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图标</div>
              </div>
            )}
          </Upload>
          <div className="upload-tip">支持 JPG、PNG 格式，建议尺寸 64x64</div>
        </Form.Item>

        {/* 知识库名称 */}
        <Form.Item
          name="name"
          label="知识库名称"
          rules={[
            { required: true, message: '请输入知识库名称' },
            { max: 100, message: '名称最多100个字符' },
          ]}
        >
          <Input placeholder="请输入知识库名称" maxLength={100} />
        </Form.Item>

        {/* 知识库描述 */}
        <Form.Item
          name="description"
          label="知识库描述"
          rules={[{ max: 500, message: '描述最多500个字符' }]}
        >
          <TextArea
            placeholder="请输入知识库描述（可选）"
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* 知识库类型 */}
        <Form.Item
          name="format_type"
          label="知识库类型"
          rules={[{ required: true, message: '请选择知识库类型' }]}
        >
          <Radio.Group
            onChange={(e) => setFormatType(e.target.value)}
            options={DATASET_TYPE_OPTIONS}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>

        {/* 图片标注方式（仅图片类型显示） */}
        {isImageType && (
          <Form.Item
            name="caption_type"
            label="图片标注方式"
            rules={[{ required: true, message: '请选择图片标注方式' }]}
            tooltip="设置后续上传图片时的默认标注行为"
          >
            <Radio.Group>
              <Space direction="vertical">
                {CAPTION_TYPE_OPTIONS.map(option => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                    <span style={{ color: '#8c8c8c', marginLeft: 8 }}>
                      {option.value === 0
                        ? '- 上传后系统自动生成图片描述'
                        : '- 上传后需要手动设置图片描述'}
                    </span>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        )}

        {/* 操作按钮 */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={styles.buttonStyles.botBtnPrimary}
            >
              {mode === 'create' ? '创建' : '保存'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DatasetForm;
