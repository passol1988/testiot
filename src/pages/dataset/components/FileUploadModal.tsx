/**
 * FileUploadModal 组件
 * 文件上传弹窗
 */

import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Upload,
  Button,
  Input,
  Radio,
  Space,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { FileUploadModalProps } from '../types';
import { DatasetFormatType, DocumentSourceType } from '../types';
import { SUPPORTED_FILE_TYPES, UPLOAD_LIMITS } from '../utils/constants';
import { useDocumentUpload } from '../hooks/use-document-upload';
import UploadProgressModal from './UploadProgressModal';
import styles from '../styles';

const { TextArea } = Input;
const { TabPane } = Tabs;

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  visible,
  datasetId,
  formatType,
  captionType,
  onClose,
  onSuccess,
}) => {
  const { uploading, progressData, progressModalVisible, uploadDocuments, uploadImages, uploadWebPage, hideProgressModal } =
    useDocumentUpload();

  const [activeTab, setActiveTab] = useState<'local' | 'web'>('local');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [webUrl, setWebUrl] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [captionInputMode, setCaptionInputMode] = useState<0 | 1>(captionType || 0);
  const [caption, setCaption] = useState('');

  const isImageType = formatType === DatasetFormatType.IMAGE;

  const handleUploadLocalFiles = async () => {
    if (selectedFiles.length === 0) {
      message.warning('请选择文件');
      return;
    }

    if (isImageType) {
      await uploadImages(datasetId, selectedFiles, captionType, [caption]);
    } else {
      await uploadDocuments(datasetId, selectedFiles, formatType);
    }

    setSelectedFiles([]);
    setCaption('');
    onSuccess?.();
  };

  const handleUploadWebPage = async () => {
    if (!webUrl) {
      message.warning('请输入网页 URL');
      return;
    }
    if (!documentName) {
      message.warning('请输入文件名');
      return;
    }

    try {
      new URL(webUrl);
    } catch {
      message.error('请输入有效的 URL');
      return;
    }

    await uploadWebPage(datasetId, webUrl, documentName);
    setWebUrl('');
    setDocumentName('');
    onSuccess?.();
  };

  const beforeUpload = (file: File) => {
    const isValidType = SUPPORTED_FILE_TYPES[formatType].some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!isValidType) {
      message.error(`不支持的文件类型，仅支持: ${SUPPORTED_FILE_TYPES[formatType].join(', ')}`);
      return Upload.LIST_IGNORE;
    }

    const isValidSize = file.size <= UPLOAD_LIMITS.maxFileSize;
    if (!isValidSize) {
      message.error(`文件大小不能超过 ${UPLOAD_LIMITS.maxFileSize / 1024 / 1024} MB`);
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  return (
    <>
      <Modal
        title={isImageType ? '上传图片' : '上传文件'}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'local' | 'web')}
        >
          {/* 本地文件 */}
          <TabPane tab="本地文件" key="local">
            <Form layout="vertical">
              <Form.Item label="选择文件" required>
                <Upload
                  multiple
                  accept={SUPPORTED_FILE_TYPES[formatType].join(',')}
                  beforeUpload={beforeUpload}
                  fileList={selectedFiles.map((file, index) => ({
                    uid: `${index}`,
                    name: file.name,
                    status: 'done' as const,
                    url: URL.createObjectURL(file),
                    originFileObj: file,
                  }))}
                  onRemove={(file) => {
                    const index = selectedFiles.findIndex(f => f.name === file.name);
                    if (index > -1) {
                      const newFiles = [...selectedFiles];
                      newFiles.splice(index, 1);
                      setSelectedFiles(newFiles);
                    }
                  }}
                  listType={isImageType ? 'picture-card' : 'text'}
                >
                  {(!isImageType || selectedFiles.length < UPLOAD_LIMITS.maxFilesPerUpload) && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>
                        {isImageType ? '上传图片' : '选择文件'}
                      </div>
                    </div>
                  )}
                </Upload>
                <div className="upload-tip">
                  支持 {SUPPORTED_FILE_TYPES[formatType].join(', ')} 格式，
                  单个文件最大 {UPLOAD_LIMITS.maxFileSize / 1024 / 1024} MB，
                  最多 {UPLOAD_LIMITS.maxFilesPerUpload} 个
                </div>
              </Form.Item>

              {/* 图片描述输入（仅图片类型） */}
              {isImageType && (
                <>
                  <Form.Item label="描述" required>
                    <Radio.Group
                      value={captionInputMode}
                      onChange={(e) => setCaptionInputMode(e.target.value)}
                    >
                      <Space vertical>
                        <Radio value={0}>使用系统自动生成的描述</Radio>
                        <Radio value={1}>手工输入描述</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  {captionInputMode === 1 && (
                    <Form.Item label="图片描述" required>
                      <TextArea
                        placeholder="请输入图片描述..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={3}
                        maxLength={500}
                      />
                    </Form.Item>
                  )}
                </>
              )}

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    onClick={handleUploadLocalFiles}
                    loading={uploading}
                    disabled={selectedFiles.length === 0}
                    style={styles.buttonStyles.botBtnPrimary}
                  >
                    上传 ({selectedFiles.length})
                  </Button>
                  <Button onClick={onClose}>取消</Button>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>

          {/* 在线网页（仅文本类型） */}
          {!isImageType && (
            <TabPane tab="在线网页" key="web">
              <Form layout="vertical">
                <Form.Item
                  label="网页 URL"
                  required
                  rules={[
                    { required: true, message: '请输入网页 URL' },
                    { type: 'url', message: '请输入有效的 URL' },
                  ]}
                >
                  <Input
                    placeholder="https://example.com/page"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="文件名"
                  required
                  rules={[{ required: true, message: '请输入文件名' }]}
                >
                  <Input
                    placeholder="为这个网页起个名字"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      onClick={handleUploadWebPage}
                      loading={uploading}
                      style={styles.buttonStyles.botBtnPrimary}
                    >
                      添加
                    </Button>
                    <Button onClick={onClose}>取消</Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>
          )}
        </Tabs>
      </Modal>

      {/* 进度弹窗 */}
      <UploadProgressModal
        visible={progressModalVisible}
        progressData={progressData}
      />
    </>
  );
};

export default FileUploadModal;
