# 生物联网智能体管理平台 技术方案 v1

## 1. 功能概述

生物联网智能体管理平台是一个面向儿童智能玩具的智能体管理系统，提供智能体的创建、编辑、发布和实时语音通话功能。用户可以通过友好的界面配置儿童向的 AI 助手，设置人设、回复风格、价值观和技能，并通过 WebSocket 进行实时语音交互。

**核心特性：**
- 智能体全生命周期管理（创建、编辑、发布）
- 儿童友好的 Prompt 模板自动生成
- 实时语音通话功能
- 活泼可爱的 UI 设计风格

## 2. 功能清单

### 2.1 包含的功能

**用户认证**
- [ ] 登录弹窗（输入 user_id 和 PAT）
- [ ] 登录状态持久化（LocalStorage）
- [ ] 登录状态检查和自动跳转

**智能体管理**
- [ ] 智能体列表展示（卡片式布局）
- [ ] 智能体创建（表单 + Prompt 模板生成）
- [ ] 智能体编辑（API 数据 + Storage 扩展字段）
- [ ] 智能体发布（发布到扣子商店）
- [ ] 头像上传（实时上传获取 file_id）
- [ ] 智能体详情查看

**配置功能**
- [ ] 回复风格选择（简洁明了/适中详细/丰富详尽）
- [ ] 价值观多选（正直、善良、勇敢、真诚）
- [ ] 习惯养成多选（10 个选项）
- [ ] 技能插件多选（5 个插件）
- [ ] 音色选择（实时获取音色列表）
- [ ] 音调/语速配置（支持情感的音色）

**Prompt 生成**
- [ ] 用户自定义输入框
- [ ] 系统模板自动拼接
- [ ] 儿童保护约束自动添加
- [ ] Prompt 预览（默认折叠，可展开）
- [ ] 字符数实时显示

**通话功能**
- [ ] 实时语音通话（复用 IoTToys 逻辑）
- [ ] 智能体信息展示（头像、名称、开场白）
- [ ] 高级配置（AI 降噪、对话模式等）
- [ ] 音量控制
- [ ] 麦克风选择
- [ ] 通话状态监控
- [ ] 页面可见性处理

**其他**
- [ ] 知识库按钮（右下角悬浮，敬请期待）

### 2.2 不包含的功能

- [ ] 智能体删除功能（只能编辑，不提供删除）
- [ ] 知识库管理功能（标记为敬请期待）
- [ ] 通话页面的设置按钮（已有高级配置，无需重复）
- [ ] 多工作空间切换（固定使用预设工作空间）
- [ ] 工作流配置（本期不包含）
- [ ] 数据集/知识库配置（本期不包含）
- [ ] 插件自定义配置（使用预设插件列表）

## 3. 技术方案

### 3.1 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3 | 前端框架 |
| TypeScript | latest | 类型检查 |
| Ant Design | 5.21 | UI 组件库 |
| React Router DOM | 6.28 | 路由管理 |
| @coze/api | latest | Coze SDK |
| Vite | 4.2 | 构建工具 |

### 3.2 架构设计

**组件层级结构**

```
App.tsx
└── bot-manager/ (独立路由)
    ├── index.tsx (管理首页)
    │   ├── LoginModal
    │   ├── Header
    │   ├── BotList
    │   │   └── BotCard[]
    │   └── KnowledgeFab
    ├── create.tsx (创建页面)
    │   └── BotForm
    │       ├── BasicInfoSection
    │       ├── PromptSection
    │       ├── StyleSection
    │       ├── PluginSelector
    │       ├── VoiceSelector
    │       └── PromptPreview
    ├── edit/:botId (编辑页面)
    │   └── BotForm (复用，带数据加载)
    └── call/
        └── index.tsx (通话页面)
            ├── CallHeader
            ├── IdleState
            ├── CallingState
            ├── ActiveState
            └── AdvancedConfigPopover
                ├── AudioConfig (复用)
                └── EventInput (复用)
```

**数据流向**

```
用户操作
    ↓
组件事件处理
    ↓
┌─────────────────────────────────────┐
│         数据处理层                   │
│  - useBotApi Hook (API 调用)         │
│  - useLocalStorage Hook (Storage)    │
│  - usePromptTemplate (模板生成)      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│         状态管理层                   │
│  - 组件内部 useState                 │
│  - LocalStorage 持久化               │
│  - WebSocket 连接状态                │
└─────────────────────────────────────┘
    ↓
UI 更新渲染
```

### 3.3 API 集成计划

| API 端点 | 用途 | 调用时机 |
|---------|------|---------|
| `GET /v1/bots?space_id={id}` | 获取智能体列表 | 进入首页自动刷新、创建/编辑/发布成功后 |
| `GET /v1/bots/{botId}` | 获取智能体详情 | 编辑页面加载时 |
| `POST /v1/bot/create` | 创建智能体 | 创建表单提交时 |
| `POST /v1/bot/update` | 更新智能体 | 编辑表单提交时 |
| `POST /v1/bot/publish` | 发布智能体 | 点击发布按钮时 |
| `POST /v1/files/upload` | 上传头像文件 | 选择头像文件后实时上传 |
| `GET /v1/audio/voices` | 获取音色列表 | 打开创建/编辑表单时 |

### 3.4 状态管理设计

**方案选择：** 组件内部 `useState` + LocalStorage 持久化

**LocalStorage 数据结构**

```typescript
// bot-manager_auth - 登录信息
interface AuthStorage {
  user_id: string;
  pat: string;
}

// bot-manager_ext - 智能体扩展配置
interface BotExtStorage {
  [botId: string]: {
    replyStyle: '简洁明了' | '适中详细' | '丰富详尽';
    values: string[];      // 价值观
    habits: string[];      // 习惯
    customPrompt: string;  // 用户自定义 prompt
    voiceId: string;       // 音色 ID
    voicePitch: number;    // 音调 (0.5 - 2.0)
    voiceSpeed: number;    // 语速 (0.5 - 2.0)
  };
}

// bot-manager_tts - TTS 全局配置（可选）
interface TTSStorage {
  voiceId: string;
  voicePitch: number;
  voiceSpeed: number;
}
```

**组件状态结构**

```typescript
// 管理首页
interface HomePageState {
  isLoggedIn: boolean;
  isLoading: boolean;
  botList: BotInfo[];
  isLoginModalVisible: boolean;
}

// 创建/编辑表单
interface BotFormState {
  mode: 'create' | 'edit';
  formData: BotFormData;
  avatarFileId: string | null;
  avatarUrl: string;
  isPromptPreviewVisible: boolean;
  generatedPrompt: string;
}

// 通话页面
interface CallPageState {
  callState: 'idle' | 'calling' | 'connected';
  botInfo: BotInfo | null;
  isAdvancedConfigVisible: boolean;
  callDuration: number;
}
```

### 3.5 路由设计

**路由结构**

```typescript
// App.tsx 中添加路由
<Route path="/bot-manager" element={<BotManager />}>
  <Route index element={<BotList />} />
  <Route path="create" element={<BotCreate />} />
  <Route path="edit/:botId" element={<BotEdit />} />
  <Route path="call/:botId" element={<BotCall />} />
</Route>
```

**独立布局实现**

```typescript
// bot-manager/index.tsx 作为独立布局入口
const BotManager = () => {
  return (
    <Routes>
      <Route element={<BotManagerLayout />}>
        <Route index element={<BotListPage />} />
        <Route path="create" element={<BotCreatePage />} />
        <Route path="edit/:botId" element={<BotEditPage />} />
      </Route>
      <Route path="call/:botId" element={<BotCallPage />} />
    </Routes>
  );
};
```

## 4. 组件设计

### 4.1 组件树

```
BotManagerLayout (独立布局)
└── Outlet (子路由渲染)
    ├── BotListPage
    │   ├── LoginModal
    │   ├── PageHeader
    │   ├── BotList
    │   │   └── BotCard[]
    │   └── KnowledgeFab
    ├── BotCreatePage
    │   └── BotForm
    └── BotEditPage
        └── BotForm (复用)

BotCallPage (独立布局)
├── CallHeader
├── Outlet (状态渲染)
│   ├── IdleState
│   ├── CallingState
│   └── ActiveState
└── AdvancedConfigPopover
    ├── AudioConfig (复用现有组件)
    └── EventInput (复用现有组件)
```

### 4.2 各组件详细设计

#### LoginModal

**功能：** 用户登录弹窗，输入 user_id 和 PAT

**Props：**
```typescript
interface LoginModalProps {
  visible: boolean;
  onSubmit: (credentials: { user_id: string; pat: string }) => void;
  onCancel: () => void;
}
```

**State：**
```typescript
interface LoginModalState {
  user_id: string;
  pat: string;
  isLoading: boolean;
}
```

**关键逻辑：**
- 表单验证（非空）
- 保存到 LocalStorage
- 成功后跳转到列表页

---

#### BotList

**功能：** 智能体列表展示，网格布局

**Props：**
```typescript
interface BotListProps {
  bots: BotInfo[];
  loading: boolean;
  onEdit: (botId: string) => void;
  onCall: (botId: string) => void;
  onPublish: (botId: string) => void;
  onRefresh: () => void;
}
```

**State：** 无（受控组件）

**关键逻辑：**
- 空状态处理
- 加载状态处理
- 卡片网格布局（响应式）

---

#### BotCard

**功能：** 单个智能体卡片展示

**Props：**
```typescript
interface BotCardProps {
  bot: BotInfo;
  onEdit: (botId: string) => void;
  onCall: (botId: string) => void;
  onPublish: (botId: string) => void;
}
```

**State：** 无（纯展示组件）

**UI 元素：**
- 头像（icon_url）
- 名称
- 描述
- 状态标签（草稿/已发布）
- 操作按钮（编辑、通话、发布）

---

#### BotForm

**功能：** 创建/编辑智能体表单

**Props：**
```typescript
interface BotFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<BotFormData>;
  botId?: string; // 编辑模式
  onSubmit: (data: BotFormData) => Promise<void>;
  onCancel: () => void;
}
```

**State：**
```typescript
interface BotFormState {
  formData: BotFormData;
  avatarFileId: string | null;
  avatarUrl: string;
  isPromptPreviewVisible: boolean;
  voices: VoiceInfo[];
  isLoadingVoices: boolean;
}
```

**表单字段：**
- 基本信息：name, description, icon_file_id
- 自定义 Prompt：customPrompt（必填）
- 回复风格：replyStyle（单选）
- 价值观：values（多选）
- 习惯养成：habits（多选）
- 技能插件：pluginIdList（多选）
- 欢迎语：prologue
- 音色：voiceId
- 音调：voicePitch
- 语速：voiceSpeed

**关键逻辑：**
- 实时上传头像
- 实时生成 Prompt 模板
- 字符数实时显示
- 音色列表加载
- 情感支持检测

---

#### PromptPreview

**功能：** Prompt 预览组件，可折叠展开

**Props：**
```typescript
interface PromptPreviewProps {
  prompt: string;
  visible: boolean;
  onToggle: () => void;
}
```

**State：** 无（受控组件）

**UI 元素：**
- 折叠/展开指示器
- 复制按钮
- 格式化显示

---

#### PluginSelector

**功能：** 插件多选组件

**Props：**
```typescript
interface PluginSelectorProps {
  value: string[];
  onChange: (pluginIds: string[]) => void;
  options: PluginInfo[];
}
```

**State：** 无（受控组件）

**UI 元素：**
- Checkbox.Group
- 插件图标
- 插件描述

---

#### VoiceSelector

**功能：** 音色选择器，支持音调语速配置

**Props：**
```typescript
interface VoiceSelectorProps {
  voiceId: string;
  pitch: number;
  speed: number;
  onVoiceChange: (voiceId: string) => void;
  onPitchChange: (pitch: number) => void;
  onSpeedChange: (speed: number) => void;
  supportEmotion: boolean;
}
```

**State：**
```typescript
interface VoiceSelectorState {
  voices: VoiceInfo[];
  loading: boolean;
}
```

**关键逻辑：**
- 加载音色列表
- 检测情感支持
- 音调/语速条件显示

---

#### CallHeader

**功能：** 通话页面头部

**Props：**
```typescript
interface CallHeaderProps {
  botInfo: BotInfo;
  callState: 'idle' | 'calling' | 'connected';
  callDuration: number;
  formatDuration: (seconds: number) => string;
  onBack: () => void;
  onShowAdvancedConfig: () => void;
}
```

**State：** 无

**UI 元素：**
- 返回按钮
- 智能体信息（头像、名称）
- 通话时长
- 高级配置按钮

---

#### IdleState / CallingState / ActiveState

**功能：** 通话不同状态的 UI 展示

**Props：**
```typescript
interface IdleStateProps {
  botInfo: BotInfo;
  onStart: () => void;
}

interface CallingStateProps {
  botInfo: BotInfo;
}

interface ActiveStateProps {
  botInfo: BotInfo;
  clientRef: RefObject<WsChatClient>;
  onEndCall: () => void;
}
```

**关键逻辑：**
- 复用 IoTToys 的通话逻辑
- 使用 ReceiveMessage / SendMessage / SentenceMessage 组件

---

#### KnowledgeFab

**功能：** 知识库悬浮按钮（敬请期待）

**Props：** 无

**State：**
```typescript
interface KnowledgeFabState {
  modalVisible: boolean;
}
```

**UI 元素：**
- 右下角固定悬浮按钮
- 点击显示"敬请期待"弹窗

## 5. 数据模型

### 5.1 TypeScript 类型定义

```typescript
// ==================== API 类型 ====================

/**
 * 智能体信息（列表）
 */
interface BotInfo {
  bot_id: string;
  name: string;
  description: string;
  icon_url: string;
  is_published: boolean;
  publish_time?: number;
  create_time: number;
  update_time: number;
}

/**
 * 智能体详情
 */
interface BotDetail extends BotInfo {
  prompt_info: {
    prompt: string;
    prompt_mode: string;
  };
  onboarding_info: {
    prologue: string;
    suggested_questions?: string[];
  };
  plugin_info_list?: PluginInfo[];
}

/**
 * 插件信息
 */
interface PluginInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  apiList: Array<{
    apiId: string;
    name: string;
    description: string;
  }>;
}

/**
 * 音色信息
 */
interface VoiceInfo {
  voice_id: string;
  voice_name: string;
  language: string;
  gender: string;
  support_emotions?: string[];
}

// ==================== 表单类型 ====================

/**
 * 智能体表单数据
 */
interface BotFormData {
  // 基本信息（API）
  name: string;
  description: string;
  icon_file_id?: string;
  prompt_info: {
    prompt: string;
  };
  onboarding_info: {
    prologue: string;
    suggested_questions: string[];
  };
  plugin_id_list?: {
    id_list: Array<{
      plugin_id: string;
      api_id?: string;
    }>;
  };

  // 扩展字段（Storage）
  replyStyle: '简洁明了' | '适中详细' | '丰富详尽';
  values: string[];
  habits: string[];
  customPrompt: string;
  voiceId: string;
  voicePitch: number;
  voiceSpeed: number;
}

// ==================== Storage 类型 ====================

/**
 * 登录信息
 */
interface AuthStorage {
  user_id: string;
  pat: string;
}

/**
 * 智能体扩展配置
 */
interface BotExtConfig {
  replyStyle: BotFormData['replyStyle'];
  values: string[];
  habits: string[];
  customPrompt: string;
  voiceId: string;
  voicePitch: number;
  voiceSpeed: number;
}

/**
 * LocalStorage 结构
 */
interface BotManagerStorage {
  'bot-manager_auth': AuthStorage;
  'bot-manager_ext': Record<string, BotExtConfig>;
}

// ==================== Prompt 模板类型 ====================

/**
 * Prompt 模板选项
 */
interface PromptTemplateOptions {
  customPrompt: string;
  replyStyle: BotFormData['replyStyle'];
  values: string[];
  habits: string[];
  skills: string[];
}

// ==================== 通话页面类型 ====================

/**
 * 通话状态
 */
type CallState = 'idle' | 'calling' | 'connected';

/**
 * 对话模式
 */
type TurnDetectionType = 'server_vad' | 'client_interrupt';

/**
 * 回复模式
 */
type ReplyMode = 'stream' | 'sentence';
```

### 5.2 数据流转

**创建智能体流程**

```
用户填写表单
    ↓
监听表单变化
    ↓
┌─────────────────────────────────────────┐
│  实时生成 Prompt 预览                    │
│  - customPrompt (用户输入)              │
│  - replyStyle (选择)                     │
│  - values (多选)                         │
│  - habits (多选)                         │
│  - skills (插件名称)                     │
│       ↓                                 │
│  调用 generatePrompt()                  │
│  - 拼接用户自定义部分                    │
│  - 添加系统模板                          │
│  - 添加儿童保护约束                      │
└─────────────────────────────────────────┘
    ↓
用户上传头像
    ↓
调用 uploadFile() → 获取 file_id
    ↓
用户点击"创建"
    ↓
┌─────────────────────────────────────────┐
│  准备 API 数据                            │
│  - name, description                     │
│  - icon_file_id                          │
│  - prompt (生成的完整 Prompt)            │
│  - prologue                              │
│  - plugin_id_list                        │
└─────────────────────────────────────────┘
    ↓
调用 createBot() API
    ↓
返回 bot_id
    ↓
保存扩展配置到 Storage (key: bot_id)
    ↓
返回列表页 (刷新)
```

**编辑智能体流程**

```
点击编辑按钮
    ↓
进入编辑页面
    ↓
┌─────────────────────────────────────────┐
│  并行加载数据                             │
│  ├─ API: fetchBotDetail(botId)          │
│  │   → name, description, icon_url,     │
│  │      prompt, prologue                 │
│  └─ Storage: getBotExtConfig(botId)     │
│      → replyStyle, values, habits, etc.  │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  填充表单                                │
│  - API 数据 → 基本信息字段               │
│  - Storage 数据 → 扩展字段               │
│  - Storage 无数据 → 扩展字段显示默认值   │
└─────────────────────────────────────────┘
    ↓
用户修改表单
    ↓
用户点击"保存"
    ↓
┌─────────────────────────────────────────┐
│  重新生成 Prompt（忽略 API 的 prompt）    │
│  - 使用 Storage 的扩展字段               │
│  - 或使用表单当前值                      │
└─────────────────────────────────────────┘
    ↓
调用 updateBot() API
    ↓
更新 Storage 扩展配置
    ↓
返回列表页 (刷新)
```

**进入通话流程**

```
点击"通话"按钮
    ↓
┌─────────────────────────────────────────┐
│  获取智能体信息                           │
│  - bot_id (路由参数)                     │
│  - botInfo (从列表缓存或 API)            │
│  - extConfig (从 Storage)                │
└─────────────────────────────────────────┘
    ↓
跳转到 /bot-manager/call/:botId
    ↓
初始化通话页面
    ↓
┌─────────────────────────────────────────┐
│  合并配置                                 │
│  - botInfo: 基本信息                     │
│  - extConfig: 扩展配置                   │
│  - audioConfig: 高级配置                 │
└─────────────────────────────────────────┘
    ↓
用户点击"开始通话"
    ↓
┌─────────────────────────────────────────┐
│  构建 chatUpdate                         │
│  {                                      │
│    output_audio: {                      │
│      voice_id: extConfig.voiceId,       │
│      emotion_config: {                  │
│        pitch: extConfig.voicePitch,     │
│        speed: extConfig.voiceSpeed      │
│      }                                  │
│    },                                   │
│    turn_detection: {...},               │
│    need_play_prologue: true             │
│  }                                      │
└─────────────────────────────────────────┘
    ↓
建立 WebSocket 连接
    ↓
播放开场白 (自动)
    ↓
开始实时对话
```

## 6. 开发任务拆分

### Phase 1: 基础设施和页面结构 (4h)

- [ ] Task 1.1: 创建基础目录结构和路由配置 (1h)
  - 创建 `src/pages/bot-manager/` 目录
  - 创建子目录：`components/`, `hooks/`, `utils/`, `call/`
  - 在 App.tsx 中添加 `/bot-manager` 路由

- [ ] Task 1.2: 实现 LocalStorage 工具函数 (1h)
  - 创建 `utils/storage.ts`
  - 实现 `getAuth()`, `setAuth()`, `clearAuth()`
  - 实现 `getBotExtConfig()`, `setBotExtConfig()`
  - 添加 TypeScript 类型定义

- [ ] Task 1.3: 实现 Prompt 模板生成逻辑 (1h)
  - 创建 `utils/prompt-template.ts`
  - 实现 `generatePrompt()` 函数
  - 添加儿童保护约束模板
  - 编写单元测试

- [ ] Task 1.4: 创建基础布局组件 (1h)
  - 创建 `BotManagerLayout` 组件
  - 实现活泼可爱的样式主题
  - 添加全局 CSS 变量

### Phase 2: 登录和列表功能 (5h)

- [ ] Task 2.1: 实现 LoginModal 组件 (2h)
  - 表单布局和验证
  - 登录逻辑和 Storage 存储
  - 错误处理

- [ ] Task 2.2: 实现 useBotApi Hook (2h)
  - 封装所有 Bot API 调用
  - 错误处理和 loading 状态
  - 类型定义

- [ ] Task 2.3: 实现 BotList 和 BotCard 组件 (2h)
  - 网格布局
  - 加载状态
  - 空状态处理
  - 卡片操作按钮

- [ ] Task 2.4: 实现页面头部和知识库按钮 (1h)
  - PageHeader 组件
  - KnowledgeFab 组件
  - 敬请期待弹窗

### Phase 3: 创建/编辑表单 (8h)

- [ ] Task 3.1: 实现 BotForm 基础结构 (2h)
  - 表单布局
  - 基本信息字段
  - 表单验证规则

- [ ] Task 3.2: 实现头像上传组件 (2h)
  - AvatarUpload 组件
  - 实时上传逻辑
  - 预览功能

- [ ] Task 3.3: 实现 Prompt 输入区域 (2h)
  - 自定义输入框
  - 字符数实时显示
  - 回复风格选择器

- [ ] Task 3.4: 实现价值观和习惯选择器 (1h)
  - Checkbox.Group
  - 预设选项配置

- [ ] Task 3.5: 实现 PluginSelector 组件 (1h)
  - 插件列表展示
  - 多选逻辑
  - 技能拼接到 Prompt

### Phase 4: 音色和 TTS 配置 (4h)

- [ ] Task 4.1: 实现 useVoiceApi Hook (1h)
  - 获取音色列表
  - 情感支持检测
  - 类型定义

- [ ] Task 4.2: 实现 VoiceSelector 组件 (2h)
  - 音色下拉选择
  - 音调/语速滑块
  - 情感支持条件显示

- [ ] Task 4.3: 实现 PromptPreview 组件 (1h)
  - 折叠/展开逻辑
  - 格式化显示
  - 复制功能

### Phase 5: 编辑页面 (3h)

- [ ] Task 5.1: 实现数据加载逻辑 (1h)
  - API 详情获取
  - Storage 扩展配置读取
  - 数据合并策略

- [ ] Task 5.2: 实现表单数据填充 (1h)
  - 基本信息回显
  - 扩展字段回显
  - 空值处理

- [ ] Task 5.3: 实现更新逻辑 (1h)
  - Prompt 重新生成（忽略 API）
  - API 调用
  - Storage 更新

### Phase 6: 通话页面 (6h)

- [ ] Task 6.1: 实现通话页面基础结构 (1h)
  - 路由配置
  - 状态管理
  - 布局组件

- [ ] Task 6.2: 实现 CallHeader 组件 (1h)
  - 头部布局
  - 智能体信息展示
  - 通话时长显示

- [ ] Task 6.3: 实现各状态 UI 组件 (2h)
  - IdleState（开始按钮）
  - CallingState（连接动画）
  - ActiveState（通话界面）

- [ ] Task 6.4: 集成 IoTToys 通话逻辑 (1h)
  - WebSocket 初始化
  - 复用 ReceiveMessage/SendMessage
  - 音频配置传递

- [ ] Task 6.5: 实现高级配置集成 (1h)
  - AudioConfig 集成
  - EventInput 集成
  - Popover 触发

### Phase 7: 通话监控和优化 (3h)

- [ ] Task 7.1: 实现 usePageVisibility Hook (1h)
  - 页面可见性检测
  - 提示逻辑

- [ ] Task 7.2: 实现 useWakeLock Hook (1h)
  - 屏幕常亮请求
  - 兼容性处理

- [ ] Task 7.3: 实现 useCallMonitor Hook (1h)
  - 通话时长计时
  - 连接质量检测

### Phase 8: 样式和响应式 (3h)

- [ ] Task 8.1: 实现全局样式主题 (1h)
  - CSS 变量定义
  - 活泼可爱配色
  - 全局组件样式覆盖

- [ ] Task 8.2: 实现各页面样式 (1h)
  - 列表页样式
  - 表单页样式
  - 通话页样式

- [ ] Task 8.3: 响应式适配 (1h)
  - 移动端适配
  - 平板适配
  - 断点测试

### Phase 9: 测试和优化 (4h)

- [ ] Task 9.1: 功能测试 (2h)
  - 创建流程测试
  - 编辑流程测试
  - 通话流程测试
  - 边界情况测试

- [ ] Task 9.2: 性能优化 (1h)
  - 图片懒加载
  - 组件懒加载
  - 防抖节流

- [ ] Task 9.3: 错误处理完善 (1h)
  - 网络错误处理
  - 用户友好的错误提示
  - 日志记录

**总计预估时间：40h**

## 7. 技术风险和应对

### 7.1 已识别的风险

| 风险 | 影响 | 应对方案 |
|------|------|----------|
| **Coze API 限流** | 列表加载失败 | 添加重试机制，显示友好错误提示 |
| **WebSocket 连接不稳定** | 通话中断 | 实现自动重连，显示连接状态 |
| **LocalStorage 容量限制** | 扩展配置存储失败 | 压缩存储数据，清理过期数据 |
| **音色情感支持检测不准确** | TTS 配置无效 | 添加降级方案，仅使用 voice_id |
| **移动端浏览器兼容性** | 某些功能不可用 | 添加特性检测，优雅降级 |
| **编辑时 API Prompt 与 Storage 不一致** | 用户困惑 | 明确说明逻辑，以 Storage 为准 |
| **头像上传后创建失败** | 孤立文件 | 不处理，文件会过期清理 |

### 7.2 依赖关系

**外部依赖：**
- Coze API 服务稳定性
- @coze/api SDK 版本兼容性
- Ant Design 组件库版本

**内部依赖：**
- 复用 `components/audio-config` 和 `components/event-input`
- 复用 `pages/chat/` 下的消息组件
- 依赖现有 `utils/config.ts` 的部分逻辑

## 8. 测试计划

### 8.1 单元测试

**测试工具：** Vitest

**测试覆盖：**
- [ ] Prompt 模板生成逻辑
- [ ] LocalStorage 工具函数
- [ ] 类型验证函数
- [ ] 数据格式化函数

**示例：**
```typescript
describe('generatePrompt', () => {
  it('should generate prompt with all options', () => {
    const options = {
      customPrompt: '你是一个会讲故事的机器人',
      replyStyle: '适中详细',
      values: ['善良', '真诚'],
      habits: ['好好吃饭', '爱阅读'],
      skills: ['今日诗词', '童话故事']
    };
    const result = generatePrompt(options);
    expect(result).toContain('你是一个面向2-8岁儿童的AI助手');
    expect(result).toContain('适中详细地回答');
    expect(result).toContain('善良、真诚');
    expect(result).toContain('今日诗词、童话故事');
  });
});
```

### 8.2 集成测试

**测试场景：**
- [ ] 登录 → 列表加载流程
- [ ] 创建智能体完整流程
- [ ] 编辑智能体完整流程
- [ ] 发布智能体流程
- [ ] 进入通话完整流程

**测试重点：**
- API 调用是否正确
- LocalStorage 读写是否正确
- 数据传递是否正确

### 8.3 E2E 测试（如需要）

**测试工具：** Playwright

**测试场景：**
- [ ] 用户首次访问登录流程
- [ ] 创建智能体并通话
- [ ] 编辑智能体配置
- [ ] 通话中高级配置调整

## 9. 性能优化策略

### 9.1 缓存策略

| 数据类型 | 缓存位置 | 缓存时长 | 更新策略 |
|---------|----------|----------|----------|
| 智能体列表 | 组件 state | 本次会话 | 手动刷新 |
| 音色列表 | 内存 | 30分钟 | 定期刷新 |
| 登录信息 | LocalStorage | 永久 | 手动清除 |
| 扩展配置 | LocalStorage | 永久 | 编辑时更新 |

### 9.2 懒加载

```typescript
// 路由懒加载
const BotManager = lazy(() => import('./pages/bot-manager'));
const BotCreate = lazy(() => import('./pages/bot-manager/create'));
const BotCall = lazy(() => import('./pages/bot-manager/call'));

// 组件懒加载
const VoiceSelector = lazy(() => import('./components/VoiceSelector'));
const PluginSelector = lazy(() => import('./components/PluginSelector'));
```

### 9.3 防抖节流

```typescript
// 搜索输入防抖
const debouncedSearch = useDebounceFn(
  (value: string) => {
    // 搜索逻辑
  },
  { wait: 300 }
);

// 滑块拖动节流
const throttledUpdate = useThrottleFn(
  (value: number) => {
    // 更新逻辑
  },
  { wait: 100 }
);
```

### 9.4 图片优化

```typescript
// 头像懒加载
<img src={bot.icon_url} loading="lazy" alt={bot.name} />

// 头像压缩（上传前）
const compressImage = async (file: File): Promise<File> => {
  // 压缩逻辑，限制最大 2MB
};
```

## 10. 安全考虑

### 10.1 输入验证

| 字段 | 验证规则 |
|------|----------|
| user_id | 非空，字符串 |
| PAT | 非空，字符串格式 |
| 智能体名称 | 1-20 字符 |
| 描述 | 0-500 字符 |
| 自定义 Prompt | 至少 10 字符 |
| 欢迎语 | 至少 5 字符 |
| 上传文件 | 图片格式，最大 2MB |

### 10.2 XSS 防护

```typescript
// 使用 DOMPurify 清理用户输入
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};
```

### 10.3 数据隔离

```typescript
// LocalStorage key 命名空间隔离
const STORAGE_KEYS = {
  AUTH: 'bot-manager_auth',
  EXT: 'bot-manager_ext',
  TTS: 'bot-manager_tts',
} as const;

// 避免与其他模块冲突
```

### 10.4 Token 安全

```typescript
// PAT 不在 URL 中传递
// 仅在请求头中传递
headers: {
  'Authorization': `Bearer ${pat}`,
}

// 敏感操作二次确认
const handlePublish = async (botId: string) => {
  Modal.confirm({
    title: '确认发布？',
    content: '发布后智能体将公开可见',
    onOk: async () => {
      await publishBot(botId);
    },
  });
};
```

---

## 附录

### A. 常量定义

```typescript
// utils/constants.ts

// 工作空间 ID
export const SPACE_ID = '7556632877497565234';

// 回复风格选项
export const REPLY_STYLE_OPTIONS = [
  { label: '简洁明了', value: '简洁明了' },
  { label: '适中详细', value: '适中详细' },
  { label: '丰富详尽', value: '丰富详尽' },
] as const;

// 价值观选项
export const VALUES_OPTIONS = [
  { label: '正直', value: '正直' },
  { label: '善良', value: '善良' },
  { label: '勇敢', value: '勇敢' },
  { label: '真诚', value: '真诚' },
] as const;

// 习惯选项
export const HABITS_OPTIONS = [
  { label: '好好吃饭', value: '好好吃饭' },
  { label: '少玩手机', value: '少玩手机' },
  { label: '勤于思考', value: '勤于思考' },
  { label: '不挑食', value: '不挑食' },
  { label: '讲文明', value: '讲文明' },
  { label: '乐于助人', value: '乐于助人' },
  { label: '好好睡觉', value: '好好睡觉' },
  { label: '懂礼貌', value: '懂礼貌' },
  { label: '爱阅读', value: '爱阅读' },
  { label: '讲卫生', value: '讲卫生' },
  { label: '乐于学习', value: '乐于学习' },
] as const;

// 默认插件（预设数据）
export const DEFAULT_PLUGINS = [
  { id: '7548028105068183561', name: '今日诗词' },
  { id: '7495098187846385704', name: '童话故事合集' },
  { id: '7477951904853639209', name: '百度天气插件' },
] as const;

// 音色配置范围
export const VOICE_PITCH_RANGE = { min: 0.5, max: 2.0, step: 0.1 };
export const VOICE_SPEED_RANGE = { min: 0.5, max: 2.0, step: 0.1 };
```

### B. Prompt 模板

```typescript
// utils/prompt-template.ts

export const PROMPT_TEMPLATE = `
{{customPrompt}}

你是一个面向2-8岁儿童的AI助手。

【回复风格】
{{replyStyle}}

【核心价值观】
{{values}}

【习惯培养】
{{habits}}

【技能能力】
你拥有以下技能：{{skills}}

【重要约束】
- 你的回复要轻松有趣，符合儿童心智
- 严禁讨论不适合未成年人的话题（包括暴力、色情、消极等内容）
- 如遇到敏感话题，请温和引导至其他适合的内容
- 使用简单易懂的语言，避免复杂词汇和长句
- 多使用鼓励和积极正面的语言
- 可以适当使用emoji表情增加趣味性
`;

export const generatePrompt = (options: PromptTemplateOptions): string => {
  const replyStyleText = {
    '简洁明了': '用简短的句子回答，避免冗长。',
    '适中详细': '适度详细地回答，保持趣味性。',
    '丰富详尽': '详细生动地回答，多用比喻和描述。',
  }[options.replyStyle];

  return PROMPT_TEMPLATE
    .replace('{{customPrompt}}', options.customPrompt.trim())
    .replace('{{replyStyle}}', replyStyleText)
    .replace('{{values}}', options.values.join('、') || '善良、真诚')
    .replace('{{habits}}', options.habits.join('、'))
    .replace('{{skills}}', options.skills.join('、'))
    .trim();
};
```

### C. 样式变量

```css
/* globals.css */

:root {
  /* 主色调 - 温暖活泼 */
  --bot-color-primary: #FF6B6B;
  --bot-color-primary-light: #FF8E8E;
  --bot-color-primary-dark: #E85555;

  /* 次要色调 */
  --bot-color-secondary: #4ECDC4;
  --bot-color-accent: #FFE66D;

  /* 背景色 */
  --bot-color-bg: #FFF9F0;
  --bot-color-card-bg: #FFFFFF;
  --bot-color-section-bg: #FFF5E6;

  /* 文字颜色 */
  --bot-color-text-primary: #2D3436;
  --bot-color-text-secondary: #636E72;
  --bot-color-text-light: #B2BEC3;

  /* 圆角 */
  --bot-radius-sm: 8px;
  --bot-radius-md: 16px;
  --bot-radius-lg: 24px;
  --bot-radius-full: 9999px;

  /* 阴影 */
  --bot-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --bot-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --bot-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.16);

  /* 过渡 */
  --bot-transition-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

**文档版本：** v1
**创建日期：** 2025-01-10
**最后更新：** 2025-01-10
