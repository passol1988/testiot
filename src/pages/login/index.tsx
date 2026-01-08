import { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const { TabPane } = Tabs;

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

// 生成随机 user_id
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loginForm] = Form.useForm<LoginForm>();
  const [registerForm] = Form.useForm<RegisterForm>();

  // 检查用户是否已登录
  const checkLoginStatus = () => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      navigate('/iot-toys');
      return true;
    }
    return false;
  };

  // 登录处理
  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 从 localStorage 获取用户数据
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];

      // 查找用户
      const user = users.find(
        (u: any) => u.username === values.username && u.password === values.password
      );

      if (user) {
        // 保存当前用户到 localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        message.success('登录成功');
        navigate('/iot-toys');
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 注册处理
  const handleRegister = async (values: RegisterForm) => {
    setLoading(true);
    try {
      // 从 localStorage 获取用户数据
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];

      // 检查用户名是否已存在
      const existingUser = users.find((u: any) => u.username === values.username);
      if (existingUser) {
        message.error('用户名已存在');
        setLoading(false);
        return;
      }

      // 创建新用户
      const newUser = {
        id: Date.now().toString(),
        username: values.username,
        password: values.password,
        userId: generateUserId(),
        createdAt: new Date().toISOString(),
      };

      // 保存用户数据
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // 保存当前用户
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      message.success('注册成功，已自动登录');
      navigate('/iot-toys');
    } catch (error) {
      message.error('注册失败');
    } finally {
      setLoading(false);
    }
  };

  // 检查登录状态
  useState(() => {
    checkLoginStatus();
  });

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <h1>AI玩具演示平台</h1>
          <p>欢迎回来</p>
        </div>
        <Tabs defaultActiveKey="login" centered>
          <TabPane tab="登录" key="login">
            <Form
              form={loginForm}
              name="login"
              onFinish={handleLogin}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="注册" key="register">
            <Form
              form={registerForm}
              name="register"
              onFinish={handleRegister}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="确认密码"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请再次输入密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
