# Coze 预设数据

本文档包含 Coze 平台的模型列表和其他预设常量数据。

## 更新时间

2025-01-10 (共 25 个模型)

## 数据来源

- **工作空间 ID**: 7556632877497565234
- **数据来源**: Coze 模型管理 API

---

## 一、模型列表

### 模型总览

| 模型 ID | 模型名称 | 厂商 | 类型 | Token 限制 | 速度 |
|---------|----------|------|------|-----------|------|
| **豆包系列** |
| 1762917129 | 豆包·编程 | 字节跳动 | 深度思考 | 229,376 | 380 |
| 1761532732 | 豆包·1.6·lite·251015 | 字节跳动 | 深度思考 | 229,376 | 366 |
| 1761535088 | 豆包·1.6·思考深度调节 | 字节跳动 | 深度思考 | 229,376 | 405 |
| 1761035614 | 豆包·1.6·极致速度·250828 | 字节跳动 | 深度思考 | 229,376 | 809 |
| 1756106585 | 豆包·1.6·视觉理解-250815 | 字节跳动 | 视觉理解 | 262,144 | 434 |
| 1749615103 | 豆包·1.6·自动深度思考 | 字节跳动 | 深度思考 | 229,376 | 306 |
| 1748952822 | 豆包·1.5·Pro·视觉理解·Lite | 字节跳动 | 视觉理解 | 131,072 | 490 |
| 1749615085 | 豆包·1.6·深度思考 | 字节跳动 | 深度思考 | 229,376 | 341 |
| 1749615117 | 豆包·1.6·极致速度 | 字节跳动 | 深度思考 | 229,376 | 728 |
| 1753451788 | 豆包·1.6·极致速度·250715 | 字节跳动 | 深度思考 | 229,376 | 864 |
| 1753444193 | 豆包·1.6·深度思考·250715 | 字节跳动 | 深度思考 | 229,376 | 376 |
| 1753453374 | 豆包·1.5·Pro·角色扮演·250715 | 字节跳动 | 角色扮演 | 32,768 | 257 |
| **DeepSeek 系列** |
| 1755855875 | DeepSeek-V3.1 | 深度求索 | 文本 | 131,072 | 248 |
| 1764929611 | DeepSeek-V3.2 | 深度求索 | 文本 | 131,072 | 196 |
| 1748588801 | DeepSeek-R1/250528 | 深度求索 | 文本 | 65,536 | 301 |
| 1742989917 | DeepSeek-V3-0324 | 深度求索 | 文本 | 131,072 | 193 |
| 1739508606 | DeepSeek-V3·工具调用 | 深度求索 | 文本 | 65,536 | 286 |
| **Kimi 系列** |
| 1763350148 | Kimi-K2-250905 | 字节跳动 | 文本 | 131,072 | 241 |
| 1713367088 | Kimi-8k | 月之暗面 | 文本 | 8,192 | 282 |
| 1711283562 | Kimi-32k | 月之暗面 | 文本 | 32,768 | 364 |
| 1713366995 | Kimi-128k | 月之暗面 | 长文本 | 131,072 | 477 |
| **阶跃星辰系列** |
| 1732104980 | 阶跃星辰·1o-turbo·视频理解 | 阶跃星辰 | 多模态 | 32,768 | 577 |
| 1730805694 | 阶跃星辰·1v·图片理解 | 阶跃星辰 | 多模态 | 8,192 | 219 |

### 模型家族

| 家族 ID | 家族名称 | 排名 |
|---------|----------|------|
| 7287388636726274 | 豆包大模型 | 1 |
| 7287388636726530 | Deepseek | 2 |
| 7287388636726786 | 通义千问 | 3 |
| 7287388636727042 | Kimi | 4 |
| 7287388636727298 | 百川 | 6 |
| 7287388636727554 | ChatGPT | 9 |
| 7287388636727810 | 阶跃星辰 | 11 |
| 7287388636728322 | Minimax | 13 |
| 7287388636728066 | 智谱 | 12 |

### 支持的厂商

| 厂商名称 |
|----------|
| 字节跳动 |
| 阿里巴巴 |
| Minimax |
| 智谱 |
| 月之暗面 |
| 百川智能 |
| 深度求索 |
| 阶跃星辰 |

---

## 二、TypeScript 常量定义

```typescript
/**
 * Coze 模型常量定义
 */

/**
 * 模型列表
 */
export const COZE_MODELS = {
  // 豆包系列 - 深度思考模型
  DOUBAO_PROGRAMMING: '1762917129',           // 豆包·编程
  DOUBAO_16_LITE_251015: '1761532732',        // 豆包·1.6·lite·251015
  DOUBAO_16_THINKING_ADJUSTABLE: '1761535088', // 豆包·1.6·思考深度调节
  DOUBAO_16_FLASH_250828: '1761035614',       // 豆包·1.6·极致速度·250828
  DOUBAO_16_AUTO_THINKING: '1749615103',      // 豆包·1.6·自动深度思考
  DOUBAO_16_THINKING: '1749615085',           // 豆包·1.6·深度思考
  DOUBAO_16_FLASH: '1749615117',              // 豆包·1.6·极致速度
  DOUBAO_16_FLASH_250715: '1753451788',       // 豆包·1.6·极致速度·250715
  DOUBAO_16_THINKING_250715: '1753444193',    // 豆包·1.6·深度思考·250715

  // 豆包系列 - 视觉理解
  DOUBAO_16_VISION_250815: '1756106585',      // 豆包·1.6·视觉理解-250815
  DOUBAO_15_PRO_VISION_LITE: '1748952822',    // 豆包·1.5·Pro·视觉理解·Lite

  // 豆包系列 - 角色扮演
  DOUBAO_15_PRO_ROLEPLAY_250715: '1753453374', // 豆包·1.5·Pro·角色扮演·250715

  // DeepSeek 系列
  DEEPSEEK_V3_1: '1755855875',                // DeepSeek-V3.1
  DEEPSEEK_V3_2: '1764929611',                // DeepSeek-V3.2
  DEEPSEEK_R1_250528: '1748588801',          // DeepSeek-R1/250528
  DEEPSEEK_V3_0324: '1742989917',             // DeepSeek-V3-0324
  DEEPSEEK_V3_FUNCTION_CALL: '1739508606',    // DeepSeek-V3·工具调用

  // Kimi 系列
  KIMI_K2_250905: '1763350148',              // Kimi-K2-250905
  KIMI_8K: '1713367088',                     // Kimi-8k
  KIMI_32K: '1711283562',                    // Kimi-32k
  KIMI_128K: '1713366995',                   // Kimi-128k

  // 阶跃星辰系列
  STEP_1O_TURBO_VISION: '1732104980',        // 阶跃星辰·1o-turbo·视频理解
  STEP_1V_8K: '1730805694',                  // 阶跃星辰·1v·图片理解
} as const;

/**
 * 模型详细信息
 */
export const MODEL_INFO = [
  {
    id: '1762917129',
    name: '豆包·编程',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'Doubao-Seed-Code 面向Agentic编程任务进行了深度优化',
    tokenLimit: 229376,
    speed: 380,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用'],
  },
  {
    id: '1761532732',
    name: '豆包·1.6·lite·251015',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'doubao-seed-1.6-lite，具有更高性价比的多模态深度思考模型',
    tokenLimit: 229376,
    speed: 366,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
      prefillResp: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用', '续写'],
  },
  {
    id: '1761535088',
    name: '豆包·1.6·思考深度调节',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'doubao-seed-1-6-251015：支持调节思考长度',
    tokenLimit: 229376,
    speed: 405,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
      prefillResp: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用', '续写'],
  },
  {
    id: '1761035614',
    name: '豆包·1.6·极致速度·250828',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'Doubao-1.6-flash-250828，综合能力最强flash版本',
    tokenLimit: 229376,
    speed: 809,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用'],
  },
  {
    id: '1756106585',
    name: '豆包·1.6·视觉理解-250815',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: '适用于视频理解、Grounding、GUI Agent等高复杂度的场景',
    tokenLimit: 262144,
    speed: 434,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用'],
  },
  {
    id: '1749615103',
    name: '豆包·1.6·自动深度思考',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'Doubao-1.6，全新多模态深度思考模型，支持 256k 上下文窗口',
    tokenLimit: 229376,
    speed: 306,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用'],
  },
  {
    id: '1755855875',
    name: 'DeepSeek-V3.1',
    vendor: '深度求索',
    familyId: '7287388636726530',
    description: 'DeepSeek- V3.1 是深度求索全新推出的混合推理模型',
    tokenLimit: 131072,
    speed: 236,
    abilities: {
      functionCall: true,
      thinking: false,
    },
    tags: ['文本模型', '深度思考', 'CoT', '工具调用'],
  },
  {
    id: '1764929611',
    name: 'DeepSeek-V3.2',
    vendor: '深度求索',
    familyId: '7287388636726530',
    description: '深度求索推出的首个将思考融入工具使用的混合推理模型',
    tokenLimit: 131072,
    speed: 196,
    abilities: {
      functionCall: true,
      thinking: false,
    },
    tags: ['文本模型', '深度思考', 'CoT', '工具调用'],
  },
  {
    id: '1748952822',
    name: '豆包·1.5·Pro·视觉理解·Lite',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'doubao-1.5-vision-lite-250315全新升级的多模态大模型',
    tokenLimit: 131072,
    speed: 490,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: false,
    },
    tags: ['视觉模型', '图片理解', '视频理解'],
  },
  {
    id: '1749615085',
    name: '豆包·1.6·深度思考',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'Doubao-1.6-thinking模型思考能力大幅强化',
    tokenLimit: 229376,
    speed: 341,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用'],
  },
  {
    id: '1749615117',
    name: '豆包·1.6·极致速度',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'Doubao-1-6-flash-250615，推理速度极致的多模态深度思考模型',
    tokenLimit: 229376,
    speed: 728,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用'],
  },
  {
    id: '1753451788',
    name: '豆包·1.6·极致速度·250715',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'Doubao-1.6-flash-250715，相比flash-0615版本，0715版本思考与非思考模式的纯文本任务效果大幅提升近10%',
    tokenLimit: 229376,
    speed: 864,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用'],
  },
  {
    id: '1753444193',
    name: '豆包·1.6·深度思考·250715',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'Doubao-1.6-thinking-250715，深度思考能力更强化！',
    tokenLimit: 229376,
    speed: 376,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
      thinking: true,
    },
    tags: ['深度思考模型', '深度思考', '视频理解', '图片理解', '工具调用'],
  },
  {
    id: '1753453374',
    name: '豆包·1.5·Pro·角色扮演·250715',
    vendor: '字节跳动',
    familyId: '7287388636726274',
    description: 'Doubao-1.5-pro-32k-character-250715，新增故事剧情模式、恋爱拉扯、真人向聊天优化',
    tokenLimit: 32768,
    speed: 257,
    abilities: {
      functionCall: true,
    },
    tags: ['文本模型', '旗舰', '工具调用'],
  },
  {
    id: '1748588801',
    name: 'DeepSeek-R1/250528',
    vendor: '深度求索',
    familyId: '7287388636726530',
    description: 'DeepSeek-R1，深度推理模型',
    tokenLimit: 65536,
    speed: 301,
    abilities: {
      functionCall: true,
      thinking: false,
    },
    tags: ['文本模型', '深度思考', 'CoT', '工具调用'],
  },
  {
    id: '1742989917',
    name: 'DeepSeek-V3-0324',
    vendor: '深度求索',
    familyId: '7287388636726530',
    description: 'DeepSeek-V3-0324，深度推理模型',
    tokenLimit: 131072,
    speed: 193,
    abilities: {
      functionCall: true,
      thinking: false,
    },
    tags: ['文本模型', '深度思考', 'CoT', '工具调用'],
  },
  {
    id: '1739508606',
    name: 'DeepSeek-V3·工具调用',
    vendor: '深度求索',
    familyId: '7287388636726530',
    description: 'DeepSeek-V3-FunctionCall，支持工具调用的混合推理模型',
    tokenLimit: 65536,
    speed: 286,
    abilities: {
      functionCall: true,
      thinking: false,
    },
    tags: ['文本模型', '深度思考', 'CoT', '工具调用'],
  },
  {
    id: '1763350148',
    name: 'Kimi-K2-250905',
    vendor: '字节跳动',
    familyId: '7287388636727042',
    description: 'Kimi-K2-250905，月之暗面最新模型',
    tokenLimit: 131072,
    speed: 241,
    abilities: {
      functionCall: true,
      thinking: false,
    },
    tags: ['文本模型', '工具调用'],
  },
  {
    id: '1713367088',
    name: 'Kimi-8k',
    vendor: '月之暗面',
    familyId: '7287388636727042',
    description: 'Kimi-8k，月之暗面 8k 上下文模型',
    tokenLimit: 8192,
    speed: 282,
    abilities: {
      functionCall: true,
    },
    tags: ['文本模型', '工具调用'],
  },
  {
    id: '1711283562',
    name: 'Kimi-32k',
    vendor: '月之暗面',
    familyId: '7287388636727042',
    description: 'Kimi-32k，月之暗面 32k 上下文模型',
    tokenLimit: 32768,
    speed: 364,
    abilities: {
      functionCall: true,
    },
    tags: ['文本模型', '工具调用'],
  },
  {
    id: '1713366995',
    name: 'Kimi-128k',
    vendor: '月之暗面',
    familyId: '7287388636727042',
    description: 'Kimi-128k，月之暗面 128k 长上下文模型',
    tokenLimit: 131072,
    speed: 477,
    abilities: {
      functionCall: true,
    },
    tags: ['长文本', '工具调用'],
  },
  {
    id: '1732104980',
    name: '阶跃星辰·1o-turbo·视频理解',
    vendor: '阶跃星辰',
    familyId: '7287388636727810',
    description: 'Step-1o-turbo，阶跃星辰视频理解模型',
    tokenLimit: 32768,
    speed: 577,
    abilities: {
      imageUnderstanding: true,
      videoUnderstanding: true,
      functionCall: true,
    },
    tags: ['多模态模型', '视频理解', '图片理解', '工具调用'],
  },
  {
    id: '1730805694',
    name: '阶跃星辰·1v·图片理解',
    vendor: '阶跃星辰',
    familyId: '7287388636727810',
    description: 'Step-1v-8k，阶跃星辰图片理解模型',
    tokenLimit: 8192,
    speed: 219,
    abilities: {
      imageUnderstanding: true,
      functionCall: true,
    },
    tags: ['多模态模型', '图片理解', '工具调用'],
  },
] as const;

/**
 * 模型家族
 */
export const MODEL_FAMILIES = {
  DOUBAO: '7287388636726274',    // 豆包大模型
  DEEPSEEK: '7287388636726530',  // Deepseek
  QWEN: '7287388636726786',      // 通义千问
  KIMI: '7287388636727042',      // Kimi
  BAICHUAN: '7287388636727298',  // 百川
  CHATGPT: '7287388636727554',   // ChatGPT
  STEP_FUN: '7287388636727810',  // 阶跃星辰
  ZHIPU: '7287388636728066',     // 智谱
  MINIMAX: '7287388636728322',   // Minimax
} as const;

/**
 * 模型厂商
 */
export const MODEL_VENDORS = [
  '字节跳动',
  '阿里巴巴',
  'Minimax',
  '智谱',
  '月之暗面',
  '百川智能',
  '深度求索',
  '阶跃星辰',
] as const;

/**
 * 模型类型标签
 */
export const MODEL_TAGS = {
  // 基础类型
  TEXT_MODEL: '文本模型',
  MULTIMODAL_MODEL: '多模态模型',
  FINETUNED_MODEL: '微调模型',
  VISION_MODEL: '视觉模型',
  THINKING_MODEL: '深度思考模型',

  // 能力标签
  VIDEO_UNDERSTANDING: '视频理解',
  IMAGE_UNDERSTANDING: '图片理解',
  AUDIO_UNDERSTANDING: '音频理解',
  FUNCTION_CALL: '工具调用',
  CONTEXT_CACHE: '上下文缓存',
  CONTINUATION: '续写',
  DEEP_THINKING: '深度思考',

  // 特性标签
  FLAGSHIP: '旗舰',
  HIGH_SPEED: '高速',
  ROLE_PLAY: '角色扮演',
  LONG_CONTEXT: '长文本',
  REASONING: '推理能力',
  COST_EFFECTIVE: '性价比',
  CODE_SPECIALTY: '代码专精',
} as const;

/**
 * 推荐模型（按场景分类）
 */
export const RECOMMENDED_MODELS = {
  // 编程任务
  CODING: COZE_MODELS.DOUBAO_PROGRAMMING,

  // 快速响应
  FAST_RESPONSE: COZE_MODELS.DOUBAO_16_FLASH_250715,

  // 深度思考
  DEEP_THINKING: COZE_MODELS.DOUBAO_16_THINKING_250715,

  // 视觉理解
  VISION: COZE_MODELS.DOUBAO_16_VISION_250815,

  // 角色扮演
  ROLE_PLAY: COZE_MODELS.DOUBAO_15_PRO_ROLEPLAY_250715,

  // 高性价比
  COST_EFFECTIVE: COZE_MODELS.DOUBAO_16_LITE_251015,

  // 默认推荐
  DEFAULT: COZE_MODELS.DOUBAO_16_AUTO_THINKING,
} as const;

/**
 * 工作空间预设
 */
export const WORKSPACE = {
  /**
   * 当前工作空间 ID
   *
   * ⚠️ **注意**: 这是项目的固定工作空间 ID，不同环境需要修改
   * 获取方式: Coze 平台 -> 工作空间 -> URL 中的 space_id
   */
  SPACE_ID: '7556632877497565234',
} as const;

/**
 * 发布渠道预设
 *
 * 数据来源: /v1/bot/publish/connectors 接口返回
 */
export const PUBLISH_CONNECTORS = {
  // 扣子商店（默认推荐）
  COZE_STORE: '10000122',

  // API 接口
  API: '1024',

  // Chat SDK
  CHAT_SDK: '999',

  // 豆包
  DOUBAO: '482431',

  // 飞书
  FEISHU: '10000011',

  // 微信小程序
  WECHAT_MINI_PROGRAM: '10000127',

  // 微信客服
  WECHAT_CUSTOMER_SERVICE: '10000113',

  // 微信服务号
  WECHAT_SERVICE_ACCOUNT: '10000120',

  // 微信订阅号
  WECHAT_SUBSCRIPTION: '10000121',

  // 抖音小程序
  DOUYIN_MINI_PROGRAM: '10000126',

  // 飞书多维表格
  FEISHU_BASE: '10000128',

  // 掘金
  JUEJIN: '10000117',
} as const;

/**
 * 发布渠道信息（完整数据）
 *
 * 用于获取渠道的详细信息（名称、图标、描述等）
 */
export const CONNECTOR_INFO = [
  {
    id: '10000122',
    name: '扣子商店',
    icon: 'https://lf6-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/372098624667275_1712460031268408175_9WGvWvI0pp.jpeg',
    desc: '智能体会出现在扣子智能体商店中,为你的智能体获取更多曝光和流量!',
    bindType: 7, // 商店
    isDefault: true, // 默认推荐
  },
  {
    id: '1024',
    name: 'API',
    icon: 'https://lf26-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/29032201862555_1704265542803208886.jpeg',
    desc: '调用前需创建访问凭证',
    bindType: 5, // API
  },
  {
    id: '999',
    name: 'Chat SDK',
    icon: 'https://lf6-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/3952087207521568_1707043681285046428_nm5Cvu8f5f.jpeg',
    desc: '将 Agent 部署为 Chat SDK',
    bindType: 6, // SDK
  },
  {
    id: '482431',
    name: '豆包',
    icon: 'https://lf3-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/FileBizType.BIZ_BOT_ICON/4383119973291048_1700223103089819298.jpeg',
    desc: '一键发布到豆包 App，随时随地与 Bot 对话',
    bindType: 2, // 应用
  },
  {
    id: '10000011',
    name: '飞书',
    icon: 'https://lf3-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/4383119973291048_1700223225531453133.jpeg',
    desc: '在飞书中直接 @Bot 对话，提高工作生产力',
    bindType: 2, // 应用
  },
  {
    id: '10000127',
    name: '微信小程序',
    icon: 'https://lf9-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/2236870734648579_1718353082205275570_44qTXh8EhW.png',
    desc: '无需自己编程,直接将Bot发布为一个微信小程序。需要进行微信企业认证。',
    bindType: 4, // 小程序
  },
  {
    id: '10000113',
    name: '微信客服',
    icon: 'https://lf9-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/820678153224011_1706624309760125536_Rfy3y7tZ7s.png',
    desc: '发布到微信客服，微信沟通更高效',
    bindType: 3, // 客服
  },
  {
    id: '10000120',
    name: '微信服务号',
    icon: 'https://lf9-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/1797065708409927_1706623113192638543_uuPV3dxqEX.png',
    desc: '托管公众号消息，助力微信运营无间断',
    bindType: 4, // 小程序
  },
  {
    id: '10000121',
    name: '微信订阅号',
    icon: 'https://lf9-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/1797065708409927_1706623113192638543_uuPV3dxqEX.png',
    desc: '托管公众号消息，助力微信运营无间断',
    bindType: 4, // 小程序
  },
  {
    id: '10000126',
    name: '抖音小程序',
    icon: 'https://lf6-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/3952087207521568_1719460425177618225_Sqf4U6I6rr.png',
    desc: '无需自己编程,直接将Bot发布为一个抖音小程序。需要进行抖音企业认证。',
    bindType: 4, // 小程序
  },
  {
    id: '10000128',
    name: '飞书多维表格',
    icon: 'https://lf9-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/FileBizType.BIZ_CONNECTOR_ICON/2236870734648579_1722940341332017991_0sHc5yN3Ow.png',
    desc: '发布到飞书多维表格字段捷径，轻松实现批量生成',
    bindType: 8, // 其他
  },
  {
    id: '10000117',
    name: '掘金',
    icon: 'https://lf3-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/372098624667275_1709197136277118085_xVJoSXq2vT.jpeg',
    desc: '在掘金社区 AI 聊天室圈子与 Bot 互动',
    bindType: 2, // 应用
  },
] as const;

/**
 * 根据渠道 ID 获取渠道信息
 */
export function getConnectorById(connectorId: string): typeof CONNECTOR_INFO[number] | undefined {
  return CONNECTOR_INFO.find(c => c.id === connectorId);
}

/**
 * 根据渠道类型获取渠道列表
 */
export function getConnectorsByBindType(bindType: number): typeof CONNECTOR_INFO {
  return CONNECTOR_INFO.filter(c => c.bindType === bindType);
}

/**
 * 插件预设
 *
 * 数据来源: 智能体详情 API 返回的 plugin_info_list
 */
export const PLUGINS = {
  // 语音合成
  TTS: '7572542446735999016',

  // 今日诗词
  DAILY_POETRY: '7548028105068183561',

  // 童话故事合集
  FAIRY_TALES: '7495098187846385704',

  // 墨迹天气
  WEATHER: '7362852017859018779',

  // 现在时间
  CURRENT_DATETIME: '7384737081651707916',

  // 亲子关系问题清单
  PARENT_CHILD_QA: '7375329794130591770',
} as const;

/**
 * 默认展示的插件列表（供用户选择）
 *
 * 排除语音合成插件，默认展示 4 个插件供用户选择
 */
export const DEFAULT_PLUGINS = [
  PLUGINS.DAILY_POETRY,        // 今日诗词
  PLUGINS.FAIRY_TALES,         // 童话故事合集
  PLUGINS.WEATHER,             // 墨迹天气
  PLUGINS.CURRENT_DATETIME,    // 现在时间
] as const;

/**
 * 默认选中的插件（创建智能体时自动选中）
 */
export const DEFAULT_SELECTED_PLUGINS = [
  PLUGINS.CURRENT_DATETIME,    // 现在时间
] as const;

/**
 * 插件信息（完整数据）
 */
export const PLUGIN_INFO = [
  {
    id: '7572542446735999016',
    name: '语音合成',
    description: '专注于高效、灵活的语音生成，核心支持语音合成指令解析、历史上下文关联，并提供精细化的情感与语速控制功能。',
    icon: 'https://lf6-appstore-sign.oceancloudapi.com/ocean-cloud-tos/plugin_icon/4308322827904212_1763119727664289926_vunRTgICtU.jpg',
    apiList: [
      {
        apiId: '7572542446736015400',
        name: 'tts',
        description: '语音合成的核心功能是能够根据用户的指令（自定义提示词）进行调整情感、语速、音量等参数，生成您满意的音频。',
      },
    ],
  },
  {
    id: '7548028105068183561',
    name: '今日诗词',
    description: '无需参数配置，无需认证授权，每次访问即返回一句精选诗句，附带作者简介、完整原文与详细解释。让古典诗词的智慧与美感，轻松融入您的日常。',
    icon: 'https://lf3-appstore-sign.oceancloudapi.com/ocean-cloud-tos/plugin_icon/4223672455014680_1757412179311746878_cfqpVn9V7Q.jpg',
    apiList: [
      {
        apiId: '7548028105068199945',
        name: 'daily_poetry',
        description: '核心功能：即开即用、每日更新、完整信息、轻量接口',
      },
    ],
  },
  {
    id: '7495098187846385704',
    name: '童话故事合集',
    description: '世界广泛流行的童话合集，收录了例如安徒生童话、格林童话、一千零一夜、世界范围内各民族经典的民间寓言故事等等。',
    icon: 'https://lf26-appstore-sign.oceancloudapi.com/ocean-cloud-tos/plugin_icon/2373211286942044_1745087532021932379_qsW2URdm0S.jpg',
    apiList: [
      {
        apiId: '7495098187846402088',
        name: 'Fairy_Tale',
        description: '收录了安徒生童话、格林童话、一千零一夜、儿童童话、民间故事、成语故事、寓言故事、经典童话。',
      },
    ],
  },
  {
    id: '7362852017859018779',
    name: '墨迹天气',
    description: '提供省、市、区县的未来40天的天气情况，包括温度、湿度、日夜风向等',
    icon: 'https://lf6-appstore-sign.oceancloudapi.com/ocean-cloud-tos/plugin_icon/3503520560195028_1706621033925555371_rPUemhsbVg.webp?lk3s=cd508e2b&x-expires=1770781989&x-signature=%2BlxXnCUTNtOPG3l7EwGdVLRXKks%3D',
    apiList: [
      {
        apiId: '7362852017859035163',
        name: 'DayWeather',
        description: '获取国内指定日期的天气，不支持获取国外天气情况。',
      },
    ],
  },
  {
    id: '7384737081651707916',
    name: '现在时间',
    description: '获取当前的日期和时间，格式为年-月-日 时:分:秒',
    icon: 'https://lf3-appstore-sign.oceancloudapi.com/ocean-cloud-tos/plugin_icon/3899331945958112_1719392810122317529_YpFUY06GHQ.jpg?lk3s=cd508e2b&x-expires=1770781989&x-signature=HLQFbtoK8dOlKKe%2BBK8tyilnfnI%3D',
    apiList: [
      {
        apiId: '7384737081651724300',
        name: 'get_current_datetime',
        description: '获取当前的日期和时间，并以格式化的字符串形式返回。',
      },
    ],
  },
  {
    id: '7375329794130591770',
    name: '亲子关系问题清单',
    description: '亲子关系是家庭中非常重要的一部分，它影响着孩子的成长和发展。这个插件是关于亲子关系问题的清单。',
    icon: 'https://lf9-appstore-sign.oceancloudapi.com/ocean-cloud-tos/plugin_icon/default_icon.png',
    apiList: [
      {
        apiId: '7375329794130608154',
        name: 'parent_children_QA',
        description: '当用户有亲子关系问题，不知道该问哪些问题时，这个插件可以将相关问题展示出来，便于用户提问。',
      },
    ],
  },
] as const;

/**
 * 根据插件 ID 获取插件信息
 */
export function getPluginById(pluginId: string): typeof PLUGIN_INFO[number] | undefined {
  return PLUGIN_INFO.find(p => p.id === pluginId);
}

/**
 * 模型能力类型
 */
export interface ModelAbility {
  audioUnderstanding?: boolean;
  cotDisplay?: boolean;
  functionCall?: boolean;
  imageUnderstanding?: boolean;
  prefillResp?: boolean;
  videoUnderstanding?: boolean;
  thinking?: boolean;
}

/**
 * 模型信息类型
 */
export interface ModelInfo {
  id: string;
  name: string;
  vendor: string;
  familyId: string;
  description: string;
  tokenLimit: number;
  speed: number;
  abilities: ModelAbility;
  tags: string[];
}

/**
 * 根据 ID 获取模型信息
 */
export function getModelById(modelId: string): ModelInfo | undefined {
  return MODEL_INFO.find(model => model.id === modelId);
}

/**
 * 根据厂商获取模型列表
 */
export function getModelsByVendor(vendor: string): ModelInfo[] {
  return MODEL_INFO.filter(model => model.vendor === vendor);
}

/**
 * 获取支持指定能力的模型
 */
export function getModelsByAbility(ability: keyof ModelAbility): ModelInfo[] {
  return MODEL_INFO.filter(model => model.abilities[ability] === true);
}
```

---

## 三、使用示例

### 创建智能体时指定模型

```typescript
import { CozeAPI } from '@coze/api';
import { COZE_MODELS, RECOMMENDED_MODELS } from './preset-data';

const cozeApi = new CozeAPI({
  baseURL: 'https://api.coze.cn',
  token: 'your_personal_access_token',
});

// 使用推荐的编程模型
async function createCodingBot() {
  await cozeApi.bots.create({
    space_id: '73823482348234XXXX',
    name: '编程助手',
    description: '专业的编程助手，帮助解决编程问题',
    model_info_config: {
      model_id: COZE_MODELS.DOUBAO_PROGRAMMING,
    },
  });
}

// 使用快速响应模型
async function createFastChatBot() {
  await cozeApi.bots.create({
    space_id: '73823482348234XXXX',
    name: '快速对话',
    model_info_config: {
      model_id: RECOMMENDED_MODELS.FAST_RESPONSE,
    },
  });
}
```

### 模型选择器组件

```typescript
import React from 'react';
import { Select } from 'antd';
import { MODEL_INFO } from './preset-data';

function ModelSelector({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="选择模型"
      showSearch
      optionFilterProp="label"
    >
      {MODEL_INFO.map(model => (
        <Select.Option key={model.id} value={model.id} label={model.name}>
          <div>
            <div>{model.name}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {model.vendor} | {model.tokenLimit.toLocaleString()} tokens | 速度: {model.speed}
            </div>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}
```

---

## 四、数据说明

### Token 限制说明

| 限制范围 | 适用场景 |
|----------|----------|
| 32,768 | 角色扮演、简单对话 |
| 131,072 | DeepSeek 系列、视觉理解 |
| 229,376 | 豆包 1.6 系列（主流） |
| 262,144 | 高级视觉理解 |

### 模型速度说明

速度值越大表示响应越快：

| 速度范围 | 等级 |
|----------|------|
| 800+ | 极速 |
| 600-800 | 很快 |
| 400-600 | 较快 |
| 200-400 | 正常 |
| <200 | 较慢 |

### 能力说明

| 能力 | 说明 |
|------|------|
| thinking | 支持深度思考（思维链） |
| functionCall | 支持工具/函数调用 |
| imageUnderstanding | 支持图片理解 |
| videoUnderstanding | 支持视频理解 |
| prefillResp | 支持预填充响应 |

---

## 五、注意事项

1. **模型 ID 是动态的**: 不同工作空间可能有不同的模型 ID，请根据实际工作空间的 API 响应更新
2. **模型可用性**: 部分模型可能需要特定权限或付费才能使用
3. **数据更新**: 模型列表会定期更新，请定期同步最新数据
4. **has_more**: 当前数据中 `has_more: true`，表示还有更多模型，`next_cursor_id: "15"` 可用于获取下一页

---

## 六、数据更新

如需更新模型列表，请调用：

```
GET /api/space/api/bot/model_list
```

参数：
```json
{
  "space_id": "7556632877497565234",
  "cursor_id": "15"  // 用于获取下一页
}
```
