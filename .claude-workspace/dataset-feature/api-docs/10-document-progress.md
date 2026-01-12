# 获取文件上传进度

调用此接口获取扣子知识库文件的上传进度。

## 说明

- 支持查看所有类型知识库文件的上传进度
- 支持批量查看多个文件的进度
- 仅支持查看扣子知识库中的文件上传进度

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | POST |
| 请求地址 | `https://api.coze.cn/v1/datasets/:dataset_id/process` |
| 权限 | `readDocumentProgress` |

## 请求参数

### Header

| 参数 | 取值 | 说明 |
|------|------|------|
| Authorization | `Bearer $Access_Token` | 用于验证客户端身份的访问令牌 |
| Content-Type | `application/json` | 请求正文的方式 |

### Path

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| dataset_id | String | 必选 | `744258581358768****` | 扣子知识库 ID |

### Body

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| document_ids | Array | 必选 | `["744258581358768****"]` | 需要获取上传进度的文件 ID 列表 |

## 返回参数

| 参数 | 类型 | 说明 |
|------|------|------|
| data | Object | 接口返回的业务信息 |
| code | Long | 调用状态码 |
| msg | String | 状态信息 |
| detail | Object | 响应详情信息 |

### DocumentProgress

| 参数 | 类型 | 说明 |
|------|------|------|
| document_id | String | 文件的 ID |
| document_name | String | 文件名称 |
| status | Integer | 处理状态：0-处理中，1-完成，9-失败 |
| progress | Integer | 上传进度（百分比） |
| remaining_time | Long | 预期剩余时间（秒） |
| url | String | 文件地址 |
| size | Long | 文件大小（字节） |
| type | String | 文件格式 |
| update_type | Integer | 0-不自动更新，1-自动更新 |
| update_interval | Integer | 更新频率（小时） |
| status_descript | String | 失败状态的详细描述 |

## 示例

### 请求示例

```bash
curl --location --request POST 'https://api.coze.cn/v1/datasets/744258581358768****/process' \
--header 'Authorization: Bearer pat_O******' \
--header 'Content-Type: application/json' \
--data-raw '{
  "document_ids": ["7442585813587***", "7442585813668***"]
}'
```

### 返回示例

```json
{
  "code": 0,
  "data": {
    "data": [
      {
        "progress": 100,
        "status": 1,
        "document_id": "744667080521909***",
        "document_name": "test1",
        "remaining_time": 0,
        "url": "https://lf3-appstore-sign.oceancloudapi.com/...",
        "size": 171340,
        "type": "jpg",
        "update_type": 0,
        "update_interval": 0
      }
    ]
  },
  "msg": ""
}
```
