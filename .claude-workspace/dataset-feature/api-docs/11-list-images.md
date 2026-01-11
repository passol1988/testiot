# 查询图片列表

调用此接口查看图片类知识库中图片的详细信息。

## 说明

- 查看图片时，支持通过图片的标注进行筛选
- 仅支持查看扣子知识库中的图片详细信息

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | GET |
| 请求地址 | `https://api.coze.cn/v1/datasets/:dataset_id/images` |
| 权限 | `listPhoto` |

## 请求参数

### Header

| 参数 | 取值 | 说明 |
|------|------|------|
| Authorization | `Bearer $Access_Token` | 用于验证客户端身份的访问令牌 |
| Content-Type | `application/json` | 请求正文的方式 |

### Path

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| dataset_id | String | 必选 | `744632974166804****` | 知识库 ID |

### Query

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| page_num | Integer | 可选 | `1` | 查看的页码，最小值为 1 |
| page_size | Integer | 可选 | `5` | 每页返回的数据量，1~299 |
| keyword | String | 可选 | `小猫` | 对图片描述进行搜索的关键字 |
| has_caption | Boolean | 可选 | `true` | 图片是否已设置了描述信息 |

## 返回参数

| 参数 | 类型 | 说明 |
|------|------|------|
| data | Object | 返回内容 |
| code | Long | 状态码 |
| msg | String | 状态信息 |
| detail | Object | 响应详情信息 |

### ListPhotoOpenApiData

| 参数 | 类型 | 说明 |
|------|------|------|
| photo_infos | Array | 图片的详细信息 |
| total_count | Integer | 符合查询条件的图片总数量 |

### PhotoInfo

| 参数 | 类型 | 说明 |
|------|------|------|
| document_id | String | 图片的 ID |
| name | String | 图片名 |
| url | String | 图片链接 |
| caption | String | 图片描述信息 |
| type | String | 文件格式（jpg、png 等） |
| size | Integer | 图片大小（字节） |
| status | Integer | 状态：0-处理中，1-完成，9-失败 |
| source_type | Integer | 上传方式：0-本地文件，1-在线网页，5-file_id |
| creator_id | String | 创建人的扣子 UID |
| create_time | Integer | 上传时间（Unix 时间戳） |
| update_time | Integer | 更新时间（Unix 时间戳） |

## 示例

### 请求示例

```bash
curl --location --request GET 'https://api.coze.cn/v1/datasets/744632974166804****/images?page_num=1&page_size=5&keyword=小猫&has_caption=true' \
--header 'Authorization: Bearer pat_hfwkehfncaf****' \
--header 'Content-Type: application/json'
```

### 返回示例

```json
{
  "detail": {
    "logid": "2024121015565741D31B341C9C0***"
  },
  "data": {
    "total_count": 1,
    "photo_infos": [
      {
        "name": "test2",
        "status": 1,
        "creator_id": "217526895615****",
        "create_time": 1733815232,
        "update_time": 1733817093,
        "size": 171340,
        "url": "https://lf26-appstore-sign.oceancloudapi.com/...",
        "caption": "小猫",
        "type": "jpg",
        "source_type": 5,
        "document_id": "744667080521911****"
      }
    ]
  },
  "code": 0,
  "msg": ""
}
```
