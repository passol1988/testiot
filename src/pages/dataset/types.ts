/**
 * 知识库管理 - 类型定义
 * Dataset Manager Type Definitions
 */

// ==================== API 类型 ====================

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
export interface DatasetInfo {
  dataset_id: string;
  name: string;
  description?: string;
  format_type: DatasetFormatType;
  status: DatasetStatus;
  can_edit: boolean;
  space_id: string;
  doc_count: number;          // 文档数量
  slice_count: number;        // 分段数量
  hit_count: number;          // 命中次数
  bot_used_count: number;     // 使用该知识库的智能体数量
  all_file_size: number;      // 总文件大小
  create_time: number;        // Unix 时间戳（秒）
  update_time: number;        // Unix 时间戳（秒）
  creator_id: string;
  creator_name: string;
  icon_uri?: string;
  icon_url?: string;
  avatar_url?: string;
  chunk_strategy: ChunkStrategy;
  file_list: string[];
  failed_file_list: string[];
  processing_file_list: string[];
  processing_file_id_list: string[];
}

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
  update_type: 0 | 1;   // 0-不自动更新，1-自动更新
  update_interval: number;  // 更新频率（小时），最小 24
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
  slice_count: number;    // 分段数量
  char_count: number;     // 字符数量
  hit_count: number;      // 命中次数
  create_time: number;    // Unix 时间戳（秒）
  update_time: number;    // Unix 时间戳（秒）
  update_type: number | null;     // 0-不自动更新，1-自动更新
  update_interval: number;        // 更新频率（小时）
  chunk_strategy: ChunkStrategy;
  tos_uri?: string;
}

/**
 * 文件上传进度
 */
export interface DocumentProgress {
  document_id: string;
  document_name: string;
  status: DocumentStatus;
  progress: number;          // 百分比 0-100
  remaining_time: number;    // 剩余时间（秒）
  url: string;
  size: number;
  type: string;
  update_type: number;
  update_interval: number;
  status_descript?: string;  // 失败时的详细描述
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
  source_type: DocumentSourceType;
  creator_id: string;
  create_time: number;     // Unix 时间戳（秒）
  update_time: number;     // Unix 时间戳（秒）
}

// ==================== 表单类型 ====================

/**
 * 知识库表单数据
 */
export interface DatasetFormData {
  name: string;
  description?: string;
  icon_file_id?: string;
  format_type: DatasetFormatType;
  caption_type?: 0 | 1;  // 图片知识库的标注方式
}

/**
 * 文件上传表单数据
 */
export interface FileUploadFormData {
  files: File[];
  webUrl?: string;
  documentName?: string;
  caption?: string;  // 图片描述
  captionInputMode?: 0 | 1;  // 0-系统自动，1-手工输入
}

// ==================== 组件 Props 类型 ====================

/**
 * DatasetList Props
 */
export interface DatasetListProps {
  datasets: DatasetInfo[];
  loading: boolean;
  onEdit: (datasetId: string) => void;
  onDelete: (dataset: DatasetInfo) => void;
  onManage: (datasetId: string) => void;
}

/**
 * DatasetCard Props
 */
export interface DatasetCardProps {
  dataset: DatasetInfo;
  onEdit: (datasetId: string) => void;
  onDelete: (dataset: DatasetInfo) => void;
  onManage: (datasetId: string) => void;
}

/**
 * DatasetForm Props
 */
export interface DatasetFormProps {
  mode: 'create' | 'edit';
  datasetId?: string;
  initialValues?: Partial<DatasetFormData>;
  onSubmit: (data: DatasetFormData) => Promise<string | null>;
  onCancel: () => void;
  uploadFile?: (file: File) => Promise<string | null>;
}

/**
 * DatasetDetail Props
 */
export interface DatasetDetailProps {
  datasetId: string;
  dataset?: DatasetInfo | null;
  onBack: () => void;
  onEdit: () => void;
}

/**
 * FileList Props
 */
export interface FileListProps {
  datasetId: string;
  formatType: DatasetFormatType;
  onUpload: () => void;
  onRefresh: () => void;
  fetchDocuments?: (datasetId: string, page?: number) => Promise<DocumentInfo[]>;
  deleteDocuments?: (documentIds: string[]) => Promise<boolean>;
  updateDocument?: (documentId: string, data: { document_name?: string; update_rule?: UpdateRule }) => Promise<boolean>;
}

/**
 * ImageGrid Props
 */
export interface ImageGridProps {
  datasetId: string;
  captionType: 0 | 1;
  onUpload: () => void;
  onRefresh: () => void;
  onUpdateCaption: (documentId: string, caption: string) => Promise<boolean>;
  fetchImages?: (datasetId: string, page?: number) => Promise<PhotoInfo[]>;
  deleteImages?: (documentIds: string[]) => Promise<boolean>;
}

/**
 * FileUploadModal Props
 */
export interface FileUploadModalProps {
  visible: boolean;
  datasetId: string;
  formatType: DatasetFormatType;
  captionType?: 0 | 1;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * UploadProgressModal Props
 */
export interface UploadProgressModalProps {
  visible: boolean;
  progressData: DocumentProgress[];
}

/**
 * DatasetSelector Props
 */
export interface DatasetSelectorProps {
  value?: string[];
  onChange: (datasetIds: string[]) => void;
  disabled?: boolean;
  datasets?: DatasetInfo[];
}

/**
 * ConfirmDeleteModal Props
 */
export interface ConfirmDeleteModalProps {
  visible: boolean;
  type: 'dataset' | 'document';
  count: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

// ==================== Hook 返回类型 ====================

/**
 * useDatasetApi Hook 返回值
 */
export interface UseDatasetApiReturn {
  loading: boolean;
  datasets: DatasetInfo[];

  // 知识库操作
  fetchDatasets: () => Promise<void>;
  createDataset: (data: DatasetFormData) => Promise<string | null>;
  updateDataset: (datasetId: string, data: Partial<DatasetFormData>) => Promise<boolean>;
  deleteDataset: (datasetId: string) => Promise<boolean>;

  // 文件操作
  fetchDocuments: (datasetId: string, page?: number) => Promise<DocumentInfo[]>;
  fetchImages: (datasetId: string, page?: number) => Promise<PhotoInfo[]>;
  createDocument: (datasetId: string, data: DocumentBase[], formatType: DatasetFormatType) => Promise<string[] | null>;
  updateDocument: (documentId: string, data: { document_name?: string; update_rule?: UpdateRule }) => Promise<boolean>;
  deleteDocuments: (documentIds: string[]) => Promise<boolean>;
  fetchDocumentProgress: (datasetId: string, documentIds: string[]) => Promise<DocumentProgress[]>;

  // 上传操作
  uploadFile: (file: File) => Promise<string | null>;
  updateImageCaption: (documentId: string, caption: string) => Promise<boolean>;
}

/**
 * useDocumentUpload Hook 返回值
 */
export interface UseDocumentUploadReturn {
  uploading: boolean;
  progressData: DocumentProgress[];
  progressModalVisible: boolean;

  uploadDocuments: (
    datasetId: string,
    files: File[],
    formatType: DatasetFormatType,
    captionType?: 0 | 1,
    caption?: string
  ) => Promise<void>;

  uploadImages: (
    datasetId: string,
    files: File[],
    captionType: 0 | 1,
    captions?: string[]
  ) => Promise<void>;

  uploadWebPage: (
    datasetId: string,
    webUrl: string,
    documentName: string
  ) => Promise<void>;

  hideProgressModal: () => void;
}
