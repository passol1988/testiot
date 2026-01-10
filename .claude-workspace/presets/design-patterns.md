# 设计模式与架构

## 1. 组件设计模式

### 1.1 容器/展示组件分离

项目采用容器/展示组件分离模式，将业务逻辑和UI展示分离：

```typescript
// 容器组件 - 管理状态和业务逻辑
function Chat() {
  const clientRef = useRef<WsChatClient>();
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Layout>
      <Settings />
      <SendMessage />
      <ReceiveMessage />
      <Operation />
    </Layout>
  );
}

// 展示组件 - 专注于UI交互
const Operation = ({ isConnected, clientRef, setIsConnected }) => {
  const handleInterrupt = () => {
    clientRef.current?.interrupt();
  };
  // 渲染UI...
};
```

### 1.2 自定义 Hooks (Custom Hooks)

用于封装复用逻辑：

```typescript
// useApi Hook - API 调用封装
const useApi = (localStorageKey: string) => {
  const isRelease = () => location.hostname === 'www.coze.cn';

  const getBotInfo = async (botId: string) => {
    const api = await getCozeApi(localStorageKey);
    const bot = await api.bots.retrieveNew(botId);
    return bot;
  };

  return { isRelease, getBots, getWorkspaces, getBotInfo, getVoices };
};
```

### 1.3 forwardRef + useImperativeHandle

用于暴露组件方法给父组件：

```typescript
// 定义 ref 接口
export interface AudioConfigRef {
  getSettings: () => {
    denoiseMode: AIDenoiserProcessorMode;
    denoiseLevel: AIDenoiserProcessorLevel;
    noiseSuppression: boolean;
    echoCancellation: boolean;
    autoGainControl: boolean;
    debug: boolean;
    audioMutedDefault: boolean;
    isHuaweiMobile: boolean;
  };
}

// 使用 forwardRef + useImperativeHandle
export const AudioConfig = forwardRef<AudioConfigRef, Props>(
  ({ clientRef }, ref) => {
    const [denoiseMode, setDenoiseMode] = useState<AIDenoiserProcessorMode>(
      AIDenoiserProcessorMode.NSNG
    );

    useImperativeHandle(ref, () => ({
      getSettings: () => ({
        denoiseMode,
        denoiseLevel,
        noiseSuppression,
        echoCancellation,
        autoGainControl,
        debug,
        audioMutedDefault,
        isHuaweiMobile,
      }),
    }));

    return <div>...</div>;
  }
);
```

### 1.4 组件通信方式

**Props 传递（父到子）**
```typescript
<Operation
  isConnected={isConnected}
  clientRef={clientRef}
  setIsConnected={setIsConnected}
  audioMutedDefault={audioConfigRef.current?.getSettings()?.audioMutedDefault ?? false}
/>
```

**Callback 回调（子到父）**
```typescript
<Settings
  onSettingsChange={handleSettingsChange}
  localStorageKey={localStorageKey}
/>

const handleSettingsChange = () => {
  console.log('Settings changed');
  window.location.reload();
};
```

**Ref 通信（父调用子方法）**
```typescript
const audioConfigRef = useRef<AudioConfigRef>(null);

const audioConfig = audioConfigRef.current?.getSettings();
```

## 2. 数据流模式

### 2.1 状态提升

将共享状态提升到父组件：

```typescript
function Chat() {
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [volume, setVolume] = useState(100);

  return (
    <>
      <Operation isConnected={isConnected} setIsConnected={setIsConnected} />
      <ReceiveMessage clientRef={clientRef} />
    </>
  );
}
```

### 2.2 受控/非受控组件

**受控组件示例**
```typescript
const [volume, setVolume] = useState(100);

const handleVolumeChange = (value: number) => {
  setVolume(value);
  if (clientRef.current) {
    clientRef.current.setPlaybackVolume(value / 100);
  }
};

<Slider
  value={volume}
  min={0}
  max={100}
  onChange={handleVolumeChange}
/>
```

**非受控组件示例**
```typescript
<Select
  value={selectedInputDevice}
  onChange={handleSetAudioInputDevice}
>
  {inputDevices.map(device => (
    <Select.Option key={device.deviceId} value={device.deviceId}>
      {device.label}
    </Select.Option>
  ))}
</Select>
```

### 2.3 配管理模式

使用 LocalStorage + 配置对象：

```typescript
const getConfig = (prefix: string) => {
  const config = {
    getBaseUrl: () =>
      localStorage.getItem(`${prefix}_base_url`) || 'https://api.coze.cn',
    getBaseWsUrl: () =>
      localStorage.getItem(`${prefix}_base_ws_url`) || 'wss://ws.coze.cn',
    getPat: () => localStorage.getItem(`${prefix}_pat`) || '',
    getBotId: () => localStorage.getItem(`${prefix}_bot_id`) || '',
    getVoiceId: () => localStorage.getItem(`${prefix}_voice_id`) || '',
  };
  return config;
};

// 使用
const config = getConfig(localStorageKey);
const botId = config.getBotId();
```

## 3. 错误处理方式

### 3.1 组件级错误处理

```typescript
const handleConnect = async () => {
  try {
    await initClient();
    await clientRef.current?.connect({ chatUpdate });
    setIsConnected(true);
  } catch (error) {
    console.error(error);
    message.error(`连接错误：${(error as Error).message}`);
  }
};
```

### 3.2 API 调用错误处理

```typescript
const getVoices = async () => {
  try {
    const api = await getCozeApi(localStorageKey);
    // ... API 调用逻辑
    return formattedVoices;
  } catch (error) {
    console.error('get voices error:', error);
    throw error;
  }
};
```

### 3.3 WebSocket 事件错误处理

```typescript
clientRef.current?.on(
  WsChatEventNames.SERVER_ERROR,
  (_: string, event: unknown) => {
    console.log('[chat] error', event);
    message.error(
      `发生错误：${(event as CommonErrorEvent)?.data?.msg} logid: ${
        (event as CommonErrorEvent)?.detail.logid
      }`
    );
    clientRef.current?.disconnect();
    setIsConnected(false);
  }
);
```

### 3.4 用户提示方式

```typescript
import { message } from 'antd';

message.error('连接错误');
message.warning('Not Support!');
message.success('Authorization successful!');
message.info('当前浏览器不支持AI降噪');
```

## 4. API 调用方式

### 4.1 SDK 封装调用

**WebSocket 客户端初始化**
```typescript
import { WsChatClient, WsChatEventNames, WsToolsUtils } from '@coze/api/ws-tools';

const client = new WsChatClient({
  token: config.getPat(),
  baseWsURL: config.getBaseWsUrl(),
  allowPersonalAccessTokenInBrowser: true,
  botId: config.getBotId(),
  debug: audioConfig?.debug,
  voiceId: config.getVoiceId(),
  aiDenoisingConfig: {
    mode: AIDenoiserProcessorMode.NSNG,
    level: AIDenoiserProcessorLevel.SOFT,
  },
  audioCaptureConfig: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  deviceId: selectedInputDevice || undefined,
  audioMutedDefault: false,
});
```

**REST API 调用封装**
```typescript
import { CozeAPI } from '@coze/api';

const getCozeApi = async (localStorageKey: string) => {
  const config = getConfig(localStorageKey);
  const cozeApi = new CozeAPI({
    baseURL: config.getBaseUrl(),
    allowPersonalAccessTokenInBrowser: true,
    token: config.getPat(),
  });
  return cozeApi;
};

const getBotInfo = async (botId: string) => {
  const api = await getCozeApi(localStorageKey);
  const bot = await api.bots.retrieveNew(botId);
  return bot;
};
```

### 4.2 直接 fetch 调用

```typescript
export const getTokenByCookie = async () => {
  try {
    const result = await fetch(
      'https://www.coze.cn/api/permission_api/coze_web_app/impersonate_coze_user',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      }
    ).then(res => res.json());

    if (result.code === 700012006) {
      window.location.href = `/sign?redirect=${encodeURIComponent(location.pathname)}`;
    }
    return result.data as OAuthToken;
  } catch (e) {
    console.error('getTokenByCookie', e);
  }
  return null;
};
```

### 4.3 WebSocket 连接管理

**事件监听模式**
```typescript
// 注册所有事件监听器
clientRef.current?.on(WsChatEventNames.ALL, handleMessageEvent);

// 清理时移除监听器
useEffect(() => {
  clientRef.current?.on(WsChatEventNames.ALL, handleMessageEvent);
  return () => {
    clientRef.current?.off(WsChatEventNames.ALL, handleMessageEvent);
  };
}, [clientRef.current]);
```

**特定事件处理**
```typescript
// 音频转录更新事件
clientRef.current?.on(
  WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE,
  (_, data) => {
    const event = data as ConversationAudioTranscriptUpdateEvent;
    if (event.data.content) {
      setTranscript(event.data.content);
    }
  }
);

// 音频状态变化事件
clientRef.current?.on(WsChatEventNames.AUDIO_MUTED, () => {
  setIsMuted(true);
});
```

### 4.4 请求拦截器

```typescript
const getCozeApi = async (localStorageKey: string) => {
  const config = getConfig(localStorageKey);
  const expiresIn = config.getExpiresIn();

  // 检查 token 是否过期
  if (expiresIn && parseInt(expiresIn) * 1000 < Date.now()) {
    console.log('Token expired!');
    const oauthToken = await getTokenByCookie();
    if (oauthToken) {
      // 自动刷新 token
      localStorage.setItem(`${localStorageKey}_pat`, oauthToken.access_token);
      localStorage.setItem(
        `${localStorageKey}_expires_in`,
        oauthToken.expires_in.toString()
      );
    }
  }

  const cozeApi = new CozeAPI({
    baseURL: config.getBaseUrl(),
    allowPersonalAccessTokenInBrowser: true,
    token: config.getPat(),
  });
  return cozeApi;
};
```

## 5. 应用架构模式

### 5.1 路由架构（嵌套路由）

```typescript
function App() {
  return (
    <Router>
      <Routes>
        {/* 独立布局的路由 */}
        <Route path="/iot-toys" element={<IoTToys />} />

        {/* 共享布局的路由 */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Chat />} />
          <Route path="/audio-test" element={<AudioTest />} />
          <Route path="/transcription" element={<Transcription />} />
          <Route path="/speech" element={<Speech />} />
          <Route path="/simult" element={<SimultInterpretation />} />
          <Route path="/tts_transcription" element={<TTSWithTranscription />} />
        </Route>
      </Routes>
    </Router>
  );
}
```

### 5.2 布局组件模式

```typescript
function DefaultLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed}>
        <Menu onClick={({ key }) => navigate(key)} />
      </Sider>
      <Layout>
        <Header>{/* 通用头部 */}</Header>
        <Content>
          <Outlet /> {/* 子路由渲染位置 */}
        </Content>
      </Layout>
    </Layout>
  );
}
```

## 6. 设计模式总结

| 模式类型 | 具体实现 | 典型场景 |
|---------|---------|---------|
| **容器/展示组件分离** | Chat (容器) + SendMessage/ReceiveMessage (展示) | 复杂页面拆分 |
| **自定义 Hooks** | useApi (API 封装) | 逻辑复用 |
| **forwardRef + useImperativeHandle** | AudioConfig, SentenceMessage | 父组件调用子组件方法 |
| **状态提升** | Chat 组件管理共享状态 | 跨组件状态共享 |
| **配置管理模式** | getConfig (LocalStorage 封装) | 全局配置管理 |
| **事件监听模式** | WebSocket 事件处理 | 实时通信 |
| **错误边界** | try-catch + message 提示 | 异常处理 |
| **SDK 封装** | WsChatClient, CozeAPI | API 调用统一管理 |

## 7. 架构特点

1. **模块化设计**：功能按页面和组件分离，职责清晰
2. **配置驱动**：通过 LocalStorage 管理配置，支持动态切换
3. **事件驱动**：WebSocket 通信采用事件监听模式
4. **类型安全**：使用 TypeScript 定义接口和类型
5. **渐进式增强**：支持基础功能和高级功能的分层实现
6. **响应式设计**：使用 Ant Design 组件库实现跨平台适配
