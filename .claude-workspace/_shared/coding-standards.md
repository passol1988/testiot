# 编码规范与代码风格

## 1. 命名规范

### 1.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| **目录** | kebab-case（短横线命名） | `audio-config/`, `console-log/`, `event-input/` |
| **组件入口** | index.tsx | `components/audio-config/index.tsx` |
| **页面组件** | index.tsx | `pages/chat/index.tsx` |
| **独立组件** | PascalCase.tsx | `IoTHeader.tsx` |
| **样式文件** | 与组件同名.css | `header.css`, `index.css` |

### 1.2 代码命名

| 类型 | 规范 | 示例 |
|------|------|------|
| **React 组件** | PascalCase（大驼峰） | `App`, `Chat`, `IoTToys`, `AudioConfig` |
| **变量/函数** | camelCase（小驼峰） | `handleConnect`, `isConnected`, `clientRef` |
| **状态 setter** | set + 状态名 | `setIsConnected`, `setVolume` |
| **事件处理** | handle + 事件名 | `handleConnect`, `handleSettingsChange` |
| **常量** | camelCase | `localStorageKey`, `maxRecordingTime` |
| **接口/类型** | PascalCase | `AppHeaderProps`, `AudioConfigRef`, `CallState` |

### 1.3 命名示例

```typescript
// 组件命名
function Chat() { ... }
const IoTToys = () => { ... }
export const AudioConfig = forwardRef<AudioConfigRef, ...>(...);

// 状态命名
const [collapsed, setCollapsed] = useState(false);
const [isConnected, setIsConnected] = useState(false);
const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);

// 函数命名
const handleConnect = async () => { ... };
const handleSettingsChange = () => { ... };
const handleVolumeChange = (value: number) => { ... };

// Ref 命名
const clientRef = useRef<WsChatClient>();
const audioConfigRef = useRef<AudioConfigRef>(null);

// 常量命名
const localStorageKey = 'realtime-quickstart-ws';
const config = getConfig(localStorageKey);
```

## 2. 代码组织方式

### 2.1 目录结构规则

```
src/
├── components/          # 可复用组件
│   ├── audio-config/   # 使用 index.tsx 作为入口
│   ├── console-log/
│   ├── event-input/
│   ├── header/
│   ├── settings/
│   └── settings2/
├── pages/              # 页面组件
│   ├── chat/          # 页面可以有子组件
│   │   ├── index.tsx
│   │   ├── receive-message.tsx
│   │   ├── send-message.tsx
│   │   └── index.css
│   └── iot-toys/
│       ├── settings/
│       ├── IoTHeader.tsx
│       └── IoTHeader.css
├── utils/              # 工具函数
│   ├── config.ts
│   └── index.ts
├── App.tsx            # 主应用组件
└── main.tsx           # 应用入口
```

### 2.2 组件文件内部组织

**Import 顺序：**
```typescript
// 1. React 相关
import { useRef, useState, useEffect } from 'react';
import React from 'react';

// 2. 第三方库
import { Button, message, Layout } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { WsChatClient } from '@coze/api/ws-tools';

// 3. 组件内部导入
import { AudioConfig } from '../../components/audio-config';
import ReceiveMessage from '../chat/receive-message';

// 4. 样式文件
import './index.css';
import logo from '../../logo.svg';
```

**组件定义顺序：**
```typescript
// 1. 类型定义和接口
interface Props { ... }
export interface ComponentRef { ... }

// 2. 常量定义
const localStorageKey = 'realtime-quickstart-ws';
const config = getConfig(localStorageKey);

// 3. 组件函数
function ComponentName() {
  // Hooks
  const clientRef = useRef<WsChatClient>();
  const [isConnected, setIsConnected] = useState(false);

  // 内部函数
  async function initClient() { ... }
  const handleConnect = async () => { ... }

  // 渲染
  return ( ... );
}

// 4. 导出
export default ComponentName;
```

### 2.3 样式文件组织

```typescript
// 导入样式
import './index.css';

// 使用类名
<Layout className="chat-page">
<Header className="iot-header">
```

```css
/* 使用 scoped 类名 */
.voice-button {
  height: 44px;
  background-color: #f7f7f7;
}

.voice-button.recording {
  background-color: #e0e0e0;
}

/* 响应式 */
@media (max-width: 768px) {
  .device-select {
    width: 100%;
  }
}
```

## 3. 技术选型

### 3.1 状态管理

**使用 React Hooks：**
```typescript
// 简单状态
const [collapsed, setCollapsed] = useState(false);
const [isConnected, setIsConnected] = useState(false);

// 对象状态
const [formConfigs, setFormConfigs] = useState<FormConfig[]>([...]);

// 复杂状态使用多个 useState
const [callState, setCallState] = useState<CallState>('idle');
const [isConnecting, setIsConnecting] = useState(false);
```

**使用 useRef 持久化引用：**
```typescript
const clientRef = useRef<WsChatClient>();
const audioConfigRef = useRef<AudioConfigRef>(null);
const isFirstDeltaRef = useRef(true);
```

**使用 useImperativeHandle 暴露 ref 方法：**
```typescript
useImperativeHandle(ref, () => ({
  getSettings: () => ({
    denoiseMode,
    denoiseLevel,
  }),
}));
```

### 3.2 路由使用

```typescript
// src/App.tsx
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* 独立布局的路由 */}
        <Route path="/iot-toys" element={<IoTToys />} />

        {/* 共享布局的路由 */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Chat />} />
          <Route path="/transcription" element={<Transcription />} />
        </Route>
      </Routes>
    </Router>
  );
}

// 在组件中使用
const navigate = useNavigate();
const location = useLocation();
navigate(key);
location.pathname;
```

### 3.3 UI 组件使用

```typescript
import { Layout, Button, Modal, Form, Input } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

<Button type="primary" icon={<SettingOutlined />}>Settings</Button>
<Modal title="Settings" open={isSettingsVisible} onOk={...}>
  <Form form={form} onFinish={handleSettingsSave} layout="vertical">
    <Form.Item name="bot_id" label="智能体ID" rules={[...]}>
      <Input />
    </Form.Item>
  </Form>
</Modal>
```

### 3.4 Hooks 使用规范

```typescript
// useState
const [state, setState] = useState(initialValue);

// useEffect - 带清理函数
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);

// useRef
const ref = useRef<ElementType>(initialValue);

// useImperativeHandle
useImperativeHandle(ref, () => ({ method: () => {} }));

// useCallback
const memoizedCallback = useCallback(() => { ... }, [deps]);

// forwardRef
export default forwardRef<RefType, Props>((props, ref) => { ... });
```

## 4. 代码风格

### 4.1 注释风格

```typescript
// JSDoc 风格注释接口
export interface AudioConfigRef {
  getSettings: () => {
    denoiseMode: AIDenoiserProcessorMode;
    denoiseLevel: AIDenoiserProcessorLevel;
  };
}

// 单行注释说明功能
// load settings from local storage
useEffect(() => { ... });

// handle settings save
const handleSettingsSave = (values: any) => { ... };

// JSX 注释
{/* 独立布局的路由 */}
{/* 配置弹窗 */}
```

### 4.2 格式化规则

| 规则 | 说明 |
|------|------|
| **缩进** | 2 空格 |
| **引号** | 单引号 |
| **尾随逗号** | 多行对象/数组使用 |
| **换行** | JSX 属性多行时换行 |

```typescript
// 缩进和引号
const localStorageKey = 'realtime-quickstart-ws';
className="header"

// 多行换行
const menuItems = [
  {
    key: '/',
    icon: <MessageOutlined />,
    label: '实时语音对话',
  },
];

// JSX 属性多行
<Button
  type="primary"
  icon={<SettingOutlined />}
  onClick={() => setIsSettingsVisible(true)}
>
  Settings
</Button>
```

### 4.3 错误处理

```typescript
// try-catch 捕获错误
const handleConnect = async () => {
  try {
    await clientRef.current?.connect({ chatUpdate });
    setIsConnected(true);
  } catch (error) {
    console.error(error);
    message.error(`连接错误：${(error as Error).message}`);
  }
};

// 使用 message 显示错误
import { message } from 'antd';

message.error('更新智能体失败');
message.warning('Not Support!');
message.success('Authorization successful!');

// 条件检查提前返回
async function initClient() {
  const permission = await WsToolsUtils.checkDevicePermission();
  if (!permission.audio) {
    throw new Error('需要麦克风访问权限');
  }
  // ...
}
```

### 4.4 异步代码处理

```typescript
// async/await
const handleConnect = async () => {
  try {
    await initClient();
    await clientRef.current?.connect({ chatUpdate });
    setIsConnected(true);
  } catch (error) {
    // 错误处理
  }
};

// 清理异步资源
useEffect(() => {
  return () => {
    if (recordTimer.current) {
      clearInterval(recordTimer.current);
    }
    if (clientRef.current) {
      clientRef.current.disconnect();
    }
  };
}, []);
```

## 5. TypeScript 使用规范

### 5.1 类型定义位置

```typescript
// 内联类型定义（简单类型）
const Settings = ({
  onSettingsChange,
  localStorageKey,
}: {
  onSettingsChange: () => void;
  localStorageKey: string;
}) => { ... };

// 接口定义（复杂类型）
interface AppHeaderProps {
  onSettingsChange: () => void;
  localStorageKey: string;
  title: string;
}

// 类型别名（联合类型）
type CallState = 'idle' | 'calling' | 'connected';
type FormConfigType = 'input' | 'select';
```

### 5.2 接口定义风格

```typescript
// 使用 interface 定义对象结构
interface AppHeaderProps {
  onSettingsChange: () => void;
  localStorageKey: string;
  title: string;
}

// 接口扩展
interface FormConfig {
  name: string;
  label: string;
  required?: boolean;
  type?: FormConfigType;
  options?: { label: string; value: string }[];
}
```

### 5.3 泛型使用

```typescript
// useState 泛型
const [messageList, setMessageList] = useState<ChatMessage[]>([]);

// forwardRef 泛型
export const AudioConfig = forwardRef<
  AudioConfigRef,
  { clientRef: MutableRefObject<WsChatClient | undefined> }
>(({ clientRef }, ref) => { ... });

// 工具类型
Omit<DefaultOptionType, 'label'>
Record<string, typeof systemVoices>
```

## 6. 代码示例模板

### 完整组件模板

```typescript
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import getConfig from '../../utils/config';
import './index.css';

// 类型定义
interface Props {
  onSettingsChange: () => void;
  localStorageKey: string;
}

export interface ComponentRef {
  getSettings: () => Settings;
}

// 常量定义
const localStorageKey = 'realtime-quickstart-ws';
const config = getConfig(localStorageKey);

// 组件定义
const ComponentName = forwardRef<ComponentRef, Props>(
  ({ onSettingsChange, localStorageKey }, ref) => {
    // Hooks
    const [isVisible, setIsVisible] = useState(false);
    const [form] = Form.useForm();
    const clientRef = useRef<WsChatClient>();

    // 暴露 ref 方法
    useImperativeHandle(ref, () => ({
      getSettings: () => ({
        // ...
      }),
    }));

    // 副作用
    useEffect(() => {
      // 初始化逻辑
      return () => {
        // 清理逻辑
      };
    }, []);

    // 事件处理
    const handleSave = (values: any) => {
      // 处理保存
    };

    // 渲染
    return (
      <div className="component-name">
        <Button icon={<SettingOutlined />} onClick={() => setIsVisible(true)}>
          Settings
        </Button>
        <Modal open={isVisible} onOk={() => form.submit()}>
          <Form form={form} onFinish={handleSave}>
            {/* 表单内容 */}
          </Form>
        </Modal>
      </div>
    );
  }
);

export default ComponentName;
```

## 7. 关键要点总结

| 方面 | 规范 |
|------|------|
| **文件命名** | kebab-case 为主，组件目录使用 index.tsx |
| **组件命名** | PascalCase，导出使用 `export default` |
| **变量/函数** | camelCase，处理函数以 `handle` 开头 |
| **状态管理** | 主要使用 useState，复杂引用使用 useRef |
| **路由** | React Router v6 + HashRouter |
| **UI 库** | Ant Design 5.x |
| **样式** | 独立 CSS 文件，scoped 类名 |
| **TypeScript** | 严格模式，接口定义清晰 |
| **注释** | JSDoc 风格接口注释，行内注释说明功能 |
| **错误处理** | try-catch + message 提示 |
