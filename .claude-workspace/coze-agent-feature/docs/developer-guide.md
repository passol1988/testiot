# 生活物联网智能体管理平台 - 开发者文档

## 目录

1. [项目结构](#项目结构)
2. [技术栈](#技术栈)
3. [组件 API 文档](#组件-api-文档)
4. [Hooks API 文档](#hooks-api-文档)
5. [工具函数](#工具函数)
6. [类型定义](#类型定义)
7. [如何扩展功能](#如何扩展功能)
8. [故障排查指南](#故障排查指南)

---

## 项目结构

```
src/pages/bot-manager/
├── call/                          # 通话页面
│   ├── index.tsx                  # 通话页面主组件
│   ├── call.css                   # 通话页面样式
│   └── components/                # 通话子组件
│       ├── CallHeader.tsx         # 通话头部
│       ├── ChatMessageList.tsx    # 聊天消息列表
│       └── ChatMessage.tsx        # 聊天消息气泡
│
├── components/                    # 通用组件
│   ├── AvatarUpload.tsx           # 头像上传组件
│   ├── BotCard.tsx                # 智能体卡片
│   ├── BotForm.tsx                # 创建/编辑表单
│   ├── BotList.tsx                # 智能体列表
│   ├── KnowledgeFab.tsx           # 知识库悬浮按钮
│   ├── LoginModal.tsx             # 登录弹窗
│   ├── PageHeader.tsx             # 页面头部
│   ├── PluginSelector.tsx         # 插件选择器
│   ├── PromptPreview.tsx          # Prompt 预览抽屉
│   ├── VoiceSelector.tsx          # 音色选择器
│   └── index.ts                   # 组件导出
│
├── hooks/                         # 自定义 Hooks
│   ├── index.ts                   # Hooks 导出
│   └── use-bot-api.ts             # Bot API Hook
│
├── utils/                         # 工具函数
│   ├── constants.ts               # 常量定义
│   ├── index.ts                   # 工具函数导出
│   ├── prompt-template.ts         # Prompt 模板生成
│   └── storage.ts                 # LocalStorage 工具
│
├── types.ts                       # TypeScript 类型定义
├── index.tsx                      # BotManager 主组件
├── styles.css                     # 页面样式
└── styles.ts                      # 样式常量
```

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3 | 前端框架 |
| TypeScript | latest | 类型检查 |
| Ant Design | 5.21 | UI 组件库 |
| React Router DOM | 6.28 | 路由管理 |
| @coze/api | latest | Coze SDK |
| Vite | 4.2 | 构建工具 |

---

## 组件 API 文档

### LoginModal

登录弹窗组件

```typescript
interface LoginModalProps {
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}
```

**使用示例**:
```tsx
<LoginModal
  visible={loginModalVisible}
  onSubmit={handleLogin}
  onCancel={handleLogout}
/>
```

---

### BotCard

智能体卡片组件

```typescript
interface BotCardProps {
  bot: BotInfo;
  onEdit: (botId: string) => void;
  onCall: (botId: string) => void;
  onPublish: (botId: string) => void;
}

interface BotInfo {
  bot_id: string;
  name: string;
  description: string;
  icon_url: string;
  is_published: boolean;
  create_time: number;
  update_time: number;
}
```

---

### BotForm

创建/编辑表单组件

```typescript
interface BotFormProps {
  mode: 'create' | 'edit';
  botId?: string;
  onSubmit: (data: BotFormData) => Promise<void>;
  onCancel: () => void;
  uploadFile?: (file: File) => Promise<string | null>;
  fetchPlugins?: () => Promise<PluginInfo[]>;
  fetchBotDetail?: (botId: string) => Promise<BotDetail>;
}

interface BotFormData {
  name: string;
  description: string;
  icon_file_id?: string;
  prompt_info: { prompt: string };
  onboarding_info: {
    prologue: string;
    suggested_questions: string[];
  };
  plugin_id_list?: {
    id_list: Array<{ plugin_id: string; api_id?: string }>;
  };
  replyStyle: '简洁明了' | '适中详细' | '丰富详尽';
  values: string[];
  habits: string[];
  customPrompt: string;
  voiceId?: string;
  voiceSpeed: number;
}
```

---

### AvatarUpload

头像上传组件

```typescript
interface AvatarUploadProps {
  value?: string;          // 文件 ID
  initialUrl?: string;     // 原始 URL（编辑时显示）
  onChange?: (fileId: string) => void;
  uploadFile?: (file: File) => Promise<string | null>;
}
```

---

### PluginSelector

插件选择器组件

```typescript
interface PluginSelectorProps {
  value: string[];
  onChange: (pluginIds: string[]) => void;
  options: PluginInfo[];
}

interface PluginInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  apiList?: Array<{
    apiId: string;
    name: string;
    description: string;
  }>;
}
```

---

### VoiceSelector

音色选择器组件

```typescript
interface VoiceSelectorProps {
  voiceId?: string;
  speed: number;
  onVoiceChange: (voiceId?: string) => void;
  onSpeedChange: (speed: number) => void;
  supportEmotion: boolean;
}
```

**特性**:
- 分页加载音色列表（每页 50 个）
- 滚动加载更多
- 支持搜索音色名称
- 语速调节（0.5x - 2.0x）

---

### PromptPreview

Prompt 预览抽屉组件

```typescript
interface PromptPreviewProps {
  visible: boolean;
  onClose: () => void;
  prompt: string;
}
```

---

## Hooks API 文档

### useBotApi

智能体 API Hook

```typescript
const useBotApi = () => {
  return {
    loading: boolean;
    botList: BotInfo[];
    fetchBotList: () => Promise<void>;
    fetchBotDetail: (botId: string) => Promise<BotDetail>;
    createBot: (data: BotFormData) => Promise<string | null>;
    updateBot: (data: BotFormData & { bot_id: string }) => Promise<boolean>;
    publishBot: (botId: string) => Promise<boolean>;
    uploadFile: (file: File) => Promise<string | null>;
    fetchVoices: () => Promise<VoiceInfo[]>;
    fetchPlugins: () => Promise<PluginInfo[]>;
  };
};
```

**使用示例**:
```tsx
const { loading, botList, fetchBotList, createBot } = useBotApi();

useEffect(() => {
  fetchBotList();
}, []);
```

---

## 工具函数

### storage.ts

LocalStorage 工具函数

```typescript
// 获取登录信息
getAuth(): AuthStorage | null

// 保存登录信息
setAuth(auth: AuthStorage): void

// 清除登录信息
clearAuth(): void

// 检查是否已登录
isLoggedIn(): boolean

// 获取智能体扩展配置
getBotExtConfig(botId: string): BotExtConfig | null

// 保存智能体扩展配置
setBotExtConfig(botId: string, config: BotExtConfig): void

// 获取所有智能体扩展配置
getAllBotExtConfig(): Record<string, BotExtConfig>
```

---

### prompt-template.ts

Prompt 模板生成函数

```typescript
interface PromptTemplate {
  customPrompt: string;
  replyStyle: '简洁明了' | '适中详细' | '丰富详尽';
  values: string[];
  habits: string[];
  skills: string[];
}

// 生成 Prompt
generatePrompt(template: PromptTemplate): string

// 检查 Prompt 是否过长
isPromptTooLong(prompt: string): boolean
```

---

### constants.ts

常量定义

```typescript
// 回复风格选项
REPLY_STYLE_OPTIONS: string[]

// 价值观选项
VALUES_OPTIONS: string[]

// 习惯选项
HABITS_OPTIONS: string[]

// 默认插件列表
DEFAULT_PLUGINS: PluginInfo[]

// 默认开场白
DEFAULT_PROLOGUE: string

// 默认建议问题
DEFAULT_SUGGESTED_QUESTIONS: string[]

// Prompt 限制
PROMPT_LIMITS: {
  WARNING: number;  // 9000
  MAX: number;      // 10000
}
```

---

## 类型定义

### 主要类型

```typescript
// 登录信息
interface AuthStorage {
  user_id: string;
  pat: string;
}

// 智能体扩展配置
interface BotExtConfig {
  replyStyle: BotFormData['replyStyle'];
  values: string[];
  habits: string[];
  customPrompt: string;
  voiceId?: string;
  voiceSpeed: number;
}

// 智能体详情
interface BotDetail {
  bot_id: string;
  name: string;
  description: string;
  icon_url: string;
  icon_file_id?: string;
  prompt_info: { prompt: string };
  onboarding_info: {
    prologue: string;
    suggested_questions: string[];
  };
  plugin_info_list?: PluginInfo[];
}
```

---

## 如何扩展功能

### 添加新的插件

1. 在 `constants.ts` 中添加插件定义：

```typescript
export const DEFAULT_PLUGINS = [
  // ... 现有插件
  {
    id: 'your_plugin_id',
    name: '你的插件名称',
    api_id: 'your_api_id',
    description: '插件描述',
    icon: '图标 URL',
  },
];
```

### 添加新的价值观选项

在 `constants.ts` 中添加：

```typescript
export const VALUES_OPTIONS = [
  // ... 现有选项
  '新价值观',
];
```

### 添加新的习惯选项

在 `constants.ts` 中添加：

```typescript
export const HABITS_OPTIONS = [
  // ... 现有选项
  '新习惯',
];
```

### 自定义 Prompt 模板

修改 `prompt-template.ts` 中的 `generatePrompt` 函数：

```typescript
export const generatePrompt = (params: PromptTemplate): string => {
  const { customPrompt, replyStyle, values, habits, skills } = params;

  return `
【角色定位】
${customPrompt}

【你的特点】
- ...
  `.trim();
};
```

### 添加新页面

1. 创建页面组件文件
2. 在 `index.tsx` 中添加路由

```tsx
<Routes>
  {/* 现有路由 */}
  <Route path="/your-page" element={<YourPage />} />
</Routes>
```

---

## 故障排查指南

### 问题: TypeScript 类型错误

**解决方法**:
1. 检查 `types.ts` 中是否定义了相关类型
2. 确保导入路径正确
3. 运行 `npm run build` 查看详细错误

### 问题: API 调用失败

**可能原因**:
- PAT 无效或过期
- 网络连接问题
- API 参数错误

**排查步骤**:
1. 检查 PAT 是否正确设置
2. 打开浏览器控制台查看错误信息
3. 使用 Network 面板查看请求详情

### 问题: 音色列表加载失败

**可能原因**:
- API 限制
- 网络问题

**解决方法**:
- VoiceSelector 已实现分页加载和错误处理
- 失败时显示空状态，不影响其他功能

### 问题: 本地存储数据丢失

**可能原因**:
- 浏览器清除了 LocalStorage
- 使用了无痕模式

**解决方法**:
- 重新登录和配置
- 扩展配置（音色、Prompt）需要重新保存

### 问题: 通话无法连接

**排查步骤**:
1. 检查 bot_id 是否正确
2. 检查 WebSocket URL 是否正确
3. 检查浏览器是否支持 WebSocket
4. 查看控制台错误信息

### 问题: 样式显示异常

**排查步骤**:
1. 检查 CSS 文件是否正确导入
2. 检查 className 是否正确
3. 清除浏览器缓存

---

## 开发建议

### 性能优化

1. **使用 useMemo 缓存计算结果**
```typescript
const currentPrompt = useMemo(() =>
  generatePrompt({ customPrompt, replyStyle, values, habits, skills }),
  [customPrompt, replyStyle, values, habits, skills]
);
```

2. **使用 useCallback 缓存事件处理函数**
```typescript
const handleClick = useCallback(() => {
  // 处理逻辑
}, [依赖项]);
```

### 代码风格

1. 组件使用函数式组件 + Hooks
2. 使用 TypeScript 类型注解
3. 组件 Props 使用 interface 定义
4. 导出使用命名导出，方便 tree-shaking

### 调试技巧

1. 使用 React Developer Tools 查看组件状态
2. 使用 console.log 调试（生产环境记得移除）
3. 使用 Network 面板查看 API 请求
4. 使用 Application 面板查看 LocalStorage

---

## 参考资料

- [Coze API 文档](https://www.coze.cn/docs/developer_guides/api_reference)
- [React 官方文档](https://react.dev/)
- [Ant Design 组件库](https://ant.design/components/)
- [React Router 文档](https://reactrouter.com/)
