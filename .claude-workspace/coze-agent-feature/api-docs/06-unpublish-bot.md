# 下架智能体 API

## 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | Unpublish Bot |
| **请求方式** | POST |
| **接口地址** | `/v1/bots/:bot_id/unpublish` |
| **权限要求** | disconnectBot、Connector.disconnectBot（下架权限） |
| **文档链接** | [中文](https://www.coze.cn/docs/developer_guides/unpublish_agent) [English](https://www.coze.com/docs/developer_guides/unpublish_agent) |

## 接口描述

从扣子官方渠道及自定义渠道下架已发布的智能体。下架后，智能体将无法通过该渠道继续使用。

## 请求参数

### Header

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Personal Access Token，格式：Bearer {token} |
| Content-Type | string | 是 | application/json |

### Path 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bot_id | string | 是 | 要下架的智能体 ID |

### Body 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| connector_id | string | 是 | 要下架的渠道 ID |

### 可下架的渠道

> 💡 **如何获取 connector_id**
>
> 可以使用项目预设数据中的渠道常量：
>
> ```typescript
> import { PUBLISH_CONNECTORS } from '../presets/preset-data';
>
> // 下架指定渠道
> connector_id: PUBLISH_CONNECTORS.COZE_STORE
> ```
>
> **可用渠道列表：**
>
> | 常量名 | 渠道 ID | 渠道名称 |
> |--------|---------|----------|
> | COZE_STORE | 10000122 | 扣子商店 |
> | API | 1024 | API |
> | CHAT_SDK | 999 | Chat SDK |
> | DOUBAO | 482431 | 豆包 |
> | FEISHU | 10000011 | 飞书 |
> | WECHAT_MINI_PROGRAM | 10000127 | 微信小程序 |
> | WECHAT_CUSTOMER_SERVICE | 10000113 | 微信客服 |
> | WECHAT_SERVICE_ACCOUNT | 10000120 | 微信服务号 |
> | WECHAT_SUBSCRIPTION | 10000121 | 微信订阅号 |
> | DOUYIN_MINI_PROGRAM | 10000126 | 抖音小程序 |
> | FEISHU_BASE | 10000128 | 飞书多维表格 |
> | JUEJIN | 10000117 | 掘金 |
>
> 详细渠道信息请参考：[预设数据文档](../presets/preset-data.md)

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
| 4000108 | 渠道不存在 |
| 4000110 | 智能体未发布到该渠道 |
| 4000111 | 下架失败 |

## TypeScript 类型定义

```typescript
/**
 * 下架智能体请求参数
 */
export interface UnpublishBotReq {
  /** 要下架的智能体 ID */
  bot_id: string;
  /** 要下架的渠道 ID */
  connector_id: string;
}

/**
 * 下架智能体响应数据
 */
export interface UnpublishBotData {
  // 下架接口无返回数据
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

// 下架智能体
async function unpublishBot() {
  try {
    // 从 API 公开渠道下架
    await fetch('https://api.coze.cn/v1/bots/73823482348234XXXX/unpublish', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer your_personal_access_token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connector_id: 'api_public',
      }),
    });

    console.log('下架成功');

    // 从 Chat SDK 渠道下架
    await fetch('https://api.coze.cn/v1/bots/73823482348234XXXX/unpublish', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer your_personal_access_token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connector_id: 'chat_sdk',
      }),
    });

    console.log('从 Chat SDK 渠道下架成功');
  } catch (error) {
    console.error('下架失败：', error);
  }
}

// 执行下架
unpublishBot();
```

### cURL

```bash
# 从 API 公开渠道下架
curl -X POST 'https://api.coze.cn/v1/bots/73823482348234XXXX/unpublish' \
  -H 'Authorization: Bearer your_personal_access_token' \
  -H 'Content-Type: application/json' \
  -d '{
    "connector_id": "api_public"
  }'

# 从 Chat SDK 渠道下架
curl -X POST 'https://api.coze.cn/v1/bots/73823482348234XXXX/unpublish' \
  -H 'Authorization: Bearer your_personal_access_token' \
  -H 'Content-Type: application/json' \
  -d '{
    "connector_id": "chat_sdk"
  }'
```

### Python (使用 requests)

```python
import requests
import json

def unpublish_bot(bot_id, connector_id):
    url = f'https://api.coze.cn/v1/bots/{bot_id}/unpublish'
    headers = {
        'Authorization': 'Bearer your_personal_access_token',
        'Content-Type': 'application/json'
    }
    data = {
        'connector_id': connector_id
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    result = response.json()

    if result['code'] == 0:
        print(f'从 {connector_id} 渠道下架成功')
    else:
        print(f'下架失败：{result["msg"]}')

# 从 API 公开渠道下架
unpublish_bot('73823482348234XXXX', 'api_public')

# 从 Chat SDK 渠道下架
unpublish_bot('73823482348234XXXX', 'chat_sdk')
```

## 智能体生命周期

```
┌─────────────┐
│  创建智能体  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  配置智能体  │  (草稿状态)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  发布智能体  │  (调用发布 API)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  已发布状态  │  (可正常使用)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  下架智能体  │  (调用下架 API)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  已下架状态  │  (无法使用)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  重新发布   │  (可再次发布)
└─────────────┘
```

## 下架注意事项

1. **接口限制**:
   - 仅智能体所有者可以下架
   - 只能下架已发布的智能体
   - 需要指定要下架的渠道

2. **下架影响**:
   - 下架后，该智能体在指定渠道将无法继续使用
   - 正在进行的调用可能会受到影响
   - 下架操作不可逆，需要重新发布才能恢复

3. **多渠道发布**:
   - 如果智能体发布到多个渠道，需要分别下架
   - 下架一个渠道不影响其他渠道的使用

4. **重新发布**:
   - 下架后可以重新发布
   - 重新发布需要经过审核（如果需要）

5. **权限要求**:
   - 需要 disconnectBot 或 Connector.disconnectBot 权限
   - 只有智能体所有者才能下架

## 批量下架示例

```typescript
// 批量从所有渠道下架
async function unpublishFromAllChannels(botId: string) {
  // 先获取智能体详情，查看已发布的渠道
  const botInfo = await cozeApi.bots.retrieveNew(botId, {
    is_published: true,
  });

  // 根据已发布的渠道执行下架
  const channelsToUnpublish = ['api_public', 'chat_sdk'];

  for (const channel of channelsToUnpublish) {
    try {
      await fetch(`https://api.coze.cn/v1/bots/${botId}/unpublish`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer your_personal_access_token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connector_id: channel,
        }),
      });
      console.log(`从 ${channel} 渠道下架成功`);
    } catch (error) {
      console.error(`从 ${channel} 渠道下架失败：`, error);
    }
  }
}

// 执行批量下架
unpublishFromAllChannels('73823482348234XXXX');
```

## 下架回调事件

如果订阅了下架回调事件，当智能体下架时会收到回调通知：

```typescript
// 下架回调事件示例
{
  "event": "bot.unpublished",
  "bot_id": "73823482348234XXXX",
  "connector_id": "api_public",
  "unpublished_at": 1704153600,
  "operator_id": "73823482348234XXXX"
}
```
