# 修改知识库文件

调用接口修改扣子知识库文件名称和更新策略。

## 说明

- 仅支持修改扣子知识库的文件
- 可修改文件名称和在线网页的更新配置

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | POST |
| 请求地址 | `https://api.coze.cn/open_api/knowledge/document/update` |
| 权限 | `updateDocument` |

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
| document_id | String | 可选 | `738694205603010****` | 待修改的知识库文件 ID |
| document_name | String | 可选 | `cozeoverview` | 知识库文件的新名称 |
| update_rule | Object | 可选 | - | 在线网页的更新配置 |

### UpdateRule

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| update_type | Integer | 可选 | `1` | 0-不自动更新，1-自动更新 |
| update_interval | Integer | 可选 | `24` | 更新频率（小时），最小 24 |

## 返回参数

| 参数 | 类型 | 说明 |
|------|------|------|
| document_info | Object | deprecated，更新内容时会返回 |
| code | Long | 状态码 |
| msg | String | 状态信息 |
| detail | Object | 响应详情信息 |

## 示例

### 请求示例

```bash
curl --location --request POST 'https://api.coze.cn/open_api/knowledge/document/update' \
--header 'Authorization: Bearer pat_OYDacMzM3WyOWV3Dtj2bHRMymzxP****' \
--header 'Content-Type: application/json' \
--header 'Agw-Js-Conv: str' \
--data-raw '{
  "document_id": "738694205603010****",
  "document_name": "cozeoverview"
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
