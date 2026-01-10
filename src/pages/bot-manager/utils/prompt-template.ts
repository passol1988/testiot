/**
 * Prompt 模板生成工具
 * Prompt Template Generator
 */

import type { PromptTemplateOptions } from '../types';

/**
 * Prompt 模板
 */
const PROMPT_TEMPLATE = `{{customPrompt}}

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
- 可以适当使用emoji表情增加趣味性`;

/**
 * 生成 Prompt
 * @param options - Prompt 模板选项
 * @returns 生成的完整 Prompt
 */
export const generatePrompt = (options: PromptTemplateOptions): string => {
  const replyStyleText = {
    '简洁明了': '用简短的句子回答，避免冗长。',
    '适中详细': '适度详细地回答，保持趣味性。',
    '丰富详尽': '详细生动地回答，多用比喻和描述。',
  }[options.replyStyle];

  return PROMPT_TEMPLATE.replace('{{customPrompt}}', options.customPrompt.trim())
    .replace('{{replyStyle}}', replyStyleText)
    .replace('{{values}}', options.values.join('、') || '善良、真诚')
    .replace('{{habits}}', options.habits.join('、') || '保持良好习惯')
    .replace('{{skills}}', options.skills.join('、') || '聊天对话')
    .trim();
};

/**
 * 默认 Prompt 选项
 */
export const getDefaultPromptOptions = (): PromptTemplateOptions => ({
  customPrompt: '你是一个会讲故事、会聊天、会回答问题的好朋友。',
  replyStyle: '适中详细',
  values: ['善良', '真诚'],
  habits: ['好好吃饭', '爱阅读', '讲文明'],
  skills: ['聊天对话'],
});

/**
 * 验证 Prompt 长度
 * @param prompt - Prompt 内容
 * @param maxLength - 最大长度
 * @returns 是否超过限制
 */
export const isPromptTooLong = (prompt: string, maxLength = 4000): boolean => {
  return prompt.length > maxLength;
};

/**
 * 格式化显示 Prompt（用于预览）
 * @param prompt - Prompt 内容
 * @returns 格式化后的 Prompt
 */
export const formatPromptForPreview = (prompt: string): string => {
  return prompt
    .split('\n')
    .map(line => {
      if (line.startsWith('【') && line.endsWith('】')) {
        return `\n${line}`;
      }
      if (line.startsWith('- ')) {
        return `  ${line}`;
      }
      return line;
    })
    .join('\n');
};
