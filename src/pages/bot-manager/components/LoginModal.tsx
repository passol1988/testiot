/**
 * LoginModal 组件
 * 用户登录弹窗
 */

import { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import type { LoginModalProps } from '../types';
import { setAuth } from '../utils/storage';

const LoginModal = ({ visible, onSubmit, onCancel }: LoginModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!values.user_id || !values.pat) {
        message.error('请填写完整的登录信息');
        return;
      }

      setLoading(true);

      // 保存到 LocalStorage
      setAuth({ user_id: values.user_id, pat: values.pat });

      message.success('登录成功');
      onSubmit(values);

      form.resetFields();
    } catch (error) {
      console.error('Login validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="登录生活物联网智能体管理平台"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="登录"
      cancelText="取消"
      confirmLoading={loading}
      centered
      styles={{ body: { paddingTop: 24 } }}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="User ID"
          name="user_id"
          rules={[{ required: true, message: '请输入 User ID' }]}
        >
          <Input
            placeholder="请输入您的 User ID"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Personal Access Token (PAT)"
          name="pat"
          rules={[{ required: true, message: '请输入 PAT' }]}
        >
          <Input.Password
            placeholder="请输入您的 Personal Access Token"
            size="large"
          />
        </Form.Item>

        <div style={{
          fontSize: 12,
          color: '#888',
          marginTop: -8,
          marginBottom: 16,
        }}>
          💡 提示：PAT 可在扣子平台的个人设置中获取
        </div>
      </Form>
    </Modal>
  );
};

export default LoginModal;
