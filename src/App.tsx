import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import { Layout, theme, Dropdown, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { RobotOutlined } from '@ant-design/icons';

import IoTToys from './pages/iot-toys';
import Login from './pages/login';
import './App.css';
const { Header, Content } = Layout;

// 路由守卫组件
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('currentUser');
  return user ? children : <Navigate to="/login" replace />;
};

const menuItems = [
  {
    key: '/iot-toys',
    icon: <RobotOutlined />,
    label: '生活物联网',
    title: '生活物联网',
  },
];

function MainLayout() {
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 获取当前路由对应的菜单项的title
  const currentMenuItem = menuItems.find(
    item => item.key === location.pathname,
  );
  const currentTitle = currentMenuItem?.title || '扣子实时语音对话';

  // 获取当前用户
  const currentUser = localStorage.getItem('currentUser');

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        localStorage.removeItem('currentUser');
        window.location.href = '#/login';
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
          className="responsive-header"
        >
          <div className="header-content">
            <div className="header-left">
              <h3
                style={{
                  fontSize: '16px',
                  marginBottom: '0',
                  lineHeight: '64px',
                  marginLeft: '16px',
                }}
              >
                {currentTitle}
              </h3>
            </div>
            {currentUser && (
              <div className="header-right">
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0 16px' }}>
                    <Avatar icon={<UserOutlined />} style={{ marginRight: 8, backgroundColor: '#1890ff' }} />
                    <span>{JSON.parse(currentUser).username}</span>
                  </div>
                </Dropdown>
              </div>
            )}
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              // padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: '100%',
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/iot-toys" replace />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/iot-toys"
                element={
                  <PrivateRoute>
                    <IoTToys />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
