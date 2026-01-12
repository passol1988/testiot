# 修改知识库

调用此接口修改扣子知识库信息。

## 说明

- 此接口会全量刷新知识库的 name、file_id 和 description 配置
- 仅支持修改本人为所有者的知识库信息
- 如需修改知识库图标，需要先调用上传文件 API

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | PUT |
| 请求地址 | `https://api.coze.cn/v1/datasets/:dataset_id` |
| 权限 | `update` |

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

### Body

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| name | String | 必选 | `knowledge` | 知识库名称，长度不超过 100 个字符 |
| file_id | String | 可选 | `744667846938145****` | 知识库图标 |
| description | String | 可选 | `description of knowledge` | 知识库描述信息 |

## 返回参数

| 参数 | 类型 | 示例 | 说明 |
|------|------|------|------|
| code | Long | `0` | 状态码 |
| msg | String | `""` | 状态信息 |
| detail | Object | - | 响应详情信息 |

## 示例

### 请求示例

```bash
curl --location --request PUT 'https://api.coze.cn/v1/datasets/744632974166804****' \
--header 'Authorization: Bearer pat_qad2rHYNqKnCmRYZW4PhVRibaS***' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "AI知识库",
  "file_id": "74466784693814***",
  "description": "这是一个关于人工智能的知识库"
}'
```

### 返回示例

```json
{
  "code": 0,
  "msg": "",
  "detail": {
    "logid": "20241210191248C8EF7607554A****"
  }
}
```
