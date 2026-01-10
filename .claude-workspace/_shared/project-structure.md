# 项目结构分析

## 项目基本信息

| 属性 | 值 |
|------|-----|
| **项目名称** | @coze/realtime-websocket |
| **项目类型** | 前端 SPA 应用 |
| **开发语言** | TypeScript + React (TSX) |
| **包管理** | pnpm / npm / yarn (多支持) |

## 技术栈

### 核心框架
| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | ^18.3.1 | 前端框架 |
| **TypeScript** | ^5.2.2 | 类型系统 |
| **Vite** | ^4.2.0 | 构建工具 |
| **React Router DOM** | ~6.28.0 | 路由管理 |

### UI 组件库
| 库 | 版本 |
|----|------|
| **Ant Design** | ^5.21.3 |
| **@ant-design/icons** | ^5.5.1 |

### 核心依赖
| 库 | 版本 | 用途 |
|----|------|------|
| **@coze/api** | latest | Coze API SDK |
| **console-feed** | ^3.8.0 | 控制台日志展示 |
| **react-dom** | ^18.3.1 | React DOM 渲染 |

## 目录结构

```
/Users/passol/Desktop/llmdevelop/claudecode/testiot/
├── .git/                      # Git 版本控制
├── .claude-workspace/         # Claude 工作区配置
├── .vite/                     # Vite 缓存目录
├── .gitignore                 # Git 忽略文件配置
├── README.md                  # 项目说明文档
├── index.html                 # HTML 入口文件
├── package.json               # 项目依赖配置
├── vite.config.ts             # Vite 构建配置
├── tsconfig.json              # TypeScript 配置
├── eslint.config.cjs          # ESLint 代码检查配置
├── src/                       # 源代码目录
├── public/                    # 静态资源目录
├── config/                    # 配置目录
└── scripts/                   # 脚本目录
```

## 源代码目录结构

```
src/
├── main.tsx                           # 应用入口
├── App.tsx                            # 主应用组件 (路由配置)
├── App.css                            # 全局样式
├── env.d.ts                           # 环境变量类型定义
│
├── components/                        # 公共组件目录
│   ├── audio-config/                  # 音频配置组件
│   ├── console-log/                   # 控制台日志组件
│   ├── event-input/                   # 事件输入组件
│   ├── header/                        # 头部组件 (header.tsx, header.css)
│   ├── settings/                      # 设置组件 (旧版)
│   └── settings2/                     # 设置组件 (新版, use-api.ts)
│
├── pages/                             # 页面目录
│   ├── chat/                          # 实时语音对话页面
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── operation.tsx              # 操作组件
│   │   ├── send-message.tsx           # 发送消息组件
│   │   ├── receive-message.tsx        # 接收消息组件
│   │   ├── sentence-message.tsx       # 句子消息组件
│   │   └── custom-track.tsx           # 自定义音轨组件
│   │
│   ├── iot-toys/                      # 物联网玩具页面 (独立布局)
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── IoTHeader.tsx              # IoT 头部组件
│   │   ├── IoTHeader.css
│   │   └── settings/                  # IoT 设置
│   │       ├── index.tsx
│   │       └── use-api.ts
│   │
│   ├── transcription/                 # 语音识别 (ASR) 页面
│   ├── speech/                        # 语音合成 (TTS) 页面
│   ├── simult-interpretation/         # 同声传译页面
│   ├── tts_transcription/             # 语音识别+实时语音对话
│   │   ├── index.tsx
│   │   └── transcription.tsx
│   │
│   └── audio-test/                    # 音频测试页面
│
└── utils/                             # 工具函数目录
    ├── index.ts
    └── config.ts                      # 配置管理
```

## 路由结构

| 路径 | 组件 | 布局 | 描述 |
|------|------|------|------|
| `/` | Chat | 共享布局 | 实时语音对话 |
| `/iot-toys` | IoTToys | 独立布局 | 物联网玩具 |
| `/transcription` | Transcription | 共享布局 | 语音识别 (ASR) |
| `/speech` | Speech | 共享布局 | 语音合成 (TTS) |
| `/simult` | SimultInterpretation | 共享布局 | 同声传译 |
| `/tts_transcription` | TTSWithTranscription | 共享布局 | ASR + TTS |
| `/audio-test` | AudioTest | 共享布局 | 音频测试 |

## NPM Scripts

| 命令 | 描述 |
|------|------|
| `npm run build` | 构建生产版本 (tsc && vite build) |
| `npm run lint` | 代码检查 (eslint . --max-warnings 0) |
| `npm run preview` | 预览生产构建 |
| `npm run start` | 启动开发服务器 (vite --host) |
| `npm test` | 占位测试命令 |

## 构建配置

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_PUBLIC_URL,
  plugins: [react()],
});
```

### tsconfig.json 关键配置
- **target**: ES2020
- **jsx**: react-jsx
- **strict**: true (严格模式)
- **noUnusedLocals**: true (禁止未使用的局部变量)
- **noUnusedParameters**: true (禁止未使用的参数)

## 项目特点

1. **前端 SPA 应用**：基于 React + TypeScript + Vite 构建的单页应用
2. **实时通信功能**：集成 Coze API 实现实时语音对话、WebSocket 通信
3. **音频处理能力**：包含语音识别 (ASR)、语音合成 (TTS)、同声传译等功能
4. **物联网集成**：专门的 IoT Toys 页面用于物联网玩具控制
5. **现代化开发工具**：使用 Vite 作为构建工具，开发体验优秀
6. **严格的代码规范**：配置了 ESLint + TypeScript 进行代码检查
7. **Ant Design UI**：使用 Ant Design 作为 UI 组件库
8. **本地存储配置**：使用 localStorage 存储 API 配置信息

## 关键文件路径

| 文件类型 | 路径 |
|----------|------|
| 入口文件 | `src/main.tsx` |
| 主应用 | `src/App.tsx` |
| HTML 模板 | `index.html` |
| 构建配置 | `vite.config.ts` |
| TS 配置 | `tsconfig.json` |
| 依赖配置 | `package.json` |
| ESLint 配置 | `eslint.config.cjs` |
| 工具配置 | `src/utils/config.ts` |
