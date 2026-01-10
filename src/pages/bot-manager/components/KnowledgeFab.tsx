/**
 * KnowledgeFab 组件
 * 知识库悬浮按钮（敬请期待）
 */

import { useState } from 'react';
import { Modal } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const KnowledgeFab = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClick = () => {
    setModalVisible(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="knowledge-fab"
      >
        <RocketOutlined style={{ fontSize: 24, color: '#fff' }} />
      </div>

      <Modal
        open={modalVisible}
        title={null}
        footer={null}
        onCancel={() => setModalVisible(false)}
        centered
        closable
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
          <h3 style={{ marginBottom: 8 }}>知识库功能</h3>
          <p style={{ color: '#888' }}>敬请期待...</p>
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 16 }}>
            即将支持上传文档、管理知识库等功能
          </p>
        </div>
      </Modal>
    </>
  );
};

export default KnowledgeFab;
