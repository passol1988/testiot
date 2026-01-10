# 查看智能体列表 API

## 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | List Bots |
| **请求方式** | GET |
| **接口地址** | `/v1/bots` |
| **权限要求** | listBot（列出智能体权限） |
| **文档链接** | [中文](https://www.coze.cn/docs/developer_guides/bots_list_draft_published) [English](https://www.coze.com/docs/developer_guides/bots_list_draft_published) |

## 接口描述

查看指定空间的智能体列表，支持按发布状态筛选和分页查询。

## 请求参数

### Header

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Personal Access Token，格式：Bearer {token} |

### Query 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| workspace_id | string | 否 | 工作空间 ID |
| publish_status | string | 否 | 发布状态筛选 |
| connector_id | string | 否 | 渠道 ID（当 publish_status 为 published_online 或 published_draft 时需要设置） |
| page_size | number | 否 | 分页大小，默认 20 |
| page_num | number | 否 | 页码，默认 1 |

### 发布状态说明

| 值 | 说明 |
|----|------|
| `all` | 所有状态 |
| `published_online` | （默认）已发布的正式版 |
| `published_draft` | 已发布但当前为草稿状态 |
| `unpublished_draft` | 从未发布过 |

## 响应参数

### 成功响应

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | number | 状态码，0 表示成功 |
| msg | string | 响应消息 |
| data | object | 响应数据 |
| data.total | number | 智能体总数 |
| data.items | ListBotInfo[] | 智能体列表 |

### ListBotInfo 结构

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 智能体 ID |
| name | string | 智能体名称 |
| icon_url | string | 智能体头像 URL |
| updated_at | number | 最后更新时间（Unix 时间戳，秒） |
| description | string | 智能体描述 |
| is_published | boolean | 是否已发布 |
| published_at | number | 最后发布时间（Unix 时间戳，秒），仅已发布时返回 |
| owner_user_id | string | 智能体创建者的 Coze 用户 ID |

### 响应示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "total": 50,
    "items": [
      {
        "id": "73823482348234XXXX",
        "name": "客服助手",
        "icon_url": "https://lf3-static.bytednsdoc.com/...",
        "updated_at": 1704067200,
        "description": "这是一个智能客服助手",
        "is_published": true,
        "published_at": 1704067200,
        "owner_user_id": "73823482348234XXXX"
      },
      {
        "id": "73823482348234XXXY",
        "name": "翻译助手",
        "icon_url": "https://lf3-static.bytednsdoc.com/...",
        "updated_at": 1703980800,
        "description": "这是一个翻译助手",
        "is_published": false,
        "owner_user_id": "73823482348234XXXX"
      }
    ]
  }
}
```

### 错误响应

| 错误码 | 说明 |
|--------|------|
| 4000101 | 参数错误 |
| 4000103 | 权限不足 |
| 4000104 | 工作空间不存在 |

## TypeScript 类型定义

```typescript
/**
 * 查询智能体列表请求参数（新版）
 */
export interface ListBotNewReq {
  /** 工作空间 ID */
  workspace_id?: string;
  /**
   * 发布状态筛选
   * - all: 所有状态
   * - published_online: 已发布的正式版（默认）
   * - published_draft: 已发布但当前为草稿状态
   * - unpublished_draft: 从未发布过
   */
  publish_status?: string;
  /**
   * 渠道 ID
   * 仅在 publish_status 为 published_online 或 published_draft 时需要设置
   */
  connector_id?: string;
  /** 分页大小，默认 20 */
  page_size?: number;
  /** 页码，默认 1 */
  page_num?: number;
}

/**
 * 查询智能体列表响应数据（新版）
 */
export interface ListBotNewData {
  /** 智能体总数 */
  total: number;
  /** 智能体列表 */
  items: ListBotInfo[];
}

/**
 * 智能体列表项信息
 */
export interface ListBotInfo {
  /** 智能体 ID */
  id: string;
  /** 智能体名称 */
  name: string;
  /** 智能体头像 URL */
  icon_url: string;
  /** 最后更新时间（Unix 时间戳，秒） */
  updated_at: number;
  /** 智能体描述 */
  description: string;
  /** 是否已发布 */
  is_published: boolean;
  /** 最后发布时间（Unix 时间戳，秒），仅已发布时返回 */
  published_at?: number;
  /** 智能体创建者的 Coze 用户 ID */
  owner_user_id: string;
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

// 查询智能体列表
async function listBots() {
  try {
    // 查询已发布的智能体
    const publishedBots = await cozeApi.bots.listNew({
      workspace_id: '73823482348234XXXX',
      publish_status: 'published_online',
      page_size: 20,
      page_num: 1,
    });

    console.log('已发布智能体数量：', publishedBots.total);
    console.log('智能体列表：', publishedBots.items);

    // 查询所有智能体（包括草稿）
    const allBots = await cozeApi.bots.listNew({
      workspace_id: '73823482348234XXXX',
      publish_status: 'all',
      page_size: 50,
    });

    console.log('所有智能体数量：', allBots.total);

    return allBots;
  } catch (error) {
    console.error('查询失败：', error);
  }
}

// 执行查询
listBots();
```

### cURL

```bash
# 查询已发布的智能体
curl -X GET 'https://api.coze.cn/v1/bots?workspace_id=73823482348234XXXX&publish_status=published_online&page_size=20&page_num=1' \
  -H 'Authorization: Bearer your_personal_access_token'

# 查询所有智能体（包括草稿）
curl -X GET 'https://api.coze.cn/v1/bots?workspace_id=73823482348234XXXX&publish_status=all&page_size=50' \
  -H 'Authorization: Bearer your_personal_access_token'
```

### Python (使用 requests)

```python
import requests

def list_bots(workspace_id, publish_status='published_online', page_size=20, page_num=1):
    url = 'https://api.coze.cn/v1/bots'
    headers = {
        'Authorization': 'Bearer your_personal_access_token'
    }
    params = {
        'workspace_id': workspace_id,
        'publish_status': publish_status,
        'page_size': page_size,
        'page_num': page_num
    }

    response = requests.get(url, headers=headers, params=params)
    result = response.json()

    if result['code'] == 0:
        print(f"智能体总数：{result['data']['total']}")
        for bot in result['data']['items']:
            print(f"- {bot['name']} ({bot['id']}) - 已发布: {bot['is_published']}")
        return result['data']
    else:
        print(f"查询失败：{result['msg']}")

# 查询已发布的智能体
list_bots('73823482348234XXXX', 'published_online')

# 查询所有智能体
list_bots('73823482348234XXXX', 'all')
```

## 分页查询示例

```typescript
// 分页查询所有智能体
async function listAllBots(workspaceId: string) {
  const allBots: ListBotInfo[] = [];
  let page_num = 1;
  const page_size = 50;
  let hasMore = true;

  while (hasMore) {
    const result = await cozeApi.bots.listNew({
      workspace_id: workspaceId,
      publish_status: 'all',
      page_size,
      page_num,
    });

    allBots.push(...result.items);

    // 如果当前页获取的数据少于 page_size，说明已经是最后一页
    hasMore = result.items.length === page_size;
    page_num++;
  }

  return allBots;
}
```

## 发布状态说明图

```
智能体状态分类
├── all (所有状态)
│   ├── published_online (已发布的正式版)
│   │   └── 可以正常使用
│   ├── published_draft (已发布但当前为草稿)
│   │   └── 已发布过，但有未发布的修改
│   └── unpublished_draft (从未发布)
│       └── 还没有发布过
```

## 注意事项

1. **分页参数**:
   - `page_size` 建议设置为 20-100 之间
   - `page_num` 从 1 开始计数

2. **发布状态**:
   - 不传 `publish_status` 时，默认返回 `published_online` 状态的智能体
   - 如果要查看所有智能体（包括草稿），需要设置 `publish_status=all`

3. **排序规则**:
   - 默认按 `updated_at` 降序排序
   - 最新更新的智能体排在前面

4. **权限要求**:
   - 只能查询有权限访问的工作空间的智能体
   - 跨工作空间查询需要分别调用

5. **性能优化**:
   - 建议合理设置 `page_size`，避免一次获取过多数据
   - 对于大量数据，使用分页逐步获取
