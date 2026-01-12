# 知识库管理功能 - 开发者指南

> **版本**: 1.0
> **更新日期**: 2025-01-12

---

## 目录

1. [架构概述](#1-架构概述)
2. [技术栈](#2-技术栈)
3. [项目结构](#3-项目结构)
4. [核心组件](#4-核心组件)
5. [API 集成](#5-api-集成)
6. [状态管理](#6-状态管理)
7. [样式系统](#7-样式系统)
8. [开发指南](#8-开发指南)

---

## 1. 架构概述

知识库管理功能基于 React 18 + TypeScript 构建，使用 Ant Design 5 作为 UI 组件库，集成 Coze API SDK 进行后端交互。

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Pages     │  │ Components  │  │      Hooks          │ │
│  │  - Dataset  │  │  - Forms    │  │  - useDatasetApi    │ │
│  │  - Detail   │  │  - Lists    │  │  - useDocumentUpload│ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                    │             │
│         └────────────────┴────────────────────┘             │
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │   Types     │                           │
│                   │  - Models   │                           │
│                   │  - Props    │                           │
│                   └──────┬──────┘                           │
├──────────────────────────┼──────────────────────────────────┤
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │  Coze API   │                           │
│                   │    SDK      │                           │
│                   └──────┬──────┘                           │
├──────────────────────────┼──────────────────────────────────┤
│                          │                                   │
│              ┌───────────▼────────────┐                      │
│              │   Vite Dev Proxy       │                      │
│              │   /api/coze →          │                      │
│              │   https://api.coze.cn  │                      │
│              └────────────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Coze API       │
                    │  Backend        │
                    └─────────────────┘
```

---

## 2. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18.3 | UI 框架 |
| **TypeScript** | 5.x | 类型安全 |
| **Vite** | 5.x | 构建工具 |
| **Ant Design** | 5.21 | UI 组件库 |
| **React Router** | 6.28 | 路由管理 |
| **@coze/api** | Latest | Coze API SDK |

---

## 3. 项目结构

```
src/pages/dataset/
├── components/              # 组件目录
│   ├── DatasetCard.tsx      # 知识库卡片
│   ├── DatasetForm.tsx      # 创建/编辑表单
│   ├── DatasetList.tsx      # 知识库列表
│   ├── DatasetDetail.tsx    # 知识库详情
│   ├── FileList.tsx         # 文件列表（文本）
│   ├── ImageGrid.tsx        # 图片列表（图片）
│   ├── FileUploadModal.tsx  # 上传弹窗
│   ├── UploadProgressModal.tsx  # 进度弹窗
│   └── DatasetSelector.tsx  # 知识库选择器
├── hooks/                   # Hooks 目录
│   ├── use-dataset-api.ts   # API 调用 Hook
│   └── use-document-upload.ts  # 文件上传 Hook
├── utils/                   # 工具函数
│   ├── constants.ts         # 常量定义
│   └── prompt-template.ts   # Prompt 模板
├── types.ts                 # 类型定义
├── index.tsx                # 页面入口
└── styles.ts                # 样式导出
```

---

## 4. 核心组件

### 4.1 DatasetList

知识库列表页，展示所有知识库卡片。

```typescript
interface DatasetListProps {
  datasets: DatasetInfo[];
  loading: boolean;
  onEdit: (datasetId: string) => void;
  onDelete: (dataset: DatasetInfo) => void;
  onManage: (datasetId: string) => void;
}
```

**关键功能**：
- 响应式网格布局
- 搜索和筛选
- 分页显示

### 4.2 DatasetCard

知识库卡片组件。

```typescript
interface DatasetCardProps {
  dataset: DatasetInfo;
  onEdit: (datasetId: string) => void;
  onDelete: (dataset: DatasetInfo) => void;
  onManage: (datasetId: string) => void;
}
```

### 4.3 DatasetDetail

知识库详情页，包含基本信息和文件管理。

```typescript
interface DatasetDetailProps {
  datasetId: string;
  dataset?: DatasetInfo | null;
  onBack: () => void;
  onEdit: () => void;
}
```

**核心逻辑**：
- 根据 `format_type` 切换文件/图片管理
- 标签页管理（文件管理、基本信息）

### 4.4 FileList

文本知识库的文件列表。

```typescript
interface FileListProps {
  datasetId: string;
  formatType: DatasetFormatType;
  onUpload: () => void;
  onRefresh: () => void;
  fetchDocuments?: (datasetId: string, page?: number) => Promise<DocumentInfo[]>;
  deleteDocuments?: (documentIds: string[]) => Promise<boolean>;
  updateDocument?: (documentId: string, data: { document_name?: string; update_rule?: UpdateRule }) => Promise<boolean>;
}
```

### 4.5 ImageGrid

图片知识库的图片列表（列表布局）。

```typescript
interface ImageGridProps {
  datasetId: string;
  captionType: 0 | 1;
  onUpload: () => void;
  onRefresh: () => void;
  onUpdateCaption: (documentId: string, caption: string) => Promise<boolean>;
  fetchImages?: (datasetId: string, page?: number) => Promise<PhotoInfo[]>;
  deleteImages?: (documentIds: string[]) => Promise<boolean>;
}
```

---

## 5. API 集成

### 5.1 Coze API 配置

```typescript
const getCozeApi = (): CozeAPI | null => {
  const auth = getAuth();
  if (!auth || !auth.pat) return null;

  const isDev = import.meta.env.DEV;
  const baseURL = isDev ? '/api/coze' : 'https://api.coze.cn';

  return new CozeAPI({
    baseURL,
    token: auth.pat,
    allowPersonalAccessTokenInBrowser: true,
  });
};
```

### 5.2 Vite 代理配置

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api/coze': {
        target: 'https://api.coze.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coze/, ''),
      },
    },
  },
});
```

### 5.3 主要 API 方法

| 方法 | 参数 | 返回值 |
|------|------|--------|
| `datasets.list` | space_id, page_num, page_size | DatasetList |
| `datasets.create` | space_id, name, description, format_type | DatasetInfo |
| `datasets.update` | dataset_id, name, description, file_id | boolean |
| `datasets.delete` | dataset_id | boolean |
| `documents.list` | dataset_id, page, page_size | DocumentInfo[] |
| `documents.create` | dataset_id, document_bases, chunk_strategy | DocumentInfo[] |
| `documents.update` | document_id, document_name, update_rule | boolean |
| `documents.delete` | document_ids | boolean |
| `images.list` | dataset_id, page_num, page_size | PhotoInfo[] |
| `images.update` | dataset_id, document_id, caption | boolean |
| `files.upload` | file | FileUploadResult |

---

## 6. 状态管理

### 6.1 useDatasetApi Hook

```typescript
const {
  loading,
  datasets,
  fetchDatasets,
  createDataset,
  updateDataset,
  deleteDataset,
  fetchDocuments,
  fetchImages,
  createDocument,
  updateDocument,
  deleteDocuments,
  fetchDocumentProgress,
  uploadFile,
  updateImageCaption,
} = useDatasetApi();
```

### 6.2 useDocumentUpload Hook

处理文件上传和进度轮询。

```typescript
const {
  uploading,
  progressData,
  progressModalVisible,
  uploadDocuments,
  uploadImages,
  uploadWebPage,
  hideProgressModal,
} = useDocumentUpload();
```

**核心逻辑**：
1. 调用 `documents.create` API
2. 获取返回的 `document_id` 列表
3. 启动进度轮询（1 秒间隔）
4. 轮询直到所有文件完成或失败
5. 显示进度弹窗

---

## 7. 样式系统

### 7.1 复用 Bot Manager 样式

```typescript
import styles from '../bot-manager/styles';

// 使用示例
<div style={styles.containerStyles.botManagerContainer}>
  <Button style={styles.buttonStyles.botBtnPrimary}>
    创建
  </Button>
</div>
```

### 7.2 主要样式 Token

```css
:root {
  --primary-gradient: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  --page-bg-gradient: linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 100%);
  --card-radius: 16px;
  --btn-radius: 20px;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --card-shadow-hover: 0 8px 24px rgba(255, 107, 107, 0.15);
}
```

### 7.3 动画效果

```css
@keyframes wave {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## 8. 开发指南

### 8.1 添加新的知识库类型

1. 在 `types.ts` 中添加新的 `DatasetFormatType` 值
2. 更新 `constants.ts` 中的 `DATASET_TYPE_OPTIONS`
3. 在 `DatasetDetail` 中添加对应的文件管理组件
4. 更新 API 调用以支持新类型

### 8.2 添加新的文件操作

1. 在 `use-dataset-api.ts` 中添加新的 API 方法
2. 更新 `types.ts` 中的接口定义
3. 在对应的组件（FileList/ImageGrid）中添加操作按钮
4. 实现操作逻辑和错误处理

### 8.3 自定义进度轮询

修改 `use-document-upload.ts` 中的轮询逻辑：

```typescript
// 修改轮询间隔
const POLL_INTERVAL = 1000; // 毫秒

// 修改最大轮询时间
const MAX_POLL_DURATION = 5 * 60 * 1000; // 5 分钟
```

### 8.4 调试技巧

**开启详细日志**：
```typescript
// 在组件中添加
useEffect(() => {
  console.log('Documents:', documents);
  console.log('Progress:', progressData);
}, [documents, progressData]);
```

**检查网络请求**：
1. 打开浏览器开发者工具
2. 切换到 Network 标签
3. 筛选 `/api/coze` 请求
4. 查看请求和响应详情

### 8.5 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| CORS 错误 | 开发环境代理未配置 | 检查 vite.config.ts |
| API 调用失败 | PAT 无效 | 重新登录 |
| 文件一直处理中 | 进度轮询停止 | 检查 `fetchDocumentProgress` |
| 类型错误 | SDK 类型不匹配 | 添加类型断言 |

---

## 9. 类型定义参考

### 9.1 DatasetInfo

```typescript
export interface DatasetInfo {
  dataset_id: string;
  name: string;
  description?: string;
  format_type: DatasetFormatType;
  status: DatasetStatus;
  can_edit: boolean;
  space_id: string;
  doc_count: number;
  slice_count: number;
  hit_count: number;
  bot_used_count: number;
  all_file_size: number;
  create_time: number;
  update_time: number;
  creator_id: string;
  creator_name: string;
  icon_uri?: string;
  icon_url?: string;
  avatar_url?: string;
  chunk_strategy: ChunkStrategy;
}
```

### 9.2 DocumentInfo

```typescript
export interface DocumentInfo {
  document_id: string;
  name: string;
  type: string;
  size: number;
  format_type: DocumentFormatType;
  source_type: DocumentSourceType | null;
  status: DocumentStatus;
  slice_count: number;
  char_count: number;
  hit_count: number;
  create_time: number;
  update_time: number;
  update_type: number | null;
  update_interval: number;
  chunk_strategy: ChunkStrategy;
  tos_uri?: string;
}
```

---

*最后更新：2025-01-12*
