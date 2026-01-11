/**
 * UploadProgressModal 组件
 * 上传进度弹窗
 */

import React from 'react';
import { Modal, List, Progress, Typography } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { UploadProgressModalProps } from '../types';
import { DocumentStatus } from '../types';

const { Text } = Typography;

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  visible,
  progressData,
}) => {
  return (
    <Modal
      title="文件处理进度"
      open={visible}
      footer={null}
      closable={false}
      maskClosable={false}
      width={600}
      zIndex={1050}
    >
      <List
        dataSource={progressData}
        renderItem={(item) => (
          <List.Item key={item.document_id}>
            <List.Item.Meta
              avatar={
                item.status === DocumentStatus.COMPLETED ? (
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                ) : item.status === DocumentStatus.FAILED ? (
                  <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                ) : (
                  <LoadingOutlined style={{ fontSize: 20 }} />
                )
              }
              title={item.document_name}
              description={
                <div>
                  <Progress
                    percent={item.progress}
                    status={item.status === DocumentStatus.FAILED ? 'exception' : 'active'}
                    size="small"
                    style={{ marginBottom: 4 }}
                  />
                  {item.status === DocumentStatus.PROCESSING && (
                    <Text type="secondary">
                      {' '}预计剩余 {item.remaining_time} 秒
                    </Text>
                  )}
                  {item.status === DocumentStatus.FAILED && (
                    <Text type="danger">
                      {' '}{item.status_descript || '处理失败，请重新上传'}
                    </Text>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default UploadProgressModal;
