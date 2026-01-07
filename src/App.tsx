import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { Layout, theme } from 'antd';
import {
  MessageOutlined,
  CustomerServiceOutlined,
  ExperimentOutlined,
  RobotOutlined,
} from '@ant-design/icons';

import TTSWithTranscription from './pages/tts_transcription';
import Transcription from './pages/transcription';
import Speech from './pages/speech';
import SimultInterpretation from './pages/simult-interpretation';
import Chat from './pages/chat';
import AudioTest from './pages/audio-test';
import IoTToys from './pages/iot-toys';
import './App.css';
const { Header, Content } = Layout;

const isHidden = location.hostname === 'www.coze.cn';
const menuItems = [
  {
    key: '/iot-toys',
    icon: <RobotOutlined />,
    label: '生活物联网 AI 玩具',
    title: '生活物联网 AI 玩具演示平台',
  },
  {
    key: '/chat',
    icon: <MessageOutlined />,
    label: '实时语音对话',
    title: '实时语音对话 (Chat) 演示',
  },
  {
    key: '/transcription',
    icon: <CustomerServiceOutlined />,
    label: '语音识别',
    title: '语音识别 (ASR) 演示',
  },
  {
    key: '/speech',
    icon: <ExperimentOutlined />,
    label: '语音合成',
    title: '语音合成 (TTS) 演示',
  },
  {
    key: '/simult',
    icon: <CustomerServiceOutlined />,
    label: '同声传译',
    title: '多语种实时翻译 (Simult) 演示',
    isHidden,
  },
  {
    key: '/tts_transcription',
    icon: <ExperimentOutlined />,
    label: '语音识别+实时语音对话',
    title: '语音识别 (ASR) +TTS',
    isHidden,
  },
  // {
  //   key: '/audio-test',
  //   icon: <AudioOutlined />,
  //   label: '音频测试',
  // },
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
              // padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: '100%',
            }}
          >
            <Routes>
              <Route path="/" element={<IoTToys />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/audio-test" element={<AudioTest />} />
              <Route path="/transcription" element={<Transcription />} />
              <Route path="/speech" element={<Speech />} />
              <Route path="/iot-toys" element={<IoTToys />} />
              <Route path="/simult" element={<SimultInterpretation />} />
              <Route
                path="/tts_transcription"
                element={<TTSWithTranscription />}
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
