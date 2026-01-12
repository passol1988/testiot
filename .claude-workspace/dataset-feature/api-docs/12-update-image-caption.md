# 更新图片描述

调用此接口更新扣子知识库中图片的描述信息。

## 说明

- 此 API 仅支持更新扣子知识库中的图片描述信息
- 不适用于火山知识库

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | PUT |
| 请求地址 | `https://api.coze.cn/v1/datasets/:dataset_id/images/:document_id` |
| 权限 | `updatePhoto` |

## 请求参数

### Header

| 参数 | 取值 | 说明 |
|------|------|------|
| Authorization | `Bearer $Access_Token` | 用于验证客户端身份的访问令牌 |
| Content-Type | `application/json` | 请求正文的方式 |

### Path

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| dataset_id | String | 必选 | `744632265564659****` | 知识库 ID |
| document_id | String | 必选 | `744667080521911****` | 待更新描述的图片 ID |

### Body

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| caption | String | 必选 | `小猫` | 图片的描述信息 |

## 返回参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | Long | 状态码 |
| msg | String | 状态信息 |
| detail | Object | 响应详情信息 |

## 示例

### 请求示例

```bash
curl --location --request PUT 'https://api.coze.cn/v1/datasets/744632265564659****/images/744667080521911****' \
--header 'Authorization: Bearer pat_OYDacMzM3WyOWV3Dtj2bHRMymzxP****' \
--header 'Content-Type: application/json' \
--data-raw '{
  "caption": "小猫"
}'
```

### 返回示例

```json
{
  "msg": "",
  "detail": {
    "logid": "202412101551329A18A4BFB***"
  },
  "code": 0
}
```
