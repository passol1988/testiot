# 创建知识库文件

调用此 API 向指定的扣子知识库上传文件。

## 接口说明

- 通过此 API，你可以向文本或图片知识库中上传文件
- 暂不支持通过 API 创建表格知识库
- 本 API 仅适用于扣子知识库，不适用于火山知识库
- 上传图片到图片知识库时，可以通过 caption_type 参数设置系统标注或手动标注

## 支持的上传方式

| 上传方式 | 文本知识库 | 图片知识库 |
|----------|------------|------------|
| Base64 上传本地文件 | ✅ PDF、TXT、DOC、DOCX | ❌ |
| 上传在线网页 | ✅ | ❌ |
| 通过上传文件 API 上传 | ❌ | ✅ |

## 注意事项

- 每次最多可上传 10 个文件
- 必须上传和知识库类型匹配的文件
- 每个请求只能选择一种上传方式
- 仅知识库的所有者可以向知识库中上传文件

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | POST |
| 请求地址 | `https://api.coze.cn/open_api/knowledge/document/create` |
| 权限 | `createDocument` |

## 请求参数

### Header

| 参数 | 取值 | 说明 |
|------|------|------|
| Authorization | `Bearer $Access_Token` | 用于验证客户端身份的访问令牌 |
| Content-Type | `application/json` | 请求正文的方式 |
| Agw-Js-Conv | `str` | 防止丢失数字类型参数的精度 |

### Body

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| dataset_id | String | 必选 | `736356924530694****` | 扣子知识库 ID |
| document_bases | Array | 必选 | - | 待上传文件的元数据信息，最多 10 个 |
| chunk_strategy | Object | 必选 | - | 分段规则 |
| format_type | Integer | 必选 | `2` | 知识库类型：0-文本，2-图片 |

### DocumentBase

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| name | String | 必选 | `Coze.pdf` | 文件名称 |
| source_info | Object | 必选 | - | 文件的元数据信息 |
| update_rule | Object | 可选 | - | 在线网页的更新策略 |
| caption | String | 可选 | `可爱的` | 图片描述（图片知识库） |

### SourceInfo

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| file_base64 | String | 可选 | - | 本地文件的 Base64 编码 |
| file_type | String | 可选 | `pdf` | 文件格式：PDF、TXT、DOC、DOCX |
| web_url | String | 可选 | - | 网页的 URL 地址 |
| document_source | Integer | 可选 | - | 0-本地文件，1-在线网页，5-file_id |
| source_file_id | String | 可选 | - | 通过上传文件接口获取的文件 ID |

### UpdateRule

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| update_type | Integer | 可选 | `1` | 0-不自动更新，1-自动更新 |
| update_interval | Integer | 可选 | `24` | 更新频率（小时），最小 24 |

### ChunkStrategy

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| chunk_type | Integer | 可选 | `0` | 0-自动分段，1-自定义 |
| separator | String | 可选 | `#` | 分段标识符 |
| max_tokens | Long | 可选 | `800` | 最大分段长度，100~2000 |
| remove_extra_spaces | Boolean | 可选 | `true` | 是否自动过滤空格、换行符 |
| remove_urls_emails | Boolean | 可选 | `true` | 是否自动过滤 URL 和邮箱 |
| caption_type | Integer | 可选 | `0` | 0-自动标注，1-手工标注 |

## 返回参数

| 参数 | 类型 | 说明 |
|------|------|------|
| document_infos | Array | 已上传文件的基本信息 |
| code | Long | 状态码 |
| msg | String | 状态信息 |
| detail | Object | 响应详情信息 |

### DocumentInfo

| 参数 | 类型 | 说明 |
|------|------|------|
| document_id | String | 文件的 ID |
| name | String | 文件的名称 |
| type | String | 文件格式 |
| size | Integer | 文件大小（字节） |
| format_type | Integer | 格式类型：0-文档，1-表格，2-照片 |
| source_type | Integer | 上传方式：0-本地，1-网页 |
| status | Integer | 状态：0-处理中，1-完成，9-失败 |
| slice_count | Integer | 分段数量 |
| char_count | Integer | 字符数量 |
| hit_count | Integer | 命中次数 |
| create_time | Integer | 上传时间（Unix 时间戳） |
| update_time | Integer | 更新时间（Unix 时间戳） |
| update_type | Integer | 0-不自动更新，1-自动更新 |
| update_interval | Integer | 更新频率（小时） |
| chunk_strategy | Object | 分段规则 |
| tos_uri | String | 文档唯一标识 |

## 示例

### 请求示例（上传本地文件）

```bash
curl --location --request POST 'https://api.coze.cn/open_api/knowledge/document/create' \
--header 'Authorization: Bearer pat_O******' \
--header 'Content-Type: application/json' \
--data-raw '{
  "dataset_id": "736356924530694****",
  "document_bases": [
    {
      "name": "Coze.pdf",
      "source_info": {
        "file_base64": "5rWL6K+V5LiA5LiL5ZOm",
        "file_type": "pdf"
      }
    }
  ],
  "chunk_strategy": {
    "separator": "\n\n",
    "max_tokens": 800,
    "remove_extra_spaces": false,
    "remove_urls_emails": false,
    "chunk_type": 1
  }
}'
```

### 返回示例

```json
{
  "document_infos": [
    {
      "document_id": "738694205603010****",
      "name": "Coze.pdf",
      "type": "pdf",
      "size": 14164,
      "format_type": 0,
      "status": 1,
      "slice_count": 1,
      "create_time": 1719907964,
      "update_time": 1719907969,
      "chunk_strategy": {
        "chunk_type": 1,
        "max_tokens": 800,
        "separator": "\n\n"
      }
    }
  ],
  "code": 0,
  "msg": ""
}
```
