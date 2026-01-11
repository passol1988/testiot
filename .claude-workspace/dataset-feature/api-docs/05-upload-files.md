# 上传文件

调用接口上传文件到扣子编程。

## 接口说明

消息中无法直接使用本地文件，创建消息或对话前，需要先调用此接口上传本地文件到扣子编程。上传文件后，你可以在消息中通过指定 file_id 的方式在多模态内容中直接使用此文件。

## 使用限制

| 限制 | 说明 |
|------|------|
| 文件大小 | 最大 512 MB |
| 上传方式 | 必须使用 multipart/form-data |
| 有效期 | 普通上传 3 个月；用作头像则永久有效 |
| 使用限制 | 仅限本账号查看或使用 |
| QPS 限制 | 个人版/专业版 10 QPS；团队版/企业版 20 QPS |

## 支持的文件格式

| 文件类型 | 支持的格式 |
|----------|------------|
| 文档 | DOC、DOCX、XLS、XLSX、PPT、PPTX、PDF、Numbers、CSV |
| 文本文件 | CPP、PY、JAVA、C |
| 图片 | JPG、JPG2、PNG、GIF、WEBP、HEIC、HEIF、BMP、PCD、TIFF |
| 音频 | WAV、MP3、FLAC、M4A、AAC、OGG、WMA、MIDI |
| 视频 | MP4、AVI、MOV、3GP、3GPP、FLV、WEBM、WMV、RMVB、M4V、MKV |
| 压缩文件 | RAR、ZIP、7Z、GZ、GZIP、BZ2 |

## 基础信息

| 项目 | 说明 |
|------|------|
| 请求方式 | POST |
| 请求地址 | `https://api.coze.cn/v1/files/upload` |
| 权限 | `uploadFile` |

## 请求参数

### Header

| 参数 | 取值 | 说明 |
|------|------|------|
| Authorization | `Bearer $Access_Token` | 用于验证客户端身份的访问令牌 |
| Content-Type | `multipart/form-data` | 解释请求正文的方式 |

### Body

| 参数 | 类型 | 是否必选 | 示例 | 说明 |
|------|------|----------|------|------|
| file | File | 必选 | `@"/test/1120.jpeg"'` | 待上传文件的二进制数据 |

## 返回参数

| 参数 | 类型 | 示例 | 说明 |
|------|------|------|------|
| data | Object | - | 已上传的文件信息 |
| code | Long | `0` | 调用状态码 |
| msg | String | `""` | 状态信息 |

### File

| 参数 | 类型 | 示例 | 说明 |
|------|------|------|------|
| id | String | `736949598110202****` | 已上传的文件 ID |
| bytes | Long | `152236` | 文件的总字节数 |
| file_name | String | `1120.jpeg` | 文件名称 |
| created_at | Long | `1715847583` | 文件的上传时间，Unix 时间戳（秒） |

## 示例

### 请求示例

```bash
curl --location --request POST 'https://api.coze.cn/v1/files/upload' \
--header 'Authorization: Bearer pat_O******' \
--header 'Content-Type: multipart/form-data' \
--form 'file=@"/test/1120.jpeg"'
```

### 返回示例

```json
{
  "code": 0,
  "data": {
    "bytes": 152236,
    "created_at": 1715847583,
    "file_name": "1120.jpeg",
    "id": "736949598110202****"
  },
  "msg": ""
}
```

## 错误码

如果成功调用 API，返回信息中 code 字段为 0。如果状态码为其他值，则表示接口调用失败。
