/**
 * AvatarUpload 组件
 * 头像上传组件
 * 支持显示 icon_url（完整URL）和 icon_file_id（文件ID）
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
  initialUrl?: string;  // 编辑时的原始头像 URL（仅用于显示）
}

const AvatarUpload = ({ value, onChange, uploadFile, initialUrl }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 获取显示用的头像 URL
  const getDisplayUrl = (): string | undefined => {
    // 优先显示上传后的文件 ID
    if (value) {
      // 如果是完整的 URL（包含 http/https），直接使用
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
      }
      // 否则作为文件 ID 处理
      return `https://files.coze.cn/files/${value}`;
    }
    // 如果没有 value，显示初始 URL（编辑时使用）
    return initialUrl;
  };

  const handleChange = async (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);

    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }

    if (info.file.status === 'done') {
      setUploading(false);
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

  const displayUrl = getDisplayUrl();

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
      {displayUrl ? (
        <Avatar src={displayUrl} size={120} shape="square" style={{ borderRadius: 12 }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default AvatarUpload;
