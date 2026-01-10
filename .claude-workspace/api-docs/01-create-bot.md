# 创建智能体 API

## 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | Create Bot |
| **请求方式** | POST |
| **接口地址** | `/v1/bot/create` |
| **权限要求** | 创建智能体权限 |
| **文档链接** | [中文](https://www.coze.cn/docs/developer_guides/create_bot) [English](https://www.coze.com/docs/developer_guides/create_bot) |

## 接口描述

调用接口创建一个新的智能体（Bot）。创建成功后返回智能体的 ID。

## 请求参数

### Header

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Personal Access Token，格式：Bearer {token} |
| Content-Type | string | 是 | application/json |

### Body 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| space_id | string | 是 | Bot 所在的空间的 Space ID |
| name | string | 是 | Bot 的名称，长度 1-20 个字符 |
| description | string | 否 | Bot 的描述信息，长度 0-500 个字符 |
| icon_file_id | string | 否 | 作为智能体头像的文件 ID，需先调用[文件上传接口](./00-upload-file.md)获取 |

> 💡 **如何获取 space_id**
>
> 可以使用项目预设数据中的工作空间常量：
>
> ```typescript
> import { WORKSPACE } from '../presets/preset-data';
>
> space_id: WORKSPACE.SPACE_ID  // '7556632877497565234'
> ```
>
> ⚠️ **注意**: 这是项目的固定工作空间 ID。不同环境需要修改此值或从 Coze 平台的工作空间 URL 中获取。
>
> 详细信息请参考：[预设数据文档](../presets/preset-data.md)


> 💡 **如何获取 icon_file_id**
>
> 在设置智能体头像前，需要先调用**文件上传接口**上传图片：
>
> ```typescript
> // 1. 先上传图片文件
> const uploadedFile = await cozeApi.files.upload({
>   file: imageFile,
> });
>
> // 2. 使用返回的 file_id
> const fileId = uploadedFile.id; // 这就是 icon_file_id
> ```
>
> 详细说明请参考：[上传文件 API](./00-upload-file.md)
| prompt_info | object | 否 | Bot 的提示词配置 |
| prompt_info.prompt | string | 否 | 配置给 Bot 的提示词内容 |
| onboarding_info | object | 否 | Bot 的开场白配置 |
| onboarding_info.prologue | string | 否 | 配置给 Bot 的开场白内容 |
| onboarding_info.suggested_questions | string[] | 否 | 配置给 Bot 的建议问题列表 |
| plugin_id_list | object | 否 | 插件 ID 列表配置 |
| plugin_id_list.id_list | PluginIdInfo[] | 否 | 插件 ID 信息数组 |
| workflow_id_list | object | 否 | 工作流 ID 列表配置 |
| workflow_id_list.ids | WorkflowIdInfo[] | 否 | 工作流 ID 信息数组 |
| model_info_config | ModelInfoConfig | 否 | 模型配置信息 |
| suggest_reply_info | SuggestReplyInfo | 否 | 建议回复配置 |

### 子类型定义

#### PluginIdInfo

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| plugin_id | string | 是 | 插件 ID |
| api_id | string | 否 | API ID |

#### WorkflowIdInfo

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 工作流 ID |

#### ModelInfoConfig

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| model_id | string | 是 | 模型的唯一标识符 |

> 💡 **如何获取 model_id**
>
> 可以使用项目预设数据中的模型常量：
>
> ```typescript
> import { COZE_MODELS, RECOMMENDED_MODELS } from '../presets/preset-data';
>
> // 直接使用常量
> model_id: COZE_MODELS.DOUBAO_PROGRAMMING  // '1762917129'
>
> // 或使用推荐模型
> model_id: RECOMMENDED_MODELS.DEFAULT  // 默认推荐模型
> ```
>
> 详细模型列表请参考：[预设数据文档](../presets/preset-data.md) |
| top_k | number | 否 | Top K 采样参数 |
| top_p | number | 否 | Top P 采样（核采样）参数 |
| max_tokens | number | 否 | 生成 token 的最大数量 |
| temperature | number | 否 | 采样温度 |
| context_round | number | 否 | 上下文轮数 |
| response_format | string | 否 | 输出格式：text / markdown / json |
| presence_penalty | number | 否 | 重复主题的惩罚 |
| frequency_penalty | number | 否 | 重复语句的惩罚 |

#### SuggestReplyInfo

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| reply_mode | SuggestReplyMode | 是 | 建议回复模式 |
| customized_prompt | string | 否 | 自定义提示词（当 reply_mode 为 customized 时必填） |

#### SuggestReplyMode 枚举

| 值 | 说明 |
|----|------|
| disable | Bot 不建议回复 |
| enable | Bot 建议回复 |
| customized | Bot 根据自定义提示词建议回复 |

## 响应参数

### 成功响应

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | number | 状态码，0 表示成功 |
| msg | string | 响应消息 |
| data | object | 响应数据 |
| data.bot_id | string | 创建的智能体 ID |

### 响应示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "bot_id": "73823482348234XXXX"
  }
}
```

### 错误响应

| 错误码 | 说明 |
|--------|------|
| 4000101 | 参数错误 |
| 4000103 | 权限不足 |
| 4000104 | 空间不存在 |
| 4000105 | 文件不存在 |

## TypeScript 类型定义

```typescript
/**
 * 创建智能体请求参数
 */
export interface CreateBotReq {
  /** Bot 所在的空间的 Space ID */
  space_id: string;
  /** Bot 的名称 */
  name: string;
  /** Bot 的描述信息 */
  description?: string;
  /** 作为智能体头像的文件 ID */
  icon_file_id?: string;
  /** Bot 的提示词配置 */
  prompt_info?: {
    /** 配置给 Bot 的提示词 */
    prompt: string;
  };
  /** Bot 的开场白配置 */
  onboarding_info?: {
    /** 配置给 Bot 的开场白内容 */
    prologue: string;
    /** 配置给 Bot 的建议问题列表 */
    suggested_questions?: string[];
  };
  /** 插件 ID 列表配置 */
  plugin_id_list?: {
    id_list: PluginIdInfo[];
  };
  /** 工作流 ID 列表配置 */
  workflow_id_list?: {
    ids: WorkflowIdInfo[];
  };
  /** 模型配置信息 */
  model_info_config?: ModelInfoConfig;
  /** 建议回复配置 */
  suggest_reply_info?: SuggestReplyInfo;
}

/**
 * 创建智能体响应数据
 */
export interface CreateBotData {
  /** 创建的智能体 ID */
  bot_id: string;
}

/**
 * 插件 ID 信息
 */
export interface PluginIdInfo {
  plugin_id: string;
  api_id?: string;
}

/**
 * 工作流 ID 信息
 */
export interface WorkflowIdInfo {
  id: string;
}

/**
 * 模型配置信息
 */
export interface ModelInfoConfig {
  /** 模型的唯一标识符 */
  model_id: string;
  /** Top K 采样 */
  top_k?: number;
  /** Top P 采样（核采样） */
  top_p?: number;
  /** 生成 token 的最大数量 */
  max_tokens?: number;
  /** 采样温度 */
  temperature?: number;
  /** 上下文轮数 */
  context_round?: number;
  /** 输出格式 */
  response_format?: 'text' | 'markdown' | 'json';
  /** 重复主题的惩罚 */
  presence_penalty?: number;
  /** 重复语句的惩罚 */
  frequency_penalty?: number;
}

/**
 * 建议回复配置
 */
export interface SuggestReplyInfo {
  reply_mode: SuggestReplyMode;
  customized_prompt?: string;
}

/**
 * 建议回复模式
 */
export enum SuggestReplyMode {
  /** Bot 不建议回复 */
  DISABLE = "disable",
  /** Bot 建议回复 */
  ENABLE = "enable",
  /** Bot 根据自定义提示词建议回复 */
  CUSTOMIZED = "customized"
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

// 创建智能体
async function createBot() {
  try {
    const result = await cozeApi.bots.create({
      space_id: '73823482348234XXXX',
      name: '我的智能助手',
      description: '这是一个帮助用户解答问题的智能助手',
      icon_file_id: 'file_id_from_upload',
      prompt_info: {
        prompt: '你是一个专业的客服助手，请礼貌、友好地回答用户的问题。',
      },
      onboarding_info: {
        prologue: '您好！我是您的智能助手，有什么可以帮助您的吗？',
        suggested_questions: [
          '你能做什么？',
          '如何使用？',
          '有什么功能？'
        ],
      },
    });

    console.log('创建成功，智能体 ID：', result.bot_id);
    return result;
  } catch (error) {
    console.error('创建失败：', error);
  }
}

// 执行创建
createBot();
```

### cURL

```bash
curl -X POST 'https://api.coze.cn/v1/bot/create' \
  -H 'Authorization: Bearer your_personal_access_token' \
  -H 'Content-Type: application/json' \
  -d '{
    "space_id": "73823482348234XXXX",
    "name": "我的智能助手",
    "description": "这是一个帮助用户解答问题的智能助手",
    "icon_file_id": "file_id_from_upload",
    "prompt_info": {
      "prompt": "你是一个专业的客服助手，请礼貌、友好地回答用户的问题。"
    },
    "onboarding_info": {
      "prologue": "您好！我是您的智能助手，有什么可以帮助您的吗？",
      "suggested_questions": [
        "你能做什么？",
        "如何使用？",
        "有什么功能？"
      ]
    }
  }'
```

### Python (使用 requests)

```python
import requests
import json

# 先上传图片获取 file_id
def upload_avatar(image_path):
    url = 'https://api.coze.cn/v1/files/upload'
    headers = {
        'Authorization': 'Bearer your_personal_access_token'
    }
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, headers=headers, files=files)
    result = response.json()
    if result['code'] == 0:
        return result['data']['id']
    return None

# 上传头像并获取 file_id
icon_file_id = upload_avatar('/path/to/avatar.png')

# 创建智能体
url = 'https://api.coze.cn/v1/bot/create'
headers = {
    'Authorization': 'Bearer your_personal_access_token',
    'Content-Type': 'application/json'
}

data = {
    'space_id': '73823482348234XXXX',
    'name': '我的智能助手',
    'description': '这是一个帮助用户解答问题的智能助手',
    'icon_file_id': icon_file_id,  # 使用上传后获取的 file_id
    'prompt_info': {
        'prompt': '你是一个专业的客服助手，请礼貌、友好地回答用户的问题。'
    },
    'onboarding_info': {
        'prologue': '您好！我是您的智能助手，有什么可以帮助您的吗？',
        'suggested_questions': [
            '你能做什么？',
            '如何使用？',
            '有什么功能？'
        ]
    }
}

response = requests.post(url, headers=headers, data=json.dumps(data))
result = response.json()

if result['code'] == 0:
    print(f'创建成功，智能体 ID：{result["data"]["bot_id"]}')
else:
    print(f'创建失败：{result["msg"]}')
```

## 注意事项

1. **空间 ID**: 需要先获取 Space ID，可以在 Coze 平台的工作空间页面找到
2. **头像上传**: 如果需要设置头像，需要先调用文件上传接口获取 `file_id`
3. **名称限制**: Bot 名称长度为 1-20 个字符
4. **描述限制**: 描述信息长度为 0-500 个字符
5. **插件配置**: `plugin_id_list` 中的插件必须是当前空间已安装的插件
6. **工作流配置**: `workflow_id_list` 中的工作流必须是当前空间已创建的工作流
7. **模型配置**: `model_id` 必须是 Coze 平台支持的模型 ID
