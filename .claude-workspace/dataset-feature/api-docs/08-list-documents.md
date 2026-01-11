# 查询文件列表

调用接口查看指定扣子知识库的文件列表。

## 说明

- 仅支持查看扣子知识库中的文件列表
- 不支持查看火山知识库中的文件列表

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | POST |
| 请求地址 | `https://api.coze.cn/open_api/knowledge/document/list` |
| 权限 | `listDocument` |

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
| dataset_id | String | 必选 | `75034727177617***` | 待查看文件的扣子知识库 ID |
| page | Integer | 可选 | `1` | 分页查询时的页码，默认 1 |
| size | Integer | 可选 | `20` | 分页大小，默认 10 |

## 返回参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | Long | 状态码 |
| msg | String | 状态信息 |
| document_infos | Array | 知识库文件列表 |
| total | Integer | 指定知识库中的文件总数 |
| detail | Object | 返回详情 |

## 示例

### 请求示例

```bash
curl --location --request POST 'https://api.coze.cn/open_api/knowledge/document/list' \
--header 'Authorization: Bearer pat_OYDacMzM3WyOWV3Dtj2bHRMymzxP****' \
--header 'Content-Type: application/json' \
--header 'Agw-Js-Conv: str' \
--data-raw '{
  "dataset_id": "736356924530694****",
  "page": 1,
  "size": 10
}'
```

### 返回示例

```json
{
  "code": 0,
  "document_infos": [
    {
      "document_id": "738508308097900****",
      "name": "小猫的阳光午睡.pdf.pdf",
      "type": "pdf",
      "size": 30142,
      "format_type": 0,
      "status": 1,
      "slice_count": 1,
      "source_type": 0,
      "hit_count": 0,
      "create_time": 1719476392,
      "update_time": 1719476430,
      "chunk_strategy": {
        "chunk_type": 0
      }
    }
  ],
  "msg": "",
  "total": 1
}
```
