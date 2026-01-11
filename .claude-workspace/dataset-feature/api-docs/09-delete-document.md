# 删除知识库文件

调用此接口删除扣子知识库中的文本、图片、表格等文件，支持批量删除。

## 说明

- 仅知识库的所有者可以删除知识库文件
- 仅支持删除扣子知识库中的文件
- 数组最大长度为 100，即一次性最多可删除 100 个文件

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | POST |
| 请求地址 | `https://api.coze.cn/open_api/knowledge/document/delete` |
| 权限 | `deleteDocument` |

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
| document_ids | Array | 必选 | `["123"]` | 待删除的知识库文件列表，最多 100 个 |

## 返回参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | Long | 状态码 |
| msg | String | 状态信息 |
| detail | Object | 响应详情信息 |

## 示例

### 请求示例

```bash
curl --location --request POST 'https://api.coze.cn/open_api/knowledge/document/delete' \
--header 'Authorization: Bearer pat_OYDacMzM3WyOWV3Dtj2bHRMymzxP****' \
--header 'Content-Type: application/json' \
--header 'Agw-Js-Conv: str' \
--data-raw '{
  "document_ids": ["123"]
}'
```

### 返回示例

```json
{
  "code": 0,
  "msg": "",
  "detail": {
    "logid": "20241210152726467C48D89D6DB2****"
  }
}
```
