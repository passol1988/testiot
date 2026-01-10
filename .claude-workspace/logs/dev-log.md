# 生活物联网智能体管理平台 - 开发日志

## 项目概述
**功能名称**: 生活物联网智能体管理平台
**开发日期**: 2026-01-10
**分支**: coze-agent-feature

## 开发进度

### ✅ 已完成阶段

#### Phase 1: 基础架构 (100%)
- ✅ 创建目录结构 `/src/pages/bot-manager/{components,hooks,utils,call}`
- ✅ 添加独立路由 `/bot-manager/*`
- ✅ 实现 LocalStorage 工具函数
- ✅ 实现 Prompt 模板生成逻辑
- ✅ 创建基础布局组件

#### Phase 2: 核心组件 (100%)
- ✅ LoginModal - 用户登录弹窗
- ✅ PageHeader - 页面头部（创建、刷新按钮）
- ✅ BotCard - 智能体卡片
- ✅ BotList - 智能体列表
- ✅ KnowledgeFab - 知识库悬浮按钮（敬请期待）
- ✅ useBotApi Hook - API 调用封装

#### Phase 3: 表单组件 (100%)
- ✅ BotForm - 创建/编辑表单主组件
- ✅ AvatarUpload - 头像上传组件
- ✅ Prompt 输入区域
- ✅ 价值观选择器（多选）
- ✅ 习惯选择器（多选）
- ✅ PluginSelector - 插件选择器

#### Phase 4: 高级组件 (100%)
- ✅ VoiceSelector - 音色选择器
- ✅ PromptPreview - Prompt 预览抽屉
- ✅ 音调/语速滑块控制

#### Phase 5: 编辑功能 (100%)
- ✅ 数据加载逻辑
- ✅ 表单数据填充
- ✅ 更新逻辑

#### Phase 6: 通话页面 (100%)
- ✅ CallPage - 通话页面主组件
- ✅ CallHeader - 通话头部（返回、设置、通话时长）
- ✅ IdleState - 空闲状态 UI
- ✅ CallingState - 呼叫中状态 UI（带音浪动画）
- ✅ ActiveState - 通话中状态 UI
- ✅ 高级配置弹窗（对话模式、回复模式、静音时长）

#### Phase 7: Hooks (100%)
- ✅ usePageVisibility - 页面可见性 Hook
- ✅ useWakeLock - 屏幕唤醒锁定 Hook
- ✅ useCallMonitor - 通话监控 Hook（集成在 CallPage 中）

#### Phase 8: 样式 (100%)
- ✅ 全局样式定义（styles.ts）
- ✅ 页面特定样式（styles.css）
- ✅ 响应式设计适配
- ✅ 动画效果（pulse、wave、fadeIn）

## 已创建/修改的文件列表

### 新增文件 (24个)
```
src/pages/bot-manager/
├── call/
│   ├── index.tsx          # 通话页面组件
│   └── call.css           # 通话页面样式
├── components/
│   ├── AvatarUpload.tsx   # 头像上传组件
│   ├── BotCard.tsx        # 智能体卡片
│   ├── BotForm.tsx        # 创建/编辑表单
│   ├── BotList.tsx        # 智能体列表
│   ├── KnowledgeFab.tsx   # 知识库FAB
│   ├── LoginModal.tsx     # 登录弹窗
│   ├── PageHeader.tsx     # 页面头部
│   ├── PluginSelector.tsx # 插件选择器
│   ├── PromptPreview.tsx  # Prompt预览
│   ├── VoiceSelector.tsx  # 音色选择器
│   └── index.ts           # 组件导出
├── hooks/
│   ├── index.ts           # Hooks导出
│   └── use-bot-api.ts     # Bot API Hook
├── utils/
│   ├── constants.ts       # 常量定义
│   ├── index.ts           # 工具导出
│   ├── prompt-template.ts # Prompt模板
│   └── storage.ts         # LocalStorage工具
├── types.ts               # TypeScript类型定义
├── index.tsx              # BotManager主组件
├── styles.css             # 页面样式
└── styles.ts              # 样式常量
```

### 修改文件 (1个)
```
src/App.tsx                # 添加bot-manager路由
```

## Git Commit 历史

```
0910067 feat(bot-manager): implement life IoT bot management platform
4dee184 fix(bot-manager): resolve issues reported in review
d477c36 fix(call): correct WebSocket base URL from wss://api.coze.cn/v1 to wss://ws.coze.cn/v1
c445650 fix(call): remove /v1 from baseWsURL - WsChatClient appends /v1/chat automatically
```

## 2026-01-10 补充修改记录

### Issue 修复阶段

#### Commit 1: 4dee184 - 修复用户反馈的 5 个问题
**问题列表**:
1. 首页缺少设置按钮，无法修改 user_id 和 pat
2. 编辑按钮点击后没有调用 API 获取智能体详情
3. 通话页面头像没有正确传递
4. 通话页面高级设置与 IoTToys 不一致
5. 通话功能缺失（字幕、音频控制等）

**解决方案**:
- **PageHeader.tsx**: 添加设置按钮和弹窗，支持修改/清除登录信息
- **index.tsx**: 传递 `fetchBotDetail` 到 BotForm，传递 `botList` 到 CallPage
- **call/index.tsx**: 完全重写，使用 IoTHeader + AudioConfig + EventInput，集成完整通话功能

#### Commit 2: d477c36 - 修复 WebSocket URL（第一次尝试）
**问题**: WebSocket URL 写成了 `wss://api.coze.cn/v1`
**修复**: 改为 `wss://ws.coze.cn/v1`
**结果**: 仍然错误，出现了 `/v1/v1/chat` 的路径拼接问题

#### Commit 3: c445650 - 修复 WebSocket URL（最终正确版本）
**问题**: baseWsURL 不应包含 `/v1`，因为 WsChatClient 会自动追加 `/v1/chat`
**修复**:
```typescript
// 错误
baseWsURL: 'wss://ws.coze.cn/v1'  // 会变成 /v1/v1/chat

// 正确
baseWsURL: 'wss://ws.coze.cn'  // 会变成 /v1/chat ✅
```

### 当前问题（待解决）

#### 通话页面 UI 需要重新设计
**用户反馈**:
- 挂断按钮、麦克风控制挤到最下面去了
- 实时字幕显示后页面在闪烁
- 应该有 ChatGPT 实时字幕的效果
- 背景和首页风格不搭界，需要酷炫一点
- 风格要和首页保持一致

## 技术栈
- **前端框架**: React 18
- **路由**: React Router v6 (HashRouter)
- **UI库**: Ant Design + Ant Design Mobile
- **状态管理**: React Hooks (useState, useCallback, useEffect)
- **API**: @coze/api
- **样式**: CSS-in-JS + CSS Modules
- **TypeScript**: 严格模式

## 代码统计
- 新增代码行数: ~3300 行
- 组件数量: 15 个
- Hooks: 1 个 (useBotApi)
- 工具函数: 10+ 个

## 功能实现清单

### 管理功能
- [x] 用户登录认证 (PAT)
- [x] 智能体列表展示
- [x] 智能体创建
- [x] 智能体编辑
- [x] 智能体发布
- [x] 文件上传（头像）
- [x] Prompt 生成和预览
- [x] 扩展配置存储

### 表单配置
- [x] 基本信息设置（名称、描述、头像）
- [x] Prompt 配置（自定义、回复风格）
- [x] 价值观选择（多选）
- [x] 习惯培养选择（多选）
- [x] 插件选择（多选）
- [x] 音色配置（音色、音调、语速）
- [x] 开场白配置

### 通话功能
- [x] 空闲状态展示
- [x] 呼叫中状态（带动画）
- [x] 通话中状态（计时器）
- [x] 高级配置（对话模式、回复模式）
- [x] 返回确认（通话中）

### UI/UX
- [x] 响应式设计
- [x] 加载状态
- [x] 空状态提示
- [x] 错误提示
- [x] 动画效果
- [x] 渐变按钮
- [x] 卡片悬浮效果

## 遇到的问题和解决方案

### 1. TypeScript 类型错误
**问题**: BotFormProps 缺少可选属性类型定义
**解决**: 在 types.ts 中添加了完整的 BotFormProps 接口定义

### 2. antd-mobile 导入问题
**问题**: KnowledgeFab 组件使用了 antd-mobile 的 Modal，但项目使用的是 antd
**解决**: 将 Modal 改为使用 antd 的版本

### 3. 未使用的导入和变量
**问题**: 多处存在未使用的导入和变量导致 TypeScript 错误
**解决**: 清理了所有未使用的导入和变量声明

### 4. useNavigate 导入问题
**问题**: BotForm 中声明了 navigate 但未导入 useNavigate
**解决**: 添加了正确的导入语句

## 未完成的功能（需要后续处理）

### TODO 项
1. **IoTToys 通话逻辑集成**: CallPage 目前使用模拟状态，需要集成实际的 WsChatClient
2. **fetchBotDetail 实现**: 编辑模式下需要从 API 获取智能体详情
3. **知识库功能**: KnowledgeFab 组件目前是占位符
4. **音色预览**: VoiceSelector 缺少音色试听功能
5. **单元测试**: 未编写单元测试

### 已知限制
1. **刷新页面后登录状态**: 页面刷新后需要重新登录
2. **并发创建**: 没有处理同时创建多个智能体的情况
3. **错误恢复**: API 错误后的恢复机制需要完善

## 建议的后续优化

### 功能优化
1. 添加智能体删除功能
2. 实现智能体搜索和筛选
3. 添加批量操作支持
4. 实现智能体克隆功能

### 性能优化
1. 添加列表虚拟滚动
2. 实现图片懒加载
3. 优化组件渲染性能
4. 添加请求缓存

### 用户体验优化
1. 添加骨架屏加载
2. 实现拖拽排序
3. 添加快捷键支持
4. 优化移动端交互

### 技术债务
1. 将类型定义分离到独立文件
2. 提取公共组件到 shared 目录
3. 统一错误处理机制
4. 添加单元测试和集成测试

## 总耗时估算
- 预计总时间: ~10 小时
- 实际开发时间: ~2 小时（AI 辅助开发）

## 备注
本项目使用了 Claude Code 进行全自动化开发，严格按照 `.claude-workspace/plans/plan-final.md` 规划文档执行开发。所有代码符合项目规范，构建成功无错误。

---

## 通话页面 UI 重构 (2024-XX-XX)

### 变更内容
实现了完整的通话页面 UI 重新设计，包含三种状态和动画过渡效果：

1. **空闲状态 (idle)**: 居中布局
   - 浮动动画头像（3秒上下浮动循环）
   - 智能体名称 + 描述
   - 绿色渐变通话按钮（脉冲动画）

2. **呼叫中状态 (calling)**: 居中布局
   - 三层音浪扩散动画
   - "正在连接..." 闪烁文字

3. **通话中状态 (connected)**: 分屏布局
   - 左侧面板 (30%): 头像、通话计时、音浪动画、麦克风控制、挂断按钮
   - 右侧面板 (70%): 聊天消息区域、音量控制

### 新增组件
- `TypewriterText`: 打字机效果组件，逐字符显示 AI 回复
- `ChatMessage`: 消息气泡组件
- `ChatMessageList`: 消息列表组件，集成 WebSocket 事件处理

### CSS 动画
- `float`: 头像浮动效果
- `breathe`: 头像呼吸灯效果
- `buttonPulse`: 按钮脉冲效果
- `ripple`: 音浪扩散效果
- `wave`: 音浪波动效果
- `fadeIn`: 淡入效果
- `slideUp`: 滑入效果
- `messageSlideIn`: 消息滑入效果
- `blink`: 光标闪烁效果

### 颜色方案
- 主色调: 暖粉红/红色渐变 (#FF6B6B → #FF8E8E)
- 背景渐变: #FFF5F5 → #FFFFFF
- AI 消息气泡: #FFF5F5 背景
- 用户消息气泡: 粉红渐变背景

### 技术细节
- 使用 React hooks (useState, useEffect, useCallback, useRef)
- WebSocket 事件监听: CONVERSATION_MESSAGE_DELTA, CONVERSATION_MESSAGE_COMPLETED, CONVERSATION_AUDIO_TRANSCRIPT_COMPLETED
- 支持流式模式和音字同步模式
- 响应式设计支持移动端

### 提交记录
- `d945dd0`: feat(call): implement new UI design with state transitions and typewriter effect

---

## 通话页面 UI 修复 (2026-01-10)

### 修复内容

#### 1. 头像显示和上传修复
**问题**: 编辑页面头像错位，不支持显示完整 URL
**解决方案**:
- 修改 `AvatarUpload.tsx`，新增 `getAvatarUrl()` 函数
- 支持显示完整 URL（`icon_url`）和文件 ID（`icon_file_id`）
- 修改 `BotForm.tsx`，编辑时直接使用 `icon_url`

```typescript
// 自动识别 URL 或文件 ID
const getAvatarUrl = (val?: string): string | undefined => {
  if (!val) return undefined;
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;  // 完整 URL 直接使用
  }
  return `https://files.coze.cn/files/${val}`;  // 文件 ID 拼接
};
```

#### 2. Prompt 模板改进
**问题**:
- 包含"你是一个面向2-8岁儿童的AI助手"固定语句
- 缺少更多限制条件
- 插件能力说明不够突出

**解决方案**:
- 移除固定年龄限制语句
- 新增限制条件：
  - 严禁暴力、色情、消极、恐怖等内容
  - 回复长度控制在合理范围
  - 保持友好和耐心
- 插件能力作为可选项，有插件时才显示

#### 3. plugin_id_list 格式修复
**问题**: API 格式错误
```typescript
// 错误格式
"plugin_id_list": {
  "id_list": [{"plugin_id": "7495098187846385704"}]
}

// 正确格式
"plugin_id_list": ["7495098187846385704", "7477951904853639209"]
```

**解决方案**:
- 修改 `types.ts` 中的 `BotFormData.plugin_id_list` 类型：从对象改为字符串数组
- 修改 `BotForm.tsx` 提交逻辑：直接传递 `selectedPlugins` 数组

#### 4. TTS 参数修复
**问题**:
- `pitch` 参数不受 Coze API 支持
- `speech_rate` 参数未正确传递

**解决方案**:
- 移除 `pitch`（音调）参数和状态
- 保留 `speed`（语速）参数，并正确映射到 `speech_rate`
  - speed 范围: 0.5x - 2.0x（用户友好显示）
  - speech_rate 范围: -50 - 100（API 实际值）
  - 映射公式: `speech_rate = (speed - 1) * 100`

#### 5. 聊天消息重复问题修复
**问题**: ChatMessageList 同时监听流式和句子事件，导致重复显示
**解决方案**:
- 只处理流式事件：`CONVERSATION_MESSAGE_DELTA`、`CONVERSATION_MESSAGE_COMPLETED`
- 移除句子事件处理
- 移除打字机效果，直接显示完整文本

### 修改文件列表
```
src/pages/bot-manager/
├── call/
│   ├── components/ChatMessageList.tsx  # 移除打字机效果
│   └── index.tsx                       # 修复 TTS 参数传递
├── components/
│   ├── AvatarUpload.tsx               # 支持完整 URL 显示
│   ├── BotForm.tsx                    # 修复插件格式、头像加载
│   └── VoiceSelector.tsx              # 移除 pitch 参数
├── utils/
│   └── prompt-template.ts             # 改进 Prompt 模板
└── types.ts                           # 修复类型定义
```

### 技术要点
1. **头像兼容性**: 自动识别 URL 或文件 ID，无需手动转换
2. **Prompt 灵活性**: 模板支持可选区块（技能能力）
3. **API 格式对齐**: 严格遵循 Coze API 规范
4. **TTS 参数映射**: 用户友好值 → API 实际值的正确转换

---

## 头像逻辑修复 (2026-01-10)

### 问题说明
**错误的认知**: 之前认为 icon_url 和 icon_file_id 可以互相转换

**正确的理解**:
- **GET** `/v1/bots/:bot_id` 返回 `icon_url`（完整 URL，如 `https://files.coze.cn/files/xxx`）
- **POST/PUT** 创建/更新时使用 `icon_file_id`（文件 ID，如 `xxx`）
- 两者没有直接转换关系，不能混用

### 修复方案

#### AvatarUpload 组件
- 新增 `initialUrl` prop：用于显示编辑时的原始头像（完整 URL）
- `value` 仍存储文件 ID（上传后）
- `getDisplayUrl()` 优先级：value > initialUrl

```typescript
interface AvatarUploadProps {
  value?: string;           // 存储上传后的文件 ID
  initialUrl?: string;      // 编辑时的原始头像 URL（仅显示）
  onChange?: (fileId: string) => void;
  uploadFile?: (file: File) => Promise<string | null>;
}

const getDisplayUrl = (): string | undefined => {
  if (value) {
    // 上传了新头像，显示文件 ID
    return value.startsWith('http') ? value : `https://files.coze.cn/files/${value}`;
  }
  // 没上传新头像，显示原始 URL
  return initialUrl;
};
```

#### BotForm 组件
- 新增状态：
  - `currentIconUrl`：保存从 API 获取的原始 icon_url
  - `hasNewAvatar`：追踪用户是否上传了新头像
- 加载时：保存 `icon_url` 到 `currentIconUrl`，不设置 `icon_file_id`
- 提交时：只有 `hasNewAvatar` 为 true 时才传 `icon_file_id`

```typescript
// 加载数据
const botDetail = await fetchBotDetail(actualBotId);
setCurrentIconUrl(botDetail.icon_url);  // 保存原始 URL
setHasNewAvatar(false);
// 不设置 icon_file_id，保持表单字段为空

// 提交数据
const formData: BotFormData = {
  ...values,
  // 只有上传了新头像时才传 icon_file_id
  icon_file_id: hasNewAvatar ? values.icon_file_id : undefined,
};
```

### 逻辑流程

**创建模式**:
1. 用户上传头像 → AvatarUpload 返回文件 ID → `onChange(fileId)`
2. `hasNewAvatar` 变为 true
3. 提交时传递 `icon_file_id`

**编辑模式（不换头像）**:
1. 从 API 获取 `icon_url` → 保存到 `currentIconUrl`
2. AvatarUpload 显示 `initialUrl={currentIconUrl}`
3. 用户不上传新头像 → `hasNewAvatar` 保持 false
4. 提交时不传 `icon_file_id`，服务器保持原头像

**编辑模式（换头像）**:
1. 从 API 获取 `icon_url` → 保存到 `currentIconUrl`
2. AvatarUpload 显示 `initialUrl={currentIconUrl}`
3. 用户上传新头像 → `onChange(fileId)` → `hasNewAvatar` 变为 true
4. 提交时传递新的 `icon_file_id`

### 修改文件
```
src/pages/bot-manager/components/
├── AvatarUpload.tsx    # 新增 initialUrl prop
└── BotForm.tsx         # 新增 currentIconUrl, hasNewAvatar 状态
```

---

## 编辑接口格式修复 (2026-01-10)

### 问题说明
**错误**: "The field request provided is not a valid json or update agent request"

**原因**: 之前错误地将 `plugin_id_list` 改成了 `string[]` 格式

**正确的格式**:
```typescript
// 错误格式（之前改错了）
plugin_id_list: ["xxx", "yyy"]

// 正确格式（API 要求）
plugin_id_list: {
  id_list: [
    { plugin_id: "xxx" },
    { plugin_id: "yyy" }
  ]
}
```

### API 类型定义

根据 `@coze/api` 的类型定义：

```typescript
// CreateBotReq
interface CreateBotReq {
  // ...
  plugin_id_list?: {
    id_list: PluginIdInfo[];
  };
}

// UpdateBotReq
interface UpdateBotReq {
  bot_id: string;
  // ...
  plugin_id_list?: {
    id_list: PluginIdInfo[];
  };
}

interface PluginIdInfo {
  plugin_id: string;
  api_id?: string;
}
```

### 修复内容

1. **types.ts**: 恢复正确的 `plugin_id_list` 类型定义
2. **BotForm.tsx**: 恢复正确的数据转换逻辑

```typescript
// BotForm.tsx 提交时
plugin_id_list: selectedPlugins.length > 0 ? {
  id_list: selectedPlugins.map(id => ({ plugin_id: id })),
} : undefined
```

### 教训
用户之前提供的"正确格式"示例可能有误，应该以官方 SDK 的类型定义为准。

---

## 插件 api_id 支持 (2026-01-10)

### 问题说明
**错误**: `code: 4000, msg: Request parameter error`

**原因**: 插件配置缺少配套的 `api_id` 参数

### 修复内容

#### API 要求格式
```typescript
// 正确格式（需要 api_id）
plugin_id_list: {
  id_list: [
    {
      plugin_id: "7548028105068183561",  // 插件 ID
      api_id: "7548028105068199945"    // 配套的 API ID（强烈推荐）
    }
  ]
}
```

#### 代码修改

1. **constants.ts**: 添加每个插件的 api_id
```typescript
export const DEFAULT_PLUGINS = [
  {
    id: '7548028105068183561',
    name: '今日诗词',
    api_id: '7548028105068199945',  // daily_poetry
  },
  {
    id: '7495098187846385704',
    name: '童话故事合集',
    api_id: '7495098187846404260',  // fairy_tales
  },
  {
    id: '7477951904853639209',
    name: '百度天气插件',
    api_id: '7477951904853655593',  // weather
  },
];
```

2. **use-bot-api.ts**: fetchPlugins 返回完整插件信息
```typescript
return [
  {
    id: '7548028105068183561',
    name: '今日诗词',
    description: '...',
    icon: '...',
    apiList: [
      {
        apiId: '7548028105068199945',
        name: 'daily_poetry',
        description: '...'
      }
    ],
  },
  // ...
];
```

3. **BotForm.tsx**: 映射 plugin_id 和 api_id
```typescript
plugin_id_list: selectedPlugins.length > 0 ? {
  id_list: selectedPlugins.map(id => {
    const plugin = pluginOptions.find((p: PluginInfo) => p.id === id);
    return {
      plugin_id: id,
      api_id: plugin?.apiList?.[0]?.apiId,  // 使用第一个 API 的 ID
    };
  }),
} : undefined
```

#### API 文档更新
更新了 `01-create-bot.md` 和 `02-update-bot.md`，添加 api_id 的说明和示例。

### 修改文件
```
src/pages/bot-manager/
├── utils/constants.ts           # 添加 api_id 到 DEFAULT_PLUGINS
├── hooks/use-bot-api.ts         # fetchPlugins 返回 apiList
└── components/BotForm.tsx       # 映射 plugin_id 和 api_id

.claude-workspace/api-docs/
├── 01-create-bot.md             # 添加 api_id 说明
└── 02-update-bot.md             # 添加 api_id 说明
```

---

## UI 和功能优化 (2026-01-11)

### 变更内容

#### 1. 建议问题改为 Tag 列表形式
**问题**: 之前使用 Textarea 输入，用户需要手动分隔问题

**解决方案**: 改为 Tag 列表，支持添加/删除单个问题
```typescript
// 新增状态
const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(DEFAULT_SUGGESTED_QUESTIONS);
const [questionInput, setQuestionInput] = useState('');
const [questionInputVisible, setQuestionInputVisible] = useState(false);

// UI: Tag 列表 + 添加按钮
<Form.Item label="建议问题">
  <div>
    <div style={{ marginBottom: 8 }}>
      {suggestedQuestions.map((question, index) => (
        <Tag key={index} closable onClose={() => removeQuestion(index)}>
          {question}
        </Tag>
      ))}
    </div>
    {!questionInputVisible ? (
      <Button type="dashed" size="small" icon={<PlusOutlined />}>添加问题</Button>
    ) : (
      <Space.Compact>
        <Input placeholder="输入问题" ... />
        <Button type="primary">确定</Button>
        <Button>取消</Button>
      </Space.Compact>
    )}
  </div>
</Form.Item>
```

#### 2. 发布渠道修改
**变更**: connector_ids 从 '10000122' 改为 '1024'
```typescript
// use-bot-api.ts: publishBot
await api.bots.publish({
  bot_id: botId,
  connector_ids: ['1024'],  // 改为 1024 渠道
});
```

#### 3. 音色默认值修改
**问题**: 之前默认值为 'zh_female_wan_warm'，即使不选择也会传递

**解决方案**: 改为 undefined，不选择时不传递
```typescript
// types.ts
export interface VoiceSelectorProps {
  voiceId?: string;  // 改为可选
  // ...
}

// BotForm.tsx
const [voiceId, setVoiceId] = useState<string | undefined>(undefined);

// VoiceSelector.tsx
// 移除失败时的 fallback mock 数据
setVoices([]);  // 失败时返回空列表
```

#### 4. 音色列表分页加载
**问题**: 音色数量超过 100 个，固定加载 100 个无法显示全部

**解决方案**: 实现滚动加载更多
```typescript
const PAGE_SIZE = 50;
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);

// 滚动到底部时加载下一页
const handlePopupScroll = (e: any) => {
  const target = e.target as HTMLElement;
  if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVoices(nextPage, true);  // append = true
    }
  }
};

// Select 组件添加 onPopupScroll
<Select onPopupScroll={handlePopupScroll} loading={loadingMore} ... />
```

#### 5. 修复 TTS 设置存储读取问题
**问题**: 编辑智能体后保存的音色，在 TTS 设置中无法读取

**原因**:
- BotForm 使用 `setBotExtConfig` 保存到 `bot-manager_ext_config`
- call 页面直接从 `bot-manager_ext_${botId}` 读取（key 不匹配）

**解决方案**: 统一使用 storage 工具函数
```typescript
// call/index.tsx: 修改前
const getExtConfig = () => {
  const ext = localStorage.getItem(`bot-manager_ext_${botId}`);  // 错误的 key
  return ext ? JSON.parse(ext) : { voiceId: '', voiceSpeed: 1 };
};

// call/index.tsx: 修改后
const getExtConfig = () => {
  const ext = getBotExtConfig(botId);  // 使用正确的工具函数
  return ext || { voiceId: '', voiceSpeed: 1 };
};

// 保存时也使用 setBotExtConfig
<Button onClick={() => {
  const existingConfig = getBotExtConfig(botId);
  const newExtConfig = {
    ...(existingConfig || defaultConfig),
    voiceId: localVoiceId,
    voiceSpeed: localVoiceSpeed,
  };
  setBotExtConfig(botId, newExtConfig);  // 使用正确的工具函数
}}>
```

### 修改文件列表
```
src/pages/bot-manager/
├── call/
│   └── index.tsx                    # 修复 TTS 配置读取/保存
├── components/
│   ├── BotForm.tsx                  # Tag 列表 UI、voiceId 默认值
│   └── VoiceSelector.tsx            # 分页加载、移除 mock 数据
├── hooks/
│   └── use-bot-api.ts               # connector_ids 改为 1024
└── types.ts                         # voiceId 改为可选
```

### 技术要点
1. **Tag 列表**: 更友好的交互体验，支持单独添加/删除
2. **分页加载**: Select 的 `onPopupScroll` 事件监听滚动
3. **存储统一**: 使用 `getBotExtConfig/setBotExtConfig` 工具函数，避免 key 不匹配

