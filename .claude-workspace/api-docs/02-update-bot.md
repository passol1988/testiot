# 更新智能体 API

## 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | Update Bot |
| **请求方式** | POST |
| **接口地址** | `/v1/bot/update` |
| **权限要求** | 更新智能体权限 |
| **文档链接** | [中文](https://www.coze.cn/docs/developer_guides/update_bot) [English](https://www.coze.com/docs/developer_guides/update_bot) |

## 接口描述

调用接口修改智能体的配置。通过此 API 可更新通过扣子平台或 API 方式创建的所有智能体。

## 请求参数

### Header

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Personal Access Token，格式：Bearer {token} |
| Content-Type | string | 是 | application/json |

### Body 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bot_id | string | 是 | 待修改配置的智能体 ID |
| name | string | 否 | Bot 的名称 |
| description | string | 否 | Bot 的描述信息 |
| icon_file_id | string | 否 | 作为智能体头像的文件 ID，需先调用[文件上传接口](./00-upload-file.md)获取 |

> 💡 **如何更新头像**
>
> 要更新智能体头像，需要先调用**文件上传接口**上传新图片：
>
> ```typescript
> // 1. 先上传新的图片文件
> const newAvatar = await cozeApi.files.upload({
>   file: newImageFile,
> });
>
> // 2. 更新智能体配置，使用新的 file_id
> await cozeApi.bots.update({
>   bot_id: 'xxx',
>   icon_file_id: newAvatar.id,
> });
> ```
>
> 详细说明请参考：[上传文件 API](./00-upload-file.md) |
| prompt_info | object | 否 | Bot 的提示词配置 |
| prompt_info.prompt | string | 否 | 配置给 Bot 的提示词内容 |
| onboarding_info | object | 否 | Bot 的开场白配置 |
| onboarding_info.prologue | string | 否 | 配置给 Bot 的开场白内容 |
| onboarding_info.suggested_questions | string[] | 否 | 配置给 Bot 的建议问题列表 |
| knowledge | KnowledgeInfo | 否 | Bot 的知识库配置 |
| plugin_id_list | object | 否 | 插件 ID 列表配置 |
| plugin_id_list.id_list | PluginIdInfo[] | 否 | 插件 ID 信息数组 |
| workflow_id_list | object | 否 | 工作流 ID 列表配置 |
| workflow_id_list.ids | WorkflowIdInfo[] | 否 | 工作流 ID 信息数组 |
| model_info_config | ModelInfoConfig | 否 | 模型配置信息 |

> 💡 **关于 model_id**
>
> `model_info_config.model_id` 可以使用项目预设数据中的模型常量：
>
> ```typescript
> import { COZE_MODELS, RECOMMENDED_MODELS } from '../presets/preset-data';
>
> // 直接使用常量
> model_info_config: {
>   model_id: COZE_MODELS.DOUBAO_PROGRAMMING  // '1762917129'
> }
>
> // 或使用推荐模型
> model_info_config: {
>   model_id: RECOMMENDED_MODELS.DEFAULT  // 默认推荐模型
> }
> ```
>
> 详细模型列表和 `ModelInfoConfig` 结构请参考：[创建智能体 API](./01-create-bot.md#modelinfoconfig) |
| suggest_reply_info | SuggestReplyInfo | 否 | 建议回复配置 |

### 子类型定义

#### PluginIdInfo

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| plugin_id | string | 是 | 插件 ID |
| api_id | string | **推荐** | 插件的 API ID |

> ⚠️ **重要：api_id 是推荐参数**
>
> 为确保插件正确工作，**强烈建议**提供 `api_id` 参数：
>
> ```typescript
> plugin_id_list: {
>   id_list: [
>     {
>       plugin_id: "7548028105068183561",  // 插件 ID
>       api_id: "7548028105068199945"    // 配套的 API ID
>     }
>   ]
> }
> ```
>
> 如果不提供 `api_id`，系统将使用插件的默认 API，但可能导致功能不正常或调用失败。

#### KnowledgeInfo

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dataset_ids | string[] | 否 | 关联的数据集 ID 列表 |
| auto_call | boolean | 否 | 是否自动调用知识库 |
| search_strategy | number | 否 | 搜索策略 |

## 响应参数

### 成功响应

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | number | 状态码，0 表示成功 |
| msg | string | 响应消息 |

### 响应示例

```json
{
  "code": 0,
  "msg": "success"
}
```

### 错误响应

| 错误码 | 说明 |
|--------|------|
| 4000101 | 参数错误 |
| 4000103 | 权限不足 |
| 4000106 | 智能体不存在 |
| 4000107 | 文件不存在 |

## TypeScript 类型定义

```typescript
/**
 * 更新智能体请求参数
 */
export interface UpdateBotReq {
  /** 待修改配置的智能体 ID */
  bot_id: string;
  /** Bot 的名称 */
  name?: string;
  /** Bot 的描述信息 */
  description?: string;
  /** 作为智能体头像的文件 ID */
  icon_file_id?: string;
  /** Bot 的提示词配置 */
  prompt_info?: {
    /** 配置给 Bot 的提示词 */
    prompt?: string;
  };
  /** Bot 的开场白配置 */
  onboarding_info?: {
    /** 配置给 Bot 的开场白内容 */
    prologue?: string;
    /** 配置给 Bot 的建议问题列表 */
    suggested_questions?: string[];
  };
  /** Bot 的知识库配置 */
  knowledge?: KnowledgeInfo;
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
 * 知识库配置信息
 */
export interface KnowledgeInfo {
  /** 关联的数据集 ID 列表 */
  dataset_ids?: string[];
  /** 是否自动调用知识库 */
  auto_call?: boolean;
  /** 搜索策略 */
  search_strategy?: number;
}

// 其他类型定义参见创建智能体 API 文档
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

// 更新智能体
async function updateBot() {
  try {
    await cozeApi.bots.update({
      bot_id: '73823482348234XXXX',
      name: '更新后的智能助手名称',
      description: '这是更新后的描述',
      prompt_info: {
        prompt: '你是更新后的客服助手，请更加友好地回答用户的问题。',
      },
      onboarding_info: {
        prologue: '您好！欢迎回来，有什么新问题需要帮助吗？',
        suggested_questions: [
          '今天能做什么？',
          '最新功能是什么？'
        ],
      },
    });

    console.log('更新成功');
  } catch (error) {
    console.error('更新失败：', error);
  }
}

// 执行更新
updateBot();
```

### cURL

```bash
curl -X POST 'https://api.coze.cn/v1/bot/update' \
  -H 'Authorization: Bearer your_personal_access_token' \
  -H 'Content-Type: application/json' \
  -d '{
    "bot_id": "73823482348234XXXX",
    "name": "更新后的智能助手名称",
    "description": "这是更新后的描述",
    "prompt_info": {
      "prompt": "你是更新后的客服助手，请更加友好地回答用户的问题。"
    },
    "onboarding_info": {
      "prologue": "您好！欢迎回来，有什么新问题需要帮助吗？",
      "suggested_questions": [
        "今天能做什么？",
        "最新功能是什么？"
      ]
    }
  }'
```

### Python (使用 requests)

```python
import requests
import json

url = 'https://api.coze.cn/v1/bot/update'
headers = {
    'Authorization': 'Bearer your_personal_access_token',
    'Content-Type': 'application/json'
}

data = {
    'bot_id': '73823482348234XXXX',
    'name': '更新后的智能助手名称',
    'description': '这是更新后的描述',
    'prompt_info': {
        'prompt': '你是更新后的客服助手，请更加友好地回答用户的问题。'
    },
    'onboarding_info': {
        'prologue': '您好！欢迎回来，有什么新问题需要帮助吗？',
        'suggested_questions': [
            '今天能做什么？',
            '最新功能是什么？'
        ]
    }
}

response = requests.post(url, headers=headers, data=json.dumps(data))
result = response.json()

if result['code'] == 0:
    print('更新成功')
else:
    print(f'更新失败：{result["msg"]}')
```

## 注意事项

1. **部分更新**: 只需要传入需要更新的字段，未传入的字段保持不变
2. **权限要求**: 只能更新自己创建的智能体或有权限管理的智能体
3. **已发布状态**: 如果智能体已发布，更新后需要重新发布才能生效
4. **知识库配置**: 关联的数据集必须是当前空间已创建的数据集
5. **插件和工作流**: 配置的插件和工作流必须是当前空间已存在的资源
