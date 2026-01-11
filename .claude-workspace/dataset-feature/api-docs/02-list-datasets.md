# 查询知识库列表

调用此接口查看指定空间资源库下的全部知识库。

此接口可查看工作空间下，空间资源库中的全部知识库，包括扣子知识库和火山知识库。

## 说明

- 暂不支持通过 API 查看低代码应用中的知识库
- 暂不支持通过该 API 查看火山知识库中的文件列表等详细信息

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | GET |
| 请求地址 | `https://api.coze.cn/v1/datasets` |
| 权限 | `listKnowledge` |

## 请求参数

### Header

| 参数 | 取值 | 说明 |
|------|------|------|
| Authorization | `Bearer $Access_Token` | 用于验证客户端身份的访问令牌 |
| Content-Type | `application/json` | 请求正文的方式 |

### Query

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| space_id | String | 必选 | `731121948439879****` | 知识库所在空间的 Space ID |
| name | String | 可选 | `知识库` | 知识库名称，支持模糊搜索 |
| format_type | Integer | 可选 | `2` | 类型：0-文本，1-表格，2-图片 |
| page_num | Integer | 可选 | `1` | 查看的页码，最小值为 1 |
| page_size | Integer | 可选 | `5` | 每页返回的数据量，1~300 |

## 返回参数

| 参数 | 类型 | 示例 | 说明 |
|------|------|------|------|
| data | Object | - | 接口响应的业务信息 |
| code | Long | `0` | 状态码 |
| msg | String | `""` | 状态信息 |
| detail | Object | - | 响应详情信息 |

### ListDatasetOpenApiData

| 参数 | 类型 | 说明 |
|------|------|------|
| total_count | Integer | 空间中的知识库总数量 |
| dataset_list | Array | 知识库详情 |

### Dataset

| 参数 | 类型 | 说明 |
|------|------|------|
| name | String | 知识库名称 |
| status | Integer | 状态：1-启用中，3-未启用 |
| can_edit | Boolean | 当前用户是否为该知识库的所有者 |
| icon_uri | String | 知识库图标的 uri |
| icon_url | String | 知识库图标的 URL |
| space_id | String | 知识库所在空间的空间 ID |
| doc_count | Integer | 知识库中的文件数量 |
| file_list | Array | 知识库中的文件列表 |
| hit_count | Integer | 知识库命中总次数 |
| avatar_url | String | 知识库创建者的头像 url |
| creator_id | String | 知识库创建者的扣子用户 UID |
| dataset_id | String | 知识库 ID |
| create_time | Integer | 知识库创建时间，秒级时间戳 |
| description | String | 知识库描述信息 |
| format_type | Integer | 类型：0-文本，1-表格，2-图片 |
| slice_count | Integer | 知识库分段总数 |
| update_time | Integer | 知识库的更新时间，秒级时间戳 |
| creator_name | String | 知识库创建者的用户名 |
| all_file_size | Long | 知识库中已存文件的总大小 |
| bot_used_count | Integer | 知识库已绑定的智能体数量 |
| chunk_strategy | Object | 知识库的切片规则 |

### ChunkStrategy

| 参数 | 类型 | 说明 |
|------|------|------|
| chunk_type | Integer | 0-自动分段，1-自定义 |
| separator | String | 分段标识符（chunk_type=1 时必选） |
| max_tokens | Long | 最大分段长度，100~2000 |
| remove_extra_spaces | Boolean | 是否自动过滤空格、换行符 |
| remove_urls_emails | Boolean | 是否自动过滤 URL 和邮箱 |
| caption_type | Integer | 图片标注方式：0-自动，1-手工 |

## 示例

### 请求示例

```bash
curl --location --request GET 'https://api.coze.cn/v1/datasets?space_id=731121948439879****&name=知识库&page_num=1&page_size=5' \
--header 'Authorization: Bearer pat_O******' \
--header 'Content-Type: application/json'
```

### 返回示例

```json
{
  "code": 0,
  "data": {
    "total_count": 1,
    "dataset_list": [
      {
        "name": "openapi_img3",
        "dataset_id": "744668935865830****",
        "format_type": 2,
        "description": "openapi",
        "status": 1,
        "can_edit": true,
        "space_id": "731121948439879****",
        "doc_count": 0,
        "slice_count": 0,
        "hit_count": 0,
        "bot_used_count": 0,
        "all_file_size": "0",
        "create_time": 1733817948,
        "update_time": 1733817948,
        "creator_id": "217526895615****",
        "creator_name": "xxx",
        "icon_uri": "FileBizType.BIZ_DATASET_ICON/217526895615****.jpg",
        "icon_url": "https://lf3-appstore-sign.oceancloudapi.com/...",
        "avatar_url": "https://p6-passport.byteacctimg.com/img/...~300x300.image",
        "chunk_strategy": {},
        "file_list": [],
        "failed_file_list": [],
        "processing_file_list": [],
        "processing_file_id_list": []
      }
    ]
  },
  "msg": "",
  "detail": {
    "logid": "20241210161217C90C9ABB86428***"
  }
}
```
