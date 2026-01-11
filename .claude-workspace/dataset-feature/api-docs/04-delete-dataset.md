# 删除知识库

调用此接口删除扣子知识库。

## 说明

- 空间管理员可以删除团队中所有知识库，其他成员只能删除本人为所有者的知识库
- 删除知识库时，会同时删除知识库中已上传的所有文件
- 绑定此知识库的智能体会自动解绑

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | DELETE |
| 请求地址 | `https://api.coze.cn/v1/datasets/:dataset_id` |
| 权限 | `delete` |

## 请求参数

### Header

| 参数 | 取值 | 说明 |
|------|------|------|
| Authorization | `Bearer $Access_Token` | 用于验证客户端身份的访问令牌 |
| Content-Type | `application/json` | 请求正文的方式 |

### Path

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| dataset_id | String | 必选 | `744632974166804****` | 扣子知识库 ID |

## 返回参数

| 参数 | 类型 | 示例 | 说明 |
|------|------|------|------|
| code | Long | `0` | 状态码 |
| msg | String | `""` | 状态信息 |
| detail | Object | - | 响应详情信息 |

## 示例

### 请求示例

```bash
curl --location --request DELETE 'https://api.coze.cn/v1/datasets/744668935865830****' \
--header 'Authorization: Bearer pat_O******' \
--header 'Content-Type: application/json'
```

### 返回示例

```json
{
  "code": 0,
  "msg": "",
  "detail": {
    "logid": "20241210191248C8EF7607554A***"
  }
}
```
