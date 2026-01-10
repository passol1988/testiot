/**
 * 生活物联网智能体管理平台 - 类型定义
 * Bot Manager Type Definitions
 */

// ==================== API 类型 ====================

/**
 * 智能体信息（列表）
 */
export interface BotInfo {
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
export interface BotDetail extends BotInfo {
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
export interface PluginInfo {
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
export interface VoiceInfo {
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
export interface BotFormData {
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
  voiceId?: string;
  voiceSpeed: number;
}

// ==================== Storage 类型 ====================

/**
 * 登录信息
 */
export interface AuthStorage {
  user_id: string;
  pat: string;
}

/**
 * 智能体扩展配置
 */
export interface BotExtConfig {
  replyStyle: BotFormData['replyStyle'];
  values: string[];
  habits: string[];
  customPrompt: string;
  voiceId?: string;
  voiceSpeed: number;
}

/**
 * LocalStorage 结构
 */
export interface BotManagerStorage {
  'bot-manager_auth': AuthStorage;
  'bot-manager_ext': Record<string, BotExtConfig>;
}

// ==================== Prompt 模板类型 ====================

/**
 * Prompt 模板选项
 */
export interface PromptTemplateOptions {
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
export type CallState = 'idle' | 'calling' | 'connected';

/**
 * 对话模式
 */
export type TurnDetectionType = 'server_vad' | 'client_interrupt';

/**
 * 回复模式
 */
export type ReplyMode = 'stream' | 'sentence';

// ==================== 组件 Props 类型 ====================

/**
 * LoginModal Props
 */
export interface LoginModalProps {
  visible: boolean;
  onSubmit: (credentials: { user_id: string; pat: string }) => void;
  onCancel: () => void;
}

/**
 * BotList Props
 */
export interface BotListProps {
  bots: BotInfo[];
  loading: boolean;
  onEdit: (botId: string) => void;
  onCall: (botId: string) => void;
  onPublish: (botId: string) => void;
}

/**
 * BotCard Props
 */
export interface BotCardProps {
  bot: BotInfo;
  onEdit: (botId: string) => void;
  onCall: (botId: string) => void;
  onPublish: (botId: string) => void;
}

/**
 * BotForm Props
 */
export interface BotFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<BotFormData>;
  botId?: string;
  onSubmit: (data: BotFormData) => Promise<void>;
  onCancel: () => void;
  uploadFile?: (file: File) => Promise<string | null>;
  fetchVoices?: () => Promise<VoiceInfo[]>;
  fetchPlugins?: () => Promise<PluginInfo[]>;
  fetchBotDetail?: (botId: string) => Promise<BotDetail | null>;
}

/**
 * PromptPreview Props
 */
export interface PromptPreviewProps {
  prompt: string;
  visible: boolean;
  onToggle: () => void;
}

/**
 * PluginSelector Props
 */
export interface PluginSelectorProps {
  value: string[];
  onChange: (pluginIds: string[]) => void;
  options: PluginInfo[];
}

/**
 * VoiceSelector Props
 */
export interface VoiceSelectorProps {
  voiceId?: string;
  speed: number;
  onVoiceChange: (voiceId?: string) => void;
  onSpeedChange: (speed: number) => void;
  supportEmotion: boolean;
}

/**
 * CallHeader Props
 */
export interface CallHeaderProps {
  botInfo: BotInfo;
  callState: CallState;
  callDuration: number;
  formatDuration: (seconds: number) => string;
  onBack: () => void;
  onShowAdvancedConfig: () => void;
}

/**
 * IdleState Props
 */
export interface IdleStateProps {
  botInfo: BotInfo;
  onStart: () => void;
}

/**
 * CallingState Props
 */
export interface CallingStateProps {
  botInfo: BotInfo;
}

/**
 * ActiveState Props
 */
export interface ActiveStateProps {
  botInfo: BotInfo;
  onEndCall: () => void;
}
