/**
 * AvatarUpload 组件
 * 头像上传组件
 */

import { useState } from 'react';
import { Upload, Avatar, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

interface AvatarUploadProps {
  value?: string;
  onChange?: (fileId: string) => void;
  uploadFile?: (file: File) => Promise<string | null>;
}

const AvatarUpload = ({ value, onChange, uploadFile }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = async (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);

    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }

    if (info.file.status === 'done') {
      setUploading(false);
      // fileId 将在 uploadFile 成功后设置
      return;
    }
  };

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;

    if (!uploadFile) {
      onError(new Error('上传功能未配置'));
      return;
    }

    try {
      const fileId = await uploadFile(file as File);
      if (fileId) {
        onChange?.(fileId);
        onSuccess(fileId);
        message.success('头像上传成功');
      } else {
        onError(new Error('上传失败'));
      }
    } catch (error) {
      onError(error as Error);
      message.error('头像上传失败');
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isValidType = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type);
    if (!isValidType) {
      message.error('只能上传 PNG、JPG、GIF 格式的图片');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB');
      return false;
    }

    return true;
  };

  const uploadButton = (
    <div style={{ width: 120, height: 120 }}>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8, fontSize: 12 }}>上传头像</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-circle"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      customRequest={customRequest}
      fileList={fileList}
      accept="image/png,image/jpeg,image/gif"
    >
      {value ? (
        <Avatar src={`https://files.coze.cn/files/${value}`} size={120} shape="square" style={{ borderRadius: 12 }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default AvatarUpload;
