import { Layout, theme } from 'antd';

import IoTToys from './pages/iot-toys';
import './App.css';

const { Header, Content } = Layout;

function MainLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const currentTitle = '生活物联网';

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
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: '100%',
            }}
          >
            <IoTToys />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return <MainLayout />;
}

export default App;
