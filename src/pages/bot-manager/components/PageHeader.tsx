/**
 * PageHeader 组件
 * 管理页面头部
 */

import { useState, useCallback, useEffect } from 'react';
import { Button, Space, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { getAuth, setAuth, clearAuth } from '../utils/storage';

interface PageHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

const PageHeader = ({ onCreate, onRefresh, loading }: PageHeaderProps) => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [form] = Form.useForm();

  // 初始化表单值
  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      form.setFieldsValue({
        user_id: auth.user_id,
        pat: auth.pat,
      });
    }
  }, [form]);

  // 打开设置
  const handleOpenSettings = useCallback(() => {
    const auth = getAuth();
    if (auth) {
      form.setFieldsValue({
        user_id: auth.user_id,
        pat: auth.pat,
      });
    }
    setSettingsVisible(true);
  }, [form]);

  // 保存设置
  const handleSaveSettings = useCallback((values: { user_id: string; pat: string }) => {
    setAuth(values);
    message.success('设置已保存，页面将刷新');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, []);

  // 清除设置并重新登录
  const handleClearSettings = useCallback(() => {
    clearAuth();
    message.success('已清除登录信息');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, []);

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            🤖 生活物联网智能体
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            为儿童智能玩具配置专属 AI 伙伴
          </p>
        </div>

        <Space>
          <Button
            icon={<SettingOutlined />}
            onClick={handleOpenSettings}
          >
            设置
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreate}
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
              border: 'none',
              borderRadius: 20,
              height: 36,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            创建智能体
          </Button>
        </Space>
      </div>

      {/* 设置弹窗 */}
      <Modal
        title="设置"
        open={settingsVisible}
        onCancel={() => setSettingsVisible(false)}
        onOk={() => form.submit()}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveSettings}
        >
          <Form.Item
            label="用户 ID"
            name="user_id"
            rules={[{ required: true, message: '请输入用户 ID' }]}
          >
            <Input placeholder="请输入用户 ID" />
          </Form.Item>

          <Form.Item
            label="个人访问令牌 (PAT)"
            name="pat"
            rules={[
              { required: true, message: '请输入个人访问令牌' },
              { pattern: /^pat_/, message: 'PAT 必须以 pat_ 开头' },
            ]}
          >
            <Input.Password placeholder="请输入个人访问令牌（以 pat_ 开头）" />
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="link" onClick={handleClearSettings} danger>
              清除登录信息并重新登录
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default PageHeader;
