# 现有功能模块

## 1. 页面功能

### 1.1 实时语音对话 (Chat)
**路径**: `/` | **文件**: `src/pages/chat/index.tsx`

**主要功能**:
- 与 Coze 智能体进行实时语音对话
- 支持两种对话模式:
  - `server_vad` - 自由对话模式（服务器端语音活动检测）
  - `client_interrupt` - 按键说话模式（客户端中断）
- 支持两种回复模式:
  - `stream` - 流式模式（逐字显示）
  - `sentence` - 字幕同步模式（音字同步，高亮当前播放的句子）
- 实时语音识别转录显示
- 音频设备选择（麦克风输入）
- 音量控制（0-100%）
- 麦克风静音/取消静音
- 打断对话功能
- 发送文本消息和自定义事件
- 高级音频配置（AI降噪、回声消除、自动增益控制）

**子组件**:
- `SendMessage` - 发送消息组件
- `ReceiveMessage` - 接收消息组件（流式）
- `SentenceMessage` - 接收消息组件（字幕同步）
- `Operation` - 操作组件
- `CustomTrack` - 自定义音频组件

### 1.2 语音识别 (Transcription)
**路径**: `/transcription` | **文件**: `src/pages/transcription/index.tsx`

**主要功能**:
- 实时语音转文字（ASR）
- AI 降噪支持
- 录音控制（开始/停止/暂停/恢复）
- 音频设备选择
- 前置条件检查（麦克风权限、PAT令牌、AI降噪支持）

### 1.3 语音合成 (Speech)
**路径**: `/speech` | **文件**: `src/pages/speech/index.tsx`

**主要功能**:
- 文本转语音（TTS）
- 两种播放模式:
  - 整句播放（一次性转换全部文本）
  - 流式播放（逐字符转换，模拟实时生成）
- 播放控制（暂停/恢复/中断）
- 音色配置（可选）

### 1.4 同声传译 (SimultInterpretation)
**路径**: `/simult` | **文件**: `src/pages/simult-interpretation/index.tsx`

**主要功能**:
- 多语种实时翻译
- 实时语音识别 + 翻译 + 语音输出
- PCM 音频播放器集成
- 翻译结果文本显示
- AI 降噪支持

### 1.5 语音识别+实时语音对话 (TTSWithTranscription)
**路径**: `/tts_transcription` | **文件**: `src/pages/tts_transcription/index.tsx`

**主要功能**:
- 组合功能：左侧实时语音回复，右侧语音识别
- 语音识别结果可直接发送至 TTS
- PCM 音频播放器
- 消息列表展示
- 支持打断播放

### 1.6 物联网玩具 (IoTToys)
**路径**: `/iot-toys` | **文件**: `src/pages/iot-toys/index.tsx`

**主要功能**:
- AI 玩具对话演示平台
- 三种通话状态: `idle`（空闲）、`calling`（连接中）、`connected`（已连接）
- 独立布局（不使用主应用布局）
- 智能体配置模态框:
  - 修改智能体名称、描述、头像
  - 配置人设与回复逻辑（prompt）
  - 设置开场白（prologue）
  - 建议问题配置

### 1.7 音频测试 (AudioTest)
**路径**: `/audio-test` | **文件**: `src/pages/audio-test/index.tsx`

**主要功能**:
- 音频录制和处理测试
- 从 audio 元素获取 MediaStreamTrack
- AI 降噪效果对比（源音频 vs 降噪后音频）
- WAV 格式录音导出
- 音频设备测试

## 2. 公共组件

### 2.1 Settings（基础设置组件）
**文件**: `src/components/settings/index.tsx`

**配置项**:
- `base_url` - API 基础 URL
- `base_ws_url` - WebSocket 基础 URL
- `pat` - 个人访问令牌
- `bot_id` - 智能体 ID
- `voice_id` - 音色 ID
- `workflow_id` - 工作流 ID

**使用页面**: Transcription、Speech、SimultInterpretation

### 2.2 Settings2（增强设置组件）
**文件**: `src/components/settings2/index.tsx`

**额外功能**:
- Cookie 换 Token 方案（去授权按钮）
- 工作空间树形选择
- 智能体搜索选择
- 音色下拉选择（支持预览）
- Token 过期自动刷新

**使用页面**: Chat、IoTToys

### 2.3 AudioConfig（音频配置组件）
**文件**: `src/components/audio-config/index.tsx`

**配置项**:
- 开发模式（启用详细日志）
- 默认静音
- 鸿蒙手机模式
- 噪声抑制
- 回声消除
- 自动增益控制
- AI 降噪模式（NSNG/STATIONARY_NS）
- AI 降噪强度（SOFT/AGGRESSIVE）

**使用页面**: Chat、IoTToys、AudioTest

### 2.4 EventInput（事件输入组件）
**文件**: `src/components/event-input/index.tsx`

**配置项**:
- 对话模式选择（自由对话/按键说话）
- 回复模式选择（流式/字幕同步）
- JSON 编辑器（带格式验证）

**使用页面**: Chat、IoTToys

### 2.5 ConsoleLog（控制台日志组件）
**文件**: `src/components/console-log/index.tsx`

**功能**:
- Hook window.console
- 日志暂停/继续
- 清空日志
- 滚动查看

**使用页面**: Chat（仅移动端）

### 2.6 IoTHeader（物联网头部组件）
**文件**: `src/pages/iot-toys/IoTHeader.tsx`

**功能**:
- Popover 高级配置面板
- 额外内容插槽
- 固定定位

## 3. 工具模块

### 3.1 Config（配置管理）
**文件**: `src/utils/config.ts`

**方法**:
- `getBaseUrl()` - API 基础 URL
- `getBaseWsUrl()` - WebSocket 基础 URL
- `getPat()` - 个人访问令牌
- `getExpiresIn()` - Token 过期时间
- `getBotId()` - 智能体 ID
- `getVoiceId()` - 音色 ID
- `getWorkflowId()` - 工作流 ID
- `getChatUpdate()` - 对话配置

### 3.2 Token 获取工具
**文件**: `src/utils/index.ts`

**方法**:
- `getTokenByCookie()` - 通过 Cookie 获取 OAuth Token

### 3.3 useApi Hook
**文件**: `src/components/settings2/use-api.ts`

**方法**:
- `isRelease()` - 判断是否生产环境
- `getBotInfo(botId)` - 获取智能体信息
- `getBots(workspaceId)` - 获取智能体列表
- `getWorkspaces()` - 获取工作空间列表
- `getVoices()` - 获取音色列表

## 4. 集成功能

### 4.1 Coze API 集成

**使用的 SDK**: `@coze/api`

**主要客户端**:
1. **WsChatClient** - 实时语音对话
2. **WsTranscriptionClient** - 语音识别
3. **WsSpeechClient** - 语音合成
4. **WsSimultInterpretationClient** - 同声传译
5. **CozeAPI** - REST API
6. **PcmRecorder** - PCM 录音
7. **PcmPlayer** - PCM 播放

**认证方式**:
- PAT（Personal Access Token）
- OAuth Token（Cookie 换 Token）

### 4.2 WebSocket 实时通信

**连接配置**:
```typescript
{
  token: string,
  baseWsURL: string,
  botId: string,
  voiceId?: string,
  workflowId?: string,
  aiDenoisingConfig?: {...},
  audioCaptureConfig?: {...},
  deviceId?: string,
  audioMutedDefault?: boolean,
  enableLocalLoopback?: boolean
}
```

**事件监听**:
- `CONNECTED` - 连接成功
- `CONVERSATION_AUDIO_TRANSCRIPT_UPDATE` - 语音转录更新
- `CONVERSATION_MESSAGE_DELTA` - 消息增量更新
- `CONVERSATION_MESSAGE_COMPLETED` - 消息完成
- `AUDIO_SENTENCE_PLAYBACK_START` - 句子播放开始
- `AUDIO_SENTENCE_PLAYBACK_ENDED` - 句子播放结束
- `AUDIO_MUTED` - 麦克风关闭
- `AUDIO_UNMUTED` - 麦克风打开
- `SERVER_ERROR` - 服务器错误

### 4.3 音频处理功能

**AI 降噪**:
- 模式: NSNG（推荐）/ STATIONARY_NS
- 强度: SOFT（推荐）/ AGGRESSIVE
- 资源路径: `https://lf3-static.bytednsdoc.com/obj/eden-cn/613eh7lpqvhpeuloz/websocket`

**音频捕获配置**:
- `echoCancellation` - 回声消除
- `noiseSuppression` - 噪声抑制
- `autoGainControl` - 自动增益控制

**音频格式**:
- 输入: PCM, 48000Hz
- 输出: PCM, 24000Hz

### 4.4 物联网控制功能

**智能体 API**:
- `GET /v1/bots/{botId}` - 获取智能体信息
- `POST /v1/bot/update` - 更新智能体配置
- `POST /v1/files/upload` - 上传头像

**智能体配置**:
- `name` - 智能体名称
- `description` - 描述
- `icon_url` - 头像 URL
- `prompt_info.prompt` - 人设与回复逻辑
- `onboarding_info.prologue` - 开场白
- `onboarding_info.suggested_questions` - 建议问题

## 5. 页面关系图

```
App.tsx
├── DefaultLayout (共享布局)
│   ├── Chat (实时语音对话) [/]
│   ├── Transcription (语音识别) [/transcription]
│   ├── Speech (语音合成) [/speech]
│   ├── SimultInterpretation (同声传译) [/simult]
│   └── TTSWithTranscription (语音识别+实时语音对话) [/tts_transcription]
└── IoTToys (物联网玩具) [/iot-toys] (独立布局)
```

## 6. 共享功能点

- Settings/Settings2 组件
- AudioConfig 组件
- EventInput 组件
- ConsoleLog 组件（移动端）
- WsToolsUtils 工具函数
- Config 配置管理

## 7. 技术栈

- **前端框架**: React 18.3 + TypeScript
- **UI 组件**: Ant Design 5.21
- **路由**: React Router DOM 6.28
- **SDK**: @coze/api
- **构建工具**: Vite 4.2
- **控制台**: console-feed 3.8
