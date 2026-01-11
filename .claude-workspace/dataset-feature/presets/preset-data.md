# 预设数据 (Preset Data)

> 本文档记录知识库功能的预设数据，用于开发测试和 Mock 响应。

---

## Mock 常量

```typescript
const MOCK = {
  DATASET_ID: 'mock_dataset_123',
  DOCUMENT_ID: 'mock_document_456',
  FILE_ID: 'mock_file_789',
  SPACE_ID: 'mock_space_000',
  TIMESTAMP: 1234567890,
};
```

---

## 1. 创建知识库 (Create Dataset)

### 请求示例

```json
{
  "name": "产品文档",
  "description": "这是我的产品知识库",
  "space_id": "{{SPACE_ID}}",
  "format_type": 0,
  "file_id": "{{FILE_ID}}"
}
```

### 响应示例

```json
{
  "code": 0,
  "data": {
    "dataset_id": "{{DATASET_ID}}"
  },
  "msg": "",
  "detail": {
    "logid": "mock_logid_create_dataset"
  }
}
```

---

## 2. 查询知识库列表 (List Datasets)

### 请求示例

```json
{
  "space_id": "{{SPACE_ID}}",
  "page_num": 1,
  "page_size": 10
}
```

### 响应示例

```json
{
  "code": 0,
  "data": {
    "total_count": 2,
    "dataset_list": [
      {
        "dataset_id": "{{DATASET_ID}}",
        "name": "产品文档",
        "description": "这是我的产品知识库",
        "format_type": 0,
        "status": 1,
        "can_edit": true,
        "space_id": "{{SPACE_ID}}",
        "doc_count": 5,
        "slice_count": 120,
        "hit_count": 42,
        "bot_used_count": 3,
        "all_file_size": "1048576",
        "create_time": 1733817948,
        "update_time": 1733817948,
        "creator_id": "user_001",
        "creator_name": "测试用户",
        "icon_uri": "FileBizType.BIZ_DATASET_ICON/icon.jpg",
        "icon_url": "https://example.com/icon.jpg",
        "avatar_url": "https://example.com/avatar.jpg",
        "chunk_strategy": {
          "chunk_type": 0
        },
        "file_list": ["doc1.pdf", "doc2.pdf"],
        "failed_file_list": [],
        "processing_file_list": [],
        "processing_file_id_list": []
      }
    ]
  },
  "msg": ""
}
```

---

## 3. 上传文件 (Upload File)

### 请求示例

```bash
curl -X POST 'https://api.coze.cn/v1/files/upload' \
  -H 'Authorization: Bearer {{TOKEN}}' \
  -F 'file=@/path/to/file.pdf'
```

### 响应示例

```json
{
  "code": 0,
  "data": {
    "id": "{{FILE_ID}}",
    "bytes": 524288,
    "file_name": "document.pdf",
    "created_at": {{TIMESTAMP}}
  },
  "msg": ""
}
```

---

## 4. 创建知识库文件 (Create Document)

### 请求示例 (Base64 上传本地文件)

```json
{
  "dataset_id": "{{DATASET_ID}}",
  "document_bases": [
    {
      "name": "API文档.pdf",
      "source_info": {
        "file_base64": "JVBERi0xLjQKJ...",
        "file_type": "pdf"
      }
    }
  ],
  "chunk_strategy": {
    "chunk_type": 1,
    "separator": "\n\n",
    "max_tokens": 800,
    "remove_extra_spaces": true,
    "remove_urls_emails": false
  },
  "format_type": 0
}
```

### 请求示例 (在线网页)

```json
{
  "dataset_id": "{{DATASET_ID}}",
  "document_bases": [
    {
      "name": "Coze官方文档",
      "source_info": {
        "web_url": "https://docs.coze.cn",
        "document_source": 1
      },
      "update_rule": {
        "update_type": 1,
        "update_interval": 24
      }
    }
  ],
  "chunk_strategy": {
    "chunk_type": 0
  },
  "format_type": 0
}
```

### 请求示例 (通过 file_id 上传图片)

```json
{
  "dataset_id": "{{DATASET_ID}}",
  "document_bases": [
    {
      "name": "产品截图",
      "source_info": {
        "source_file_id": "{{FILE_ID}}",
        "document_source": 5
      },
      "caption": "这是一个产品界面截图"
    }
  ],
  "chunk_strategy": {
    "chunk_type": 0,
    "caption_type": 1
  },
  "format_type": 2
}
```

### 响应示例

```json
{
  "code": 0,
  "document_infos": [
    {
      "document_id": "{{DOCUMENT_ID}}",
      "name": "API文档.pdf",
      "type": "pdf",
      "size": 1048576,
      "format_type": 0,
      "source_type": 0,
      "status": 1,
      "slice_count": 15,
      "char_count": 5200,
      "hit_count": 0,
      "create_time": {{TIMESTAMP}},
      "update_time": {{TIMESTAMP}},
      "update_type": 0,
      "update_interval": 0,
      "chunk_strategy": {
        "chunk_type": 1,
        "separator": "\n\n",
        "max_tokens": 800,
        "remove_extra_spaces": true,
        "remove_urls_emails": false
      },
      "tos_uri": "FileBizType.BIZ_BOT_DATASET/document.pdf"
    }
  ],
  "msg": "",
  "detail": {
    "logid": "mock_logid_create_document"
  }
}
```

---

## 5. 查询文件列表 (List Documents)

### 请求示例

```json
{
  "dataset_id": "{{DATASET_ID}}",
  "page": 1,
  "size": 10
}
```

### 响应示例

```json
{
  "code": 0,
  "document_infos": [
    {
      "document_id": "{{DOCUMENT_ID}}",
      "name": "API文档.pdf",
      "type": "pdf",
      "size": 1048576,
      "format_type": 0,
      "source_type": 0,
      "status": 1,
      "slice_count": 15,
      "char_count": 5200,
      "hit_count": 8,
      "create_time": {{TIMESTAMP}},
      "update_time": {{TIMESTAMP}},
      "update_type": 0,
      "update_interval": 0,
      "chunk_strategy": {
        "chunk_type": 1
      }
    }
  ],
  "msg": "",
  "total": 1
}
```

---

## 6. 获取文件上传进度 (Document Progress)

### 请求示例

```json
{
  "document_ids": ["{{DOCUMENT_ID}}"]
}
```

### 响应示例

```json
{
  "code": 0,
  "data": {
    "data": [
      {
        "document_id": "{{DOCUMENT_ID}}",
        "document_name": "API文档.pdf",
        "status": 1,
        "progress": 100,
        "remaining_time": 0,
        "url": "https://example.com/document.pdf",
        "size": 1048576,
        "type": "pdf",
        "update_type": 0,
        "update_interval": 0
      }
    ]
  },
  "msg": ""
}
```

---

## 7. 查询图片列表 (List Images) - 图片知识库特有

### 请求示例

```bash
curl -X GET 'https://api.coze.cn/v1/datasets/{{DATASET_ID}}/images?page_num=1&page_size=10'
```

### 响应示例

```json
{
  "code": 0,
  "data": {
    "total_count": 1,
    "photo_infos": [
      {
        "document_id": "{{DOCUMENT_ID}}",
        "name": "产品截图",
        "url": "https://example.com/image.jpg",
        "caption": "这是一个产品界面截图",
        "type": "jpg",
        "size": 204800,
        "status": 1,
        "source_type": 5,
        "creator_id": "user_001",
        "create_time": {{TIMESTAMP}},
        "update_time": {{TIMESTAMP}}
      }
    ]
  },
  "msg": ""
}
```

---

## 8. 更新图片描述 (Update Image Caption)

### 请求示例

```json
{
  "caption": "更新后的图片描述"
}
```

### 响应示例

```json
{
  "code": 0,
  "msg": "",
  "detail": {
    "logid": "mock_logid_update_caption"
  }
}
```

---

## 知识库类型枚举

| 值 | 说明 |
|----|------|
| 0 | 文本类型 |
| 1 | 表格类型 |
| 2 | 图片类型 |

## 文件状态枚举

| 值 | 说明 |
|----|------|
| 0 | 处理中 |
| 1 | 处理完毕 |
| 9 | 处理失败 |

## 文件上传方式枚举

| 值 | 说明 |
|----|------|
| 0 | 上传本地文件 (Base64) |
| 1 | 上传在线网页 |
| 5 | 通过上传文件 API (file_id) |
