# 知识库 API 配置摘要

## API 列表

### 知识库管理
| API | 方法 | 说明 |
|-----|------|------|
| [创建知识库](./01-create-dataset.md) | POST | 创建文本或图片知识库 |
| [查询知识库列表](./02-list-datasets.md) | GET | 查看空间下所有知识库 |
| [修改知识库](./03-update-dataset.md) | PUT | 修改知识库信息 |
| [删除知识库](./04-delete-dataset.md) | DELETE | 删除知识库 |

### 文件管理
| API | 方法 | 说明 |
|-----|------|------|
| [上传文件](./05-upload-files.md) | POST | 上传文件获取 file_id |
| [创建知识库文件](./06-create-document.md) | POST | 向知识库上传文件/网页 |
| [修改知识库文件](./07-update-document.md) | POST | 修改文件名称和更新策略 |
| [查询文件列表](./08-list-documents.md) | POST | 查看知识库文件列表 |
| [删除文件](./09-delete-document.md) | POST | 批量删除知识库文件 |
| [获取文件进度](./10-document-progress.md) | POST | 获取文件上传进度 |

### 图片知识库特有
| API | 方法 | 说明 |
|-----|------|------|
| [查询图片列表](./11-list-images.md) | GET | 查看图片知识库图片详情 |
| [更新图片描述](./12-update-image-caption.md) | PUT | 更新图片的标注信息 |

## Base URL
```
https://api.coze.cn
```

## 认证方式
```
Authorization: Bearer $Access_Token
```

## 权限要求
| 权限 | 说明 |
|------|------|
| createKnowledge | 创建知识库 |
| listKnowledge | 查询知识库列表 |
| update | 修改知识库 |
| delete | 删除知识库 |
| uploadFile | 上传文件 |
| createDocument | 创建知识库文件 |
| updateDocument | 修改知识库文件 |
| listDocument | 查询知识库文件列表 |
| deleteDocument | 删除知识库文件 |
| readDocumentProgress | 读取文件处理进度 |
| listPhoto | 查看图片列表 |
| updatePhoto | 更新图片描述 |

## 知识库类型
| 值 | 说明 |
|----|------|
| 0 | 文本类型 |
| 1 | 表格类型 |
| 2 | 图片类型 |

## 文件状态
| 值 | 说明 |
|----|------|
| 0 | 处理中 |
| 1 | 处理完毕 |
| 9 | 处理失败 |

## Mock 字段
需要 Mock 的字段用于测试：
- `dataset_id` - 知识库 ID，如 `mock_dataset_123`
- `document_id` - 文件 ID，如 `mock_document_456`
- `file_id` - 文件 ID，如 `mock_file_789`
- `space_id` - 空间 ID，如 `mock_space_000`
- `create_time` / `update_time` - Unix 时间戳，如 `1234567890`
