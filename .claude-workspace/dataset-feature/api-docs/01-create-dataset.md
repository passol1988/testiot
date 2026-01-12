# 创建知识库

调用此接口以创建一个扣子知识库。

调用此 API，你可以创建一个文本知识库或图片知识库。新知识库默认为空，需要通过 API 创建知识库文件 上传文本或图片。

## 说明

- 知识库分为扣子知识库和火山知识库，该 API 仅用于创建扣子知识库，不支持火山知识库的创建
- 暂不支持通过 API 创建表格知识库
- 创建知识库时如需设置知识库图标，需要提前调用 API 上传文件，将图片文件上传至扣子编程

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | POST |
| 请求地址 | `https://api.coze.cn/v1/datasets` |
| 权限 | `createKnowledge` |

## 请求参数

### Header

| 参数 | 取值 | 说明 |
|------|------|------|
| Authorization | `Bearer $Access_Token` | 用于验证客户端身份的访问令牌 |
| Content-Type | `application/json` | 请求正文的方式 |

### Body

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| name | String | 必选 | `产品文档` | 知识库名称，长度不超过 100 个字符 |
| space_id | String | 必选 | `744632974166804****` | 知识库所在空间的工作空间 ID |
| format_type | Integer | 必选 | `2` | 知识库类型：0-文本类型，2-图片类型 |
| description | String | 可选 | `A 的产品文档` | 知识库描述信息 |
| file_id | String | 可选 | `744667846938145****` | 知识库图标，应传入上传文件接口获取的 file_id |

**space_id 获取方式**：进入指定空间，空间页面 URL 中 w 参数后的数字就是工作空间 ID。例如 `https://code.coze.cn/w/75814654762959***/projects`，Space ID 为 `75814654762959***`。

## 返回参数

| 参数 | 类型 | 示例 | 说明 |
|------|------|------|------|
| data | Object | `{"dataset_id": "744668935865830****"}` | 返回内容 |
| code | Long | `0` | 状态码，0 代表调用成功 |
| msg | String | `""` | 状态信息 |
| detail | Object | `{"logid": "..."}` | 本次请求的日志 ID |

### CreateDatasetOpenApiData

| 参数 | 类型 | 示例 | 说明 |
|------|------|------|------|
| dataset_id | String | `744668935865830****` | 新知识库的 ID |

## 示例

### 请求示例

```bash
curl --location --request POST 'https://api.coze.cn/v1/datasets' \
--header 'Authorization: Bearer pat_xitq9LWlowpX3qGCih1lwpAdzvXN****' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name":"产品文档",
  "description":"产品文档",
  "space_id":"731121948439879****",
  "format_type":2,
  "file_id":"744667846938145****"
}'
```

### 返回示例

```json
{
  "code": 0,
  "data": {
    "dataset_id": "744668935865830****"
  },
  "msg": "",
  "detail": {
    "logid": "20241210160547B25AEC1917B0***"
  }
}
```

## 错误码

如果成功调用 API，返回信息中 code 字段为 0。如果状态码为其他值，则表示接口调用失败。
