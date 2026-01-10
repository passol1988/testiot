# 上传文件 API

## 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | Upload File |
| **请求方式** | POST |
| **接口地址** | `/v1/files/upload` |
| **权限要求** | 文件上传权限 |
| **文档链接** | [中文](https://www.coze.cn/docs/developer_guides/upload_files) [English](https://www.coze.com/docs/developer_guides/upload_files) |

## 接口描述

调用接口上传文件到扣子平台。上传成功后返回文件 ID，可用于智能体头像、知识库文档等场景。

## 请求参数

### Header

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Personal Access Token，格式：Bearer {token} |
| Content-Type | string | 是 | multipart/form-data |

### Body 参数（multipart/form-data）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 要上传的文件 |

### 支持的文件类型

| 文件用途 | 支持格式 | 大小限制 |
|---------|---------|---------|
| 智能体头像 | PNG, JPG, JPEG, GIF | 建议 2MB 以内 |
| 知识库文档 | TXT, PDF, DOCX, DOC, XLSX, XLS, CSV | 单个文件最大 15MB |
| 图片 | PNG, JPG, JPEG, GIF | 建议 5MB 以内 |

## 响应参数

### 成功响应

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | number | 状态码，0 表示成功 |
| msg | string | 响应消息 |
| data | FileObject | 已上传的文件信息 |

### FileObject 结构

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 已上传文件的 ID |
| bytes | number | 文件大小（字节） |
| created_at | number | 上传时间（Unix 时间戳，秒） |
| file_name | string | 文件名 |

### 响应示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "73823482348234XXXX",
    "bytes": 102400,
    "created_at": 1704067200,
    "file_name": "avatar.png"
  }
}
```

### 错误响应

| 错误码 | 说明 |
|--------|------|
| 4000101 | 参数错误 |
| 4000103 | 权限不足 |
| 4000111 | 文件格式不支持 |
| 4000112 | 文件大小超限 |
| 4000113 | 文件上传失败 |

## TypeScript 类型定义

```typescript
/**
 * 上传文件请求参数
 */
export interface CreateFileReq {
  /** 需要上传的文件 */
  file: File;
}

/**
 * 文件对象
 */
export interface FileObject {
  /** 已上传文件的 ID */
  id: string;
  /** 文件大小（字节） */
  bytes: number;
  /** 上传时间（Unix 时间戳，秒） */
  created_at: number;
  /** 文件名 */
  file_name: string;
}
```

## 使用示例

### JavaScript/TypeScript

```typescript
import { CozeAPI } from '@coze/api';

// 初始化 Coze 客户端
const cozeApi = new CozeAPI({
  baseURL: 'https://api.coze.cn',
  token: 'your_personal_access_token',
});

// 上传文件
async function uploadFile(file: File) {
  try {
    const result = await cozeApi.files.upload({
      file: file,
    });

    console.log('上传成功，文件 ID：', result.id);
    console.log('文件名：', result.file_name);
    console.log('文件大小：', result.bytes);

    return result;
  } catch (error) {
    console.error('上传失败：', error);
  }
}

// 从文件输入框上传
const fileInput = document.querySelector('input[type="file"]');
fileInput?.addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const uploadedFile = await uploadFile(file);
    // 使用返回的 file_id
    console.log('获取到的 file_id:', uploadedFile.id);
  }
});

// 从 URL 上传图片
async function uploadImageFromUrl(imageUrl: string) {
  try {
    // 先获取图片数据
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.png', { type: 'image/png' });

    // 上传到 Coze
    const result = await cozeApi.files.upload({ file });
    return result.id;
  } catch (error) {
    console.error('上传失败：', error);
  }
}

// 执行上传
uploadImageFromUrl('https://example.com/avatar.png');
```

### cURL

```bash
# 上传本地文件
curl -X POST 'https://api.coze.cn/v1/files/upload' \
  -H 'Authorization: Bearer your_personal_access_token' \
  -F 'file=@/path/to/avatar.png'

# 上传后返回
# {
#   "code": 0,
#   "msg": "success",
#   "data": {
#     "id": "73823482348234XXXX",
#     "bytes": 102400,
#     "created_at": 1704067200,
#     "file_name": "avatar.png"
#   }
# }
```

### Python (使用 requests)

```python
import requests

def upload_file(file_path):
    url = 'https://api.coze.cn/v1/files/upload'
    headers = {
        'Authorization': 'Bearer your_personal_access_token'
    }

    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, headers=headers, files=files)

    result = response.json()

    if result['code'] == 0:
        file_info = result['data']
        print(f'上传成功，文件 ID：{file_info["id"]}')
        print(f'文件名：{file_info["file_name"]}')
        print(f'文件大小：{file_info["bytes"]} 字节')
        return file_info['id']
    else:
        print(f'上传失败：{result["msg"]}')

# 上传本地文件
file_id = upload_file('/path/to/avatar.png')

# 使用返回的 file_id
print(f'获取到的 file_id: {file_id}')
```

### React 组件示例

```typescript
import { useState } from 'react';
import { CozeAPI } from '@coze/api';

const cozeApi = new CozeAPI({
  baseURL: 'https://api.coze.cn',
  token: 'your_personal_access_token',
});

function FileUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await cozeApi.files.upload({ file });
      setFileId(result.id);
      console.log('上传成功，文件 ID：', result.id);
    } catch (error) {
      console.error('上传失败：', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        accept="image/png,image/jpeg,image/gif"
      />
      {uploading && <p>上传中...</p>}
      {fileId && <p>文件 ID: {fileId}</p>}
    </div>
  );
}

export default FileUploadComponent;
```

## 常见使用场景

### 1. 设置智能体头像

```typescript
// 先上传头像图片
const avatarFile = await cozeApi.files.upload({
  file: avatarImageFile,
});

// 使用返回的 file_id 创建智能体
await cozeApi.bots.create({
  space_id: '73823482348234XXXX',
  name: '我的智能助手',
  icon_file_id: avatarFile.id,  // 使用上传后获取的 file_id
  // ... 其他配置
});
```

### 2. 更新智能体头像

```typescript
// 上传新头像
const newAvatar = await cozeApi.files.upload({
  file: newAvatarFile,
});

// 更新智能体配置
await cozeApi.bots.update({
  bot_id: '73823482348234XXXX',
  icon_file_id: newAvatar.id,  // 使用上传后获取的 file_id
});
```

### 3. Base64 图片上传

```typescript
// 将 Base64 转换为 File 并上传
function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// 使用示例
const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
const imageFile = base64ToFile(base64Image, 'avatar.png');
const uploadedFile = await cozeApi.files.upload({ file: imageFile });
console.log('文件 ID:', uploadedFile.id);
```

## 查询文件详情

上传文件后，可以通过文件 ID 查询文件详情：

```typescript
// 查询文件详情
const fileInfo = await cozeApi.files.retrieve('73823482348234XXXX');
console.log('文件信息：', fileInfo);
```

## 注意事项

1. **文件大小限制**:
   - 图片文件建议 5MB 以内
   - 文档文件单个最大 15MB
   - 超过限制会导致上传失败

2. **文件格式**:
   - 确保上传的文件格式在支持列表中
   - 不支持的格式会返回错误

3. **文件 ID 保存**:
   - 上传成功后请妥善保存返回的 `file_id`
   - `file_id` 是后续使用该文件的唯一标识

4. **权限要求**:
   - 需要有有效的 Personal Access Token
   - Token 需要有文件上传权限

5. **使用场景**:
   - 智能体头像 (`icon_file_id`)
   - 知识库文档
   - 其他需要文件引用的场景

6. **安全建议**:
   - 验证文件类型，避免上传恶意文件
   - 限制文件大小，避免占用过多资源
   - 对用户上传的文件进行安全检查
