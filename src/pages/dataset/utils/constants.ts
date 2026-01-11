/**
 * 知识库管理 - 常量定义
 * Dataset Manager Constants
 */

import { DatasetFormatType, ChunkStrategy } from '../types';

/**
 * 默认分段策略
 */
export const DEFAULT_CHUNK_STRATEGY: ChunkStrategy = {
  chunk_type: 0,  // 自动分段与清洗
};

/**
 * 默认更新规则（在线网页）
 */
export const DEFAULT_UPDATE_RULE = {
  update_type: 0,  // 不自动更新
  update_interval: 0,
};

/**
 * 默认标注方式
 */
export const DEFAULT_CAPTION_TYPE = 0;  // 系统自动标注

/**
 * 进度轮询配置
 */
export const POLLING_CONFIG = {
  interval: 1000,      // 1秒间隔
  maxAttempts: 300,    // 最多5分钟
  completeDelay: 1500, // 完成后延迟关闭弹窗时间
};

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  defaultCurrent: 1,
  pageSizeOptions: ['10', '20', '50', '100'],
};

/**
 * 文件上传限制
 */
export const UPLOAD_LIMITS = {
  maxFileSize: 512 * 1024 * 1024,  // 512MB
  maxFilesPerUpload: 10,            // 每次最多10个文件
  maxBatchDelete: 100,              // 批量删除最多100个
};

/**
 * 支持的文件类型
 */
export const SUPPORTED_FILE_TYPES = {
  [DatasetFormatType.TEXT]: ['.pdf', '.txt', '.doc', '.docx'],
  [DatasetFormatType.IMAGE]: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

/**
 * 知识库类型选项
 */
export const DATASET_TYPE_OPTIONS = [
  { label: '文本类型', value: DatasetFormatType.TEXT },
  { label: '图片类型', value: DatasetFormatType.IMAGE },
];

/**
 * 标注方式选项
 */
export const CAPTION_TYPE_OPTIONS = [
  { label: '系统自动标注', value: 0 },
  { label: '手工标注', value: 1 },
];

/**
 * 文件状态映射
 */
export const DOCUMENT_STATUS_MAP = {
  0: { text: '处理中', color: 'processing' },
  1: { text: '完成', color: 'success' },
  9: { text: '失败', color: 'error' },
};

/**
 * 知识库类型映射
 */
export const DATASET_TYPE_MAP = {
  [DatasetFormatType.TEXT]: '文本',
  [DatasetFormatType.TABLE]: '表格',
  [DatasetFormatType.IMAGE]: '图片',
};
