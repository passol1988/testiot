# 查看智能体详情 API

## 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | Retrieve Bot |
| **请求方式** | GET |
| **接口地址** | `/v1/bots/:bot_id` |
| **权限要求** | 查看智能体权限 |
| **文档链接** | [中文](https://www.coze.cn/docs/developer_guides/get_metadata_draft_published) [English](https://www.coze.com/docs/developer_guides/get_metadata_draft_published) |

## 接口描述

获取指定智能体的详细配置信息。支持查询已发布版本或草稿版本。

## 请求参数

### Header

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Personal Access Token，格式：Bearer {token} |

### Path 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bot_id | string | 是 | 要查看的智能体 ID |

### Query 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| is_published | boolean | 否 | 是否查询已发布版本，true=已发布版本，false=草稿版本，不传则默认查询最新版本 |
| connector_id | string | 否 | 渠道 ID，当查询已发布版本时建议设置 |

## 响应参数

### 成功响应

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | number | 状态码，0 表示成功 |
| msg | string | 响应消息 |
| data | BotInfo | 智能体详细信息 |

### BotInfo 结构

| 参数名 | 类型 | 说明 |
|--------|------|------|
| bot_id | string | 智能体唯一标识符 |
| name | string | 智能体名称 |
| description | string | 智能体描述 |
| icon_url | string | 智能体头像 URL |
| create_time | number | 创建时间（Unix 时间戳，秒） |
| update_time | number | 更新时间（Unix 时间戳，秒） |
| version | string | 智能体最新版本号 |
| prompt_info | object | 提示词配置 |
| prompt_info.prompt | string | 提示词内容 |
| onboarding_info | object | 开场白配置 |
| onboarding_info.prologue | string | 开场白内容 |
| onboarding_info.suggested_questions | string[] | 建议问题列表 |
| bot_mode | BotModeType | 智能体模式（0=单智能体，1=多智能体，2=单智能体工作流） |
| plugin_info_list | BotPlugin[] | 插件列表 |
| model_info | object | 模型信息 |
| model_info.model_id | string | 模型 ID |
| model_info.model_name | string | 模型名称 |
| knowledge | CommonKnowledge | 知识库配置 |
| shortcut_commands | ShortcutCommandInfo[] | 快捷指令列表 |
| workflow_info_list | WorkflowInfo[] | 工作流列表 |
| suggest_reply_info | SuggestReplyInfo | 建议回复配置 |
| background_image_info | BotBackgroundImageInfo | 背景图配置 |
| variables | BotVariable[] | 变量列表 |

### 子类型定义

#### BotPlugin（插件信息）

| 参数名 | 类型 | 说明 |
|--------|------|------|
| plugin_id | string | 插件唯一标识符 |
| name | string | 插件名称 |
| description | string | 插件描述 |
| icon_url | string | 插件头像 |
| api_info_list | object[] | 工具列表 |
| api_info_list[].api_id | string | 工具 ID |
| api_info_list[].name | string | 工具名称 |
| api_info_list[].description | string | 工具描述 |

#### CommonKnowledge（知识库）

| 参数名 | 类型 | 说明 |
|--------|------|------|
| knowledge_infos | object[] | 知识库列表 |
| knowledge_infos[].id | string | 知识库 ID |
| knowledge_infos[].name | string | 知识库名称 |

#### ShortcutCommandInfo（快捷指令）

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 快捷指令 ID |
| name | string | 按钮名称 |
| tool | object | 工具信息 |
| tool.name | string | 工具名称 |
| tool.type | string | 工具类型（plugin/workflow） |
| command | string | 指令名称 |
| agent_id | string | 多智能体模式下的节点 ID |
| icon_url | string | 图标 URL |
| components | object[] | 组件列表 |
| description | string | 描述 |
| query_template | string | 指令内容模板 |

#### WorkflowInfo（工作流信息）

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 工作流 ID |
| name | string | 工作流名称 |
| icon_url | string | 工作流图标 URL |
| description | string | 工作流描述 |

#### BotVariable（变量）

| 参数名 | 类型 | 说明 |
|--------|------|------|
| keyword | string | 变量名称 |
| default_value | string | 变量默认值 |
| variable_type | VariableType | 变量类型（KVVariable/ListVariable） |
| channel | VariableChannel | 变量来源 |
| description | string | 变量描述 |
| enable | boolean | 是否启用 |
| prompt_enable | boolean | 是否在提示词中支持 |

### 响应示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "bot_id": "73823482348234XXXX",
    "name": "客服助手",
    "description": "这是一个智能客服助手",
    "icon_url": "https://lf3-static.bytednsdoc.com/...",
    "create_time": 1704067200,
    "update_time": 1704153600,
    "version": "1.0.0",
    "prompt_info": {
      "prompt": "你是一个专业的客服助手，请礼貌、友好地回答用户的问题。"
    },
    "onboarding_info": {
      "prologue": "您好！我是您的智能助手，有什么可以帮助您的吗？",
      "suggested_questions": [
        "你能做什么？",
        "如何使用？"
      ]
    },
    "bot_mode": 0,
    "plugin_info_list": [],
    "model_info": {
      "model_id": "model_id_value",
      "model_name": "GPT-4"
    },
    "knowledge": {
      "knowledge_infos": []
    },
    "shortcut_commands": [],
    "workflow_info_list": [],
    "suggest_reply_info": {
      "reply_mode": "enable"
    },
    "background_image_info": {
      "web_background_image": null,
      "mobile_background_image": null
    },
    "variables": []
  }
}
```

## TypeScript 类型定义

```typescript
/**
 * 查询智能体详情请求参数（新版）
 */
export interface RetrieveBotNewReq {
  /**
   * 是否查询已发布版本
   * - true: 查询已发布版本
   * - false: 查询草稿版本
   */
  is_published?: boolean;
}

/**
 * 智能体详细信息
 */
export interface BotInfo {
  /** 智能体唯一标识符 */
  bot_id: string;
  /** 智能体名称 */
  name: string;
  /** 智能体描述 */
  description: string;
  /** 智能体头像 URL */
  icon_url: string;
  /** 创建时间（Unix 时间戳，秒） */
  create_time: number;
  /** 更新时间（Unix 时间戳，秒） */
  update_time: number;
  /** 智能体最新版本号 */
  version: string;
  /** 提示词配置 */
  prompt_info: {
    /** 提示词内容 */
    prompt: string;
  };
  /** 开场白配置 */
  onboarding_info: {
    /** 开场白内容 */
    prologue: string;
    /** 建议问题列表 */
    suggested_questions?: string[];
  };
  /**
   * 智能体模式
   * - 0: 单智能体模式
   * - 1: 多智能体模式
   * - 2: 单智能体工作流
   */
  bot_mode: BotModeType;
  /** 插件列表 */
  plugin_info_list: BotPlugin[];
  /** 模型信息 */
  model_info: {
    /** 模型唯一标识符 */
    model_id: string;
    /** 模型名称 */
    model_name: string;
  };
  /** 知识库配置 */
  knowledge: CommonKnowledge;
  /** 快捷指令列表 */
  shortcut_commands: ShortcutCommandInfo[];
  /** 工作流列表 */
  workflow_info_list: WorkflowInfo[];
  /** 建议回复配置 */
  suggest_reply_info: SuggestReplyInfo;
  /** 背景图配置 */
  background_image_info: BotBackgroundImageInfo;
  /** 变量列表 */
  variables: BotVariable[];
}

/**
 * 智能体模式类型
 */
export type BotModeType = 0 | 1 | 2;

// 其他类型定义参见前面的文档...
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

// 查询智能体详情
async function getBotDetail() {
  try {
    // 查询草稿版本
    const draftBot = await cozeApi.bots.retrieveNew(
      '73823482348234XXXX',
      { is_published: false }
    );
    console.log('草稿版本：', draftBot);

    // 查询已发布版本
    const publishedBot = await cozeApi.bots.retrieveNew(
      '73823482348234XXXX',
      { is_published: true }
    );
    console.log('已发布版本：', publishedBot);

    // 不传参数，默认查询最新版本
    const latestBot = await cozeApi.bots.retrieveNew('73823482348234XXXX');
    console.log('最新版本：', latestBot);

    return latestBot;
  } catch (error) {
    console.error('查询失败：', error);
  }
}

// 执行查询
getBotDetail();
```

### cURL

```bash
# 查询草稿版本
curl -X GET 'https://api.coze.cn/v1/bots/73823482348234XXXX?is_published=false' \
  -H 'Authorization: Bearer your_personal_access_token'

# 查询已发布版本
curl -X GET 'https://api.coze.cn/v1/bots/73823482348234XXXX?is_published=true' \
  -H 'Authorization: Bearer your_personal_access_token'

# 查询最新版本（不传参数）
curl -X GET 'https://api.coze.cn/v1/bots/73823482348234XXXX' \
  -H 'Authorization: Bearer your_personal_access_token'
```

### Python (使用 requests)

```python
import requests

def get_bot_detail(bot_id, is_published=None):
    url = f'https://api.coze.cn/v1/bots/{bot_id}'
    headers = {
        'Authorization': 'Bearer your_personal_access_token'
    }
    params = {}
    if is_published is not None:
        params['is_published'] = str(is_published).lower()

    response = requests.get(url, headers=headers, params=params)
    result = response.json()

    if result['code'] == 0:
        bot_info = result['data']
        print(f"智能体名称：{bot_info['name']}")
        print(f"智能体描述：{bot_info['description']}")
        print(f"创建时间：{bot_info['create_time']}")
        print(f"版本号：{bot_info['version']}")
        return bot_info
    else:
        print(f"查询失败：{result['msg']}")

# 查询草稿版本
get_bot_detail('73823482348234XXXX', is_published=False)

# 查询已发布版本
get_bot_detail('73823482348234XXXX', is_published=True)
```

## BotModeType 说明

| 值 | 名称 | 说明 |
|----|------|------|
| 0 | Single Agent | 单智能体模式 |
| 1 | Multi Agent | 多智能体模式 |
| 2 | Single Agent Workflow | 单智能体工作流模式 |

## 注意事项

1. **版本选择**:
   - 不传 `is_published` 参数时，默认返回最新版本
   - 建议明确指定查询草稿还是已发布版本

2. **权限要求**:
   - 只能查询有权限访问的智能体详情
   - 跨工作空间查询需要相应权限

3. **数据差异**:
   - 草稿版本：包含未发布的修改
   - 已发布版本：稳定可用的版本
   - 两者配置可能不同

4. **性能考虑**:
   - 详情接口返回数据较多，建议按需获取
   - 频繁查询建议做好缓存
