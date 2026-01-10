# 发布智能体 API

## 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | Publish Bot |
| **请求方式** | POST |
| **接口地址** | `/v1/bot/publish` |
| **权限要求** | publish（发布权限） |
| **文档链接** | [中文](https://www.coze.cn/docs/developer_guides/publish_bot) [English](https://www.coze.com/docs/developer_guides/publish_bot) |

## 接口描述

调用接口将指定智能体发布到 API、Chat SDK 或自定义渠道。智能体发布后才能通过 API 或 SDK 调用。

## 请求参数

### Header

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Personal Access Token，格式：Bearer {token} |
| Content-Type | string | 是 | application/json |

### Body 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bot_id | string | 是 | 要发布的智能体 ID |
| connector_ids | string[] | 是 | 智能体的发布渠道 ID 列表 |

### 发布渠道说明

> 💡 **如何获取 connector_ids**
>
> 可以使用项目预设数据中的渠道常量：
>
> ```typescript
> import { PUBLISH_CONNECTORS, CONNECTOR_INFO } from '../presets/preset-data';
>
> // 直接使用常量
> connector_ids: [PUBLISH_CONNECTORS.COZE_STORE]
>
> // 或使用多个渠道
> connector_ids: [
>   PUBLISH_CONNECTORS.COZE_STORE,    // 扣子商店（默认推荐）
>   PUBLISH_CONNECTORS.API,            // API 接口
>   PUBLISH_CONNECTORS.CHAT_SDK,       // Chat SDK
> ]
> ```
>
> **可用渠道列表：**
>
> | 常量名 | 渠道 ID | 渠道名称 | 说明 |
> |--------|---------|----------|------|
> | COZE_STORE | 10000122 | 扣子商店 | 默认推荐，获取更多曝光和流量 |
> | API | 1024 | API | API 接口发布 |
> | CHAT_SDK | 999 | Chat SDK | 部署为 Chat SDK |
> | DOUBAO | 482431 | 豆包 | 发布到豆包 App |
> | FEISHU | 10000011 | 飞书 | 飞书应用 |
> | WECHAT_MINI_PROGRAM | 10000127 | 微信小程序 | 微信小程序（需企业认证） |
> | WECHAT_CUSTOMER_SERVICE | 10000113 | 微信客服 | 微信客服 |
> | WECHAT_SERVICE_ACCOUNT | 10000120 | 微信服务号 | 微信服务号 |
> | WECHAT_SUBSCRIPTION | 10000121 | 微信订阅号 | 微信订阅号 |
> | DOUYIN_MINI_PROGRAM | 10000126 | 抖音小程序 | 抖音小程序（需企业认证） |
> | FEISHU_BASE | 10000128 | 飞书多维表格 | 飞书多维表格 |
> | JUEJIN | 10000117 | 掘金 | 掘金社区 |
>
> 详细渠道信息请参考：[预设数据文档](../presets/preset-data.md) |

**注意**: 旧的渠道 ID `api_public` 和 `chat_sdk` 已弃用，请使用新的数字 ID。

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
| 4000108 | 发布渠道不存在 |
| 4000109 | 智能体配置不完整，无法发布 |

## TypeScript 类型定义

```typescript
/**
 * 发布智能体请求参数
 */
export interface PublishBotReq {
  /** 要发布的智能体 ID */
  bot_id: string;
  /** 智能体的发布渠道 ID 列表 */
  connector_ids: string[];
}

/**
 * 发布智能体响应数据
 */
export interface PublishBotData {
  // 发布接口无返回数据
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

// 发布智能体
async function publishBot() {
  try {
    await cozeApi.bots.publish({
      bot_id: '73823482348234XXXX',
      connector_ids: ['api_public', 'chat_sdk'],
    });

    console.log('发布成功');
  } catch (error) {
    console.error('发布失败：', error);
  }
}

// 执行发布
publishBot();
```

### cURL

```bash
curl -X POST 'https://api.coze.cn/v1/bot/publish' \
  -H 'Authorization: Bearer your_personal_access_token' \
  -H 'Content-Type: application/json' \
  -d '{
    "bot_id": "73823482348234XXXX",
    "connector_ids": ["api_public", "chat_sdk"]
  }'
```

### Python (使用 requests)

```python
import requests
import json

url = 'https://api.coze.cn/v1/bot/publish'
headers = {
    'Authorization': 'Bearer your_personal_access_token',
    'Content-Type': 'application/json'
}

data = {
    'bot_id': '73823482348234XXXX',
    'connector_ids': ['api_public', 'chat_sdk']
}

response = requests.post(url, headers=headers, data=json.dumps(data))
result = response.json()

if result['code'] == 0:
    print('发布成功')
else:
    print(f'发布失败：{result["msg"]}')
```

## 发布流程

```
┌─────────────┐
│  创建智能体  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  配置智能体  │  (设置提示词、开场白等)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  发布智能体  │  (调用此 API)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   审核中    │  (可能需要审核)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  发布成功   │  (可正式使用)
└─────────────┘
```

## 注意事项

1. **发布前置条件**:
   - 智能体必须已创建完成
   - 智能体配置必须完整（如提示词不能为空）
   - 需要确保访问令牌开通了 publish 权限

2. **发布渠道**:
   - `api_public`: 发布后可通过 REST API 调用
   - `chat_sdk`: 发布后可通过 Chat SDK 调用
   - 可以同时发布到多个渠道

3. **审核机制**:
   - 部分渠道发布后可能需要经过审核
   - 审核通过后才能正式使用
   - 审核不通过需要修改配置后重新发布

4. **版本管理**:
   - 每次发布会创建一个新版本
   - 已发布的版本不能修改，修改后需要重新发布

5. **权限检查**:
   - 只能发布自己创建的智能体
   - 需要有对应空间的权限

## 发布状态查询

发布后可以通过 **查看智能体详情 API** 查询发布状态：

```typescript
// 查询智能体详情
const botInfo = await cozeApi.bots.retrieveNew('73823482348234XXXX', {
  is_published: true,
});

console.log('发布状态：', botInfo.is_published);
console.log('发布时间：', botInfo.published_at);
```
