/**
 * 生活物联网智能体管理平台 - 常量定义
 * Bot Manager Constants
 */

// 工作空间 ID
export const SPACE_ID = '7556632877497565234';

// LocalStorage Key
export const STORAGE_KEYS = {
  AUTH: 'bot-manager_auth',
  EXT: 'bot-manager_ext',
  TTS: 'bot-manager_tts',
} as const;

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

// 发布渠道（扣子商店）
export const PUBLISH_CONNECTOR_ID = '10000122';

// 默认音色 ID（中文女声温暖音色）
export const DEFAULT_VOICE_ID = 'zh_female_wan_warm';

// 默认开场白
export const DEFAULT_PROLOGUE = '你好！我是你的智能小伙伴，很高兴认识你～';

// 默认建议问题
export const DEFAULT_SUGGESTED_QUESTIONS = [
  '你能做什么？',
  '给我讲个故事吧',
  '今天天气怎么样？',
];

// 文件上传限制
export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ACCEPT_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
} as const;

// Prompt 字符限制
export const PROMPT_LIMITS = {
  MIN_CUSTOM: 10,
  MAX_TOTAL: 4000,
} as const;
