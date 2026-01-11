// ============================================
// Coze 知识库 API - TypeScript 类型定义
// ============================================

// --------------------------------------------
// 通用类型
// --------------------------------------------

/**
 * API 响应基础结构
 */
export interface CozeApiResponse<T = unknown> {
  code: number;
  msg: string;
  detail?: ResponseDetail;
  data?: T;
}

/**
 * 响应详情
 */
export interface ResponseDetail {
  logid: string;
}

// --------------------------------------------
// 知识库相关类型
// --------------------------------------------

/**
 * 知识库类型
 */
export enum DatasetFormatType {
  TEXT = 0,    // 文本类型
  TABLE = 1,   // 表格类型
  IMAGE = 2,   // 图片类型
}

/**
 * 知识库状态
 */
export enum DatasetStatus {
  ENABLED = 1,   // 启用中
  DISABLED = 3,  // 未启用
}

/**
 * 分段策略
 */
export interface ChunkStrategy {
  chunk_type: 0 | 1;           // 0-自动分段，1-自定义
  separator?: string;          // 分段标识符（chunk_type=1 时必选）
  max_tokens?: number;         // 最大分段长度，100~2000
  remove_extra_spaces?: boolean;  // 是否自动过滤空格、换行符
  remove_urls_emails?: boolean;   // 是否自动过滤 URL 和邮箱
  caption_type?: 0 | 1;        // 0-自动标注，1-手工标注（图片知识库）
}

/**
 * 知识库信息
 */
export interface Dataset {
  name: string;
  dataset_id: string;
  space_id: string;
  description?: string;
  format_type: DatasetFormatType;
  status: DatasetStatus;
  can_edit: boolean;
  icon_uri?: string;
  icon_url?: string;
  avatar_url?: string;
  creator_id: string;
  creator_name: string;
  doc_count: number;
  slice_count: number;
  hit_count: number;
  bot_used_count: number;
  all_file_size: string;
  create_time: number;    // Unix 时间戳（秒）
  update_time: number;    // Unix 时间戳（秒）
  chunk_strategy: ChunkStrategy;
  file_list: string[];
  failed_file_list: string[];
  processing_file_list: string[];
  processing_file_id_list: string[];
}

/**
 * 创建知识库请求
 */
export interface CreateDatasetRequest {
  name: string;
  space_id: string;
  format_type: DatasetFormatType;
  description?: string;
  file_id?: string;  // 知识库图标
}

/**
 * 创建知识库响应
 */
export interface CreateDatasetResponse {
  dataset_id: string;
}

/**
 * 查询知识库列表请求
 */
export interface ListDatasetsRequest {
  space_id: string;
  name?: string;
  format_type?: DatasetFormatType;
  page_num?: number;
  page_size?: number;
}

/**
 * 查询知识库列表响应
 */
export interface ListDatasetsResponse {
  total_count: number;
  dataset_list: Dataset[];
}

/**
 * 修改知识库请求
 */
export interface UpdateDatasetRequest {
  name: string;
  file_id?: string;
  description?: string;
}

// --------------------------------------------
// 文件上传相关类型
// --------------------------------------------

/**
 * 上传的文件信息
 */
export interface UploadedFile {
  id: string;           // file_id
  bytes: number;
  file_name: string;
  created_at: number;   // Unix 时间戳（秒）
}

/**
 * 上传文件响应
 */
export interface UploadFileResponse {
  data: UploadedFile;
}

// --------------------------------------------
// 知识库文件相关类型
// --------------------------------------------

/**
 * 文件格式类型
 */
export enum DocumentFormatType {
  DOCUMENT = 0,  // 文档类型（txt、pdf、在线网页等）
  TABLE = 1,     // 表格类型
  PHOTO = 2,     // 照片类型
}

/**
 * 文件上传方式
 */
export enum DocumentSourceType {
  LOCAL_FILE = 0,    // 上传本地文件
  ONLINE_WEB = 1,    // 上传在线网页
  FILE_ID = 5,       // 通过上传文件 API
}

/**
 * 文件处理状态
 */
export enum DocumentStatus {
  PROCESSING = 0,  // 处理中
  COMPLETED = 1,   // 处理完毕
  FAILED = 9,      // 处理失败
}

/**
 * 文件源信息
 */
export interface SourceInfo {
  // 本地文件上传
  file_base64?: string;
  file_type?: string;  // pdf、txt、doc、docx

  // 在线网页上传
  web_url?: string;

  // file_id 上传
  source_file_id?: string;

  // 上传方式标识
  document_source?: DocumentSourceType;
}

/**
 * 更新规则（在线网页）
 */
export interface UpdateRule {
  update_type?: 0 | 1;   // 0-不自动更新，1-自动更新
  update_interval?: number;  // 更新频率（小时），最小 24
}

/**
 * 文档基础信息
 */
export interface DocumentBase {
  name: string;
  source_info: SourceInfo;
  update_rule?: UpdateRule;
  caption?: string;  // 图片描述（图片知识库）
}

/**
 * 文档信息
 */
export interface DocumentInfo {
  document_id: string;
  name: string;
  type: string;           // 文件后缀
  size: number;           // 文件大小（字节）
  format_type: DocumentFormatType;
  source_type: DocumentSourceType | null;
  status: DocumentStatus;
  slice_count: number;
  char_count: number;
  hit_count: number;
  create_time: number;    // Unix 时间戳（秒）
  update_time: number;    // Unix 时间戳（秒）
  update_type: number | null;     // 0-不自动更新，1-自动更新
  update_interval: number;        // 更新频率（小时）
  chunk_strategy: ChunkStrategy;
  tos_uri?: string;
}

/**
 * 创建知识库文件请求
 */
export interface CreateDocumentRequest {
  dataset_id: string;
  document_bases: DocumentBase[];
  chunk_strategy: ChunkStrategy;
  format_type: DatasetFormatType;
}

/**
 * 创建知识库文件响应
 */
export interface CreateDocumentResponse {
  document_infos: DocumentInfo[];
}

/**
 * 修改知识库文件请求
 */
export interface UpdateDocumentRequest {
  document_id: string;
  document_name?: string;
  update_rule?: UpdateRule;
}

/**
 * 查询文件列表请求
 */
export interface ListDocumentsRequest {
  dataset_id: string;
  page?: number;
  size?: number;
}

/**
 * 查询文件列表响应
 */
export interface ListDocumentsResponse {
  document_infos: DocumentInfo[];
  total: number;
}

/**
 * 删除文件请求
 */
export interface DeleteDocumentRequest {
  document_ids: string[];  // 最多 100 个
}

// --------------------------------------------
// 文件进度相关类型
// --------------------------------------------

/**
 * 文件上传进度
 */
export interface DocumentProgress {
  document_id: string;
  document_name: string;
  status: DocumentStatus;
  progress: number;          // 百分比
  remaining_time: number;    // 秒
  url: string;
  size: number;
  type: string;
  update_type: number;
  update_interval: number;
  status_descript?: string;  // 失败时的详细描述
}

/**
 * 获取文件进度请求
 */
export interface DocumentProgressRequest {
  dataset_id: string;
  document_ids: string[];
}

/**
 * 获取文件进度响应
 */
export interface DocumentProgressResponse {
  data: DocumentProgress[];
}

// --------------------------------------------
// 图片知识库相关类型
// --------------------------------------------

/**
 * 图片上传方式
 */
export enum ImageSourceType {
  LOCAL_FILE = 0,    // 上传本地文件
  ONLINE_WEB = 1,    // 上传在线网页
  FILE_ID = 5,       // 通过上传文件 API
}

/**
 * 图片信息
 */
export interface PhotoInfo {
  document_id: string;
  name: string;
  url: string;
  caption: string;
  type: string;            // jpg、png 等
  size: number;
  status: DocumentStatus;
  source_type: ImageSourceType;
  creator_id: string;
  create_time: number;     // Unix 时间戳（秒）
  update_time: number;     // Unix 时间戳（秒）
}

/**
 * 查询图片列表请求
 */
export interface ListImagesRequest {
  dataset_id: string;
  page_num?: number;
  page_size?: number;
  keyword?: string;
  has_caption?: boolean;
}

/**
 * 查询图片列表响应
 */
export interface ListImagesResponse {
  photo_infos: PhotoInfo[];
  total_count: number;
}

/**
 * 更新图片描述请求
 */
export interface UpdateImageCaptionRequest {
  caption: string;
}

// --------------------------------------------
// Mock 数据常量
// --------------------------------------------

export const MOCK_DATASET_ID = 'mock_dataset_123';
export const MOCK_DOCUMENT_ID = 'mock_document_456';
export const MOCK_FILE_ID = 'mock_file_789';
export const MOCK_SPACE_ID = 'mock_space_000';
export const MOCK_TIMESTAMP = 1234567890;
