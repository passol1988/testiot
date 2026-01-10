# 查看音色列表 API

## 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | List Voices |
| **请求方式** | GET |
| **接口地址** | `/v1/audio/voices` |
| **权限要求** | 查看音色权限 |
| **文档链接** | [中文](https://www.coze.cn/docs/developer_guides/list_voices) |

## 接口描述

调用此 API 可查看当前扣子用户可使用的音色列表，包括系统预置音色和自定义音色。系统音色由平台提供，自定义音色是通过声音复刻功能创建的。

## 请求参数

### Header

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Authorization | string | 是 | Personal Access Token，格式：Bearer {token} |

### Query 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| model_type | string | 否 | 音色模型类型，不填则返回所有类型 |
| filter_system_voice | boolean | 否 | 是否过滤系统音色，默认 false（不过滤） |
| page_num | number | 否 | 页码，从 1 开始，默认 1 |
| page_size | number | 否 | 每页数量，默认 100，范围 (0, 100] |

### model_type 参数说明

| 值 | 说明 |
|----|------|
| big | 大模型音色（高质量） |
| small | 小模型音色（快速响应） |

## 响应参数

### 成功响应

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data | object | 响应数据 |
| data.voice_list | Voice[] | 音色列表 |
| data.has_more | boolean | 是否还有更多数据 |

### Voice 对象结构

| 参数名 | 类型 | 说明 |
|--------|------|------|
| voice_id | string | 音色 ID，用于 TTS 合成时指定音色 |
| name | string | 音色名称 |
| language_code | string | 语言代码（如 zh、en、ja 等） |
| language_name | string | 语言名称 |
| is_system_voice | boolean | 是否为系统音色 |
| preview_text | string | 预览文本，默认为"你好，我是你的专属AI克隆声音..." |
| preview_audio | string | 预览音频 URL |
| create_time | number | 创建时间（Unix 时间戳，秒） |
| update_time | number | 更新时间（Unix 时间戳，秒） |
| available_training_times | number | 当前音色还可训练的次数（仅自定义音色） |
| support_emotions | EmotionInfo[] | 支持的情感列表（可选） |

### EmotionInfo 情感信息结构

| 参数名 | 类型 | 说明 |
|--------|------|------|
| emotion | string | 情感类型标识 |
| display_name | string | 情感显示名称 |
| emotion_scale_interval | Interval | 情感强度范围 |

### Interval 区间结构

| 参数名 | 类型 | 说明 |
|--------|------|------|
| min | number | 最小值 |
| max | number | 最大值 |
| default | number | 默认值 |

### 响应示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "voice_list": [
      {
        "voice_id": "zh_female_xiaoxiao_warm",
        "name": "温婉小晓",
        "language_code": "zh",
        "language_name": "中文",
        "is_system_voice": true,
        "preview_text": "你好，我是你的专属AI克隆声音，希望未来可以一起好好相处哦",
        "preview_audio": "https://example.com/preview_xiaoxiao.mp3",
        "create_time": 1704067200,
        "update_time": 1704067200,
        "available_training_times": 0,
        "support_emotions": [
          {
            "emotion": "happy",
            "display_name": "开心",
            "emotion_scale_interval": {
              "min": 0,
              "max": 100,
              "default": 50
            }
          }
        ]
      },
      {
        "voice_id": "custom_voice_12345",
        "name": "我的复刻音色",
        "language_code": "zh",
        "language_name": "中文",
        "is_system_voice": false,
        "preview_text": "你好，我是你的专属AI克隆声音，希望未来可以一起好好相处哦",
        "preview_audio": "https://example.com/preview_custom.mp3",
        "create_time": 1704153600,
        "update_time": 1704240000,
        "available_training_times": 3
      }
    ],
    "has_more": false
  }
}
```

### 错误响应

| 错误码 | 说明 |
|--------|------|
| 4000101 | 参数错误 |
| 4000103 | 权限不足 |

## TypeScript 类型定义

```typescript
/**
 * 查看音色列表请求参数
 */
export interface ListVoicesReq {
  /**
   * 音色模型的类型，如果不填，默认都返回
   * - big: 大模型音色（高质量）
   * - small: 小模型音色（快速响应）
   */
  model_type?: 'big' | 'small';
  /**
   * 是否过滤系统音色，默认 false（不过滤）
   */
  filter_system_voice?: boolean;
  /**
   * 页码，从 1 开始，默认 1
   */
  page_num?: number;
  /**
   * 每页数量，默认 100，范围 (0, 100]
   */
  page_size?: number;
}

/**
 * 查看音色列表响应数据
 */
export interface ListVoicesData {
  /** 音色列表 */
  voice_list: Voice[];
  /** 是否还有更多数据 */
  has_more: boolean;
}

/**
 * 音色信息
 */
export interface Voice {
  /** 音色 ID */
  voice_id: string;
  /** 音色名称 */
  name: string;
  /** 语言代码 */
  language_code: string;
  /** 语言名称 */
  language_name: string;
  /** 是否为系统音色 */
  is_system_voice: boolean;
  /** 预览文本 */
  preview_text: string;
  /** 预览音频 URL */
  preview_audio: string;
  /** 创建时间（Unix 时间戳） */
  create_time: number;
  /** 更新时间（Unix 时间戳） */
  update_time: number;
  /** 当前音色还可以训练的次数 */
  available_training_times: number;
  /** 支持的情感列表 */
  support_emotions?: EmotionInfo[];
}

/**
 * 情感信息
 */
export interface EmotionInfo {
  /** 情感类型标识 */
  emotion?: string;
  /** 情感显示名称 */
  display_name?: string;
  /** 情感强度范围 */
  emotion_scale_interval?: Interval;
}

/**
 * 区间范围
 */
export interface Interval {
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 默认值 */
  default?: number;
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

// 获取所有音色
async function getAllVoices() {
  try {
    const result = await cozeApi.audio.voices.list();

    console.log('音色列表：', result.voice_list);
    console.log('是否还有更多：', result.has_more);

    return result;
  } catch (error) {
    console.error('获取失败：', error);
  }
}

// 仅获取系统音色
async function getSystemVoices() {
  try {
    const result = await cozeApi.audio.voices.list({
      // 不设置 filter_system_voice（默认 false），系统音色会包含在结果中
      model_type: 'big',  // 仅获取大模型音色
    });

    const systemVoices = result.voice_list.filter(v => v.is_system_voice);
    console.log('系统音色：', systemVoices);

    return systemVoices;
  } catch (error) {
    console.error('获取失败：', error);
  }
}

// 获取自定义音色
async function getCustomVoices() {
  try {
    const result = await cozeApi.audio.voices.list();

    const customVoices = result.voice_list.filter(v => !v.is_system_voice);
    console.log('自定义音色：', customVoices);

    return customVoices;
  } catch (error) {
    console.error('获取失败：', error);
  }
}

// 分页获取音色
async function getVoicesWithPagination() {
  try {
    let allVoices: any[] = [];
    let pageNum = 1;
    let hasMore = true;

    while (hasMore) {
      const result = await cozeApi.audio.voices.list({
        page_num: pageNum,
        page_size: 50,
      });

      allVoices.push(...result.voice_list);
      hasMore = result.has_more;
      pageNum++;
    }

    console.log(`共获取 ${allVoices.length} 个音色`);
    return allVoices;
  } catch (error) {
    console.error('获取失败：', error);
  }
}

// 按语言筛选音色
async function getVoicesByLanguage(languageCode: string) {
  try {
    const result = await cozeApi.audio.voices.list();

    const filteredVoices = result.voice_list.filter(
      v => v.language_code === languageCode
    );

    console.log(`${languageCode} 语言音色：`, filteredVoices);
    return filteredVoices;
  } catch (error) {
    console.error('获取失败：', error);
  }
}

// 执行获取
getAllVoices();
```

### cURL

```bash
# 获取所有音色
curl -X GET 'https://api.coze.cn/v1/audio/voices' \
  -H 'Authorization: Bearer your_personal_access_token'

# 仅获取大模型音色
curl -X GET 'https://api.coze.cn/v1/audio/voices?model_type=big' \
  -H 'Authorization: Bearer your_personal_access_token'

# 分页获取
curl -X GET 'https://api.coze.cn/v1/audio/voices?page_num=1&page_size=50' \
  -H 'Authorization: Bearer your_personal_access_token'

# 排除系统音色（需要手动过滤）
curl -X GET 'https://api.coze.cn/v1/audio/voices' \
  -H 'Authorization: Bearer your_personal_access_token'
```

### Python (使用 requests)

```python
import requests

def list_voices(token, model_type=None, page_num=1, page_size=100):
    url = 'https://api.coze.cn/v1/audio/voices'
    headers = {
        'Authorization': f'Bearer {token}'
    }
    params = {
        'page_num': page_num,
        'page_size': page_size
    }

    if model_type:
        params['model_type'] = model_type

    response = requests.get(url, headers=headers, params=params)
    result = response.json()

    if result['code'] == 0:
        voices = result['data']['voice_list']
        has_more = result['data']['has_more']

        print(f'获取到 {len(voices)} 个音色')
        for voice in voices:
            print(f"- {voice['name']} ({voice['voice_id']})")

        return voices, has_more
    else:
        print(f'获取失败：{result["msg"]}')
        return [], False

# 获取所有音色
voices, has_more = list_voices('your_personal_access_token')

# 仅获取大模型音色
big_model_voices, _ = list_voices(
    'your_personal_access_token',
    model_type='big'
)

# 获取自定义音色
def get_custom_voices(token):
    voices, _ = list_voices(token)
    custom_voices = [v for v in voices if not v['is_system_voice']]

    print(f'\\n自定义音色：')
    for voice in custom_voices:
        print(f"- {voice['name']} (可训练次数: {voice['available_training_times']})")

    return custom_voices

custom_voices = get_custom_voices('your_personal_access_token')
```

## 音色选择器组件示例

```typescript
import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { CozeAPI } from '@coze/api';
import type { Voice } from '@coze/api';

const cozeApi = new CozeAPI({
  baseURL: 'https://api.coze.cn',
  token: 'your_personal_access_token',
});

interface VoiceSelectorProps {
  value?: string;
  onChange?: (voiceId: string) => void;
  language?: string;  // 语言筛选
  modelType?: 'big' | 'small';  // 模型类型筛选
}

function VoiceSelector({
  value,
  onChange,
  language,
  modelType
}: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVoices = async () => {
      setLoading(true);
      try {
        const result = await cozeApi.audio.voices.list({
          model_type: modelType,
        });

        let filtered = result.voice_list;

        // 按语言筛选
        if (language) {
          filtered = filtered.filter(v => v.language_code === language);
        }

        setVoices(filtered);
      } catch (error) {
        console.error('获取音色失败：', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, [language, modelType]);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="选择音色"
      loading={loading}
      showSearch
      optionFilterProp="label"
      notFoundContent={loading ? <Spin size="small" /> : '暂无音色'}
    >
      {voices.map(voice => (
        <Select.Option
          key={voice.voice_id}
          value={voice.voice_id}
          label={voice.name}
        >
          <div>
            <div>{voice.name}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {voice.language_name} |
              {voice.is_system_voice ? '系统音色' : '自定义音色'}
            </div>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

export default VoiceSelector;
```

## 音色预览播放器示例

```typescript
import React, { useState } from 'react';
import { Button, PlayCircleOutlined } from 'antd';

interface VoicePreviewPlayerProps {
  previewAudio: string;
  previewText: string;
  voiceName: string;
}

function VoicePreviewPlayer({
  previewAudio,
  previewText,
  voiceName
}: VoicePreviewPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (!audio) {
      const newAudio = new Audio(previewAudio);
      newAudio.onended = () => setPlaying(false);
      setAudio(newAudio);
      newAudio.play();
    } else {
      if (playing) {
        audio.pause();
      } else {
        audio.play();
      }
    }
    setPlaying(!playing);
  };

  return (
    <div>
      <Button
        type="text"
        icon={<PlayCircleOutlined />}
        onClick={handlePlay}
      >
        {playing ? '暂停' : '试听'} {voiceName}
      </Button>
      <p style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
        "{previewText}"
      </p>
    </div>
  );
}

export default VoicePreviewPlayer;
```

## 常见使用场景

### 1. TTS 语音合成时选择音色

```typescript
// 获取中文系统音色
const result = await cozeApi.audio.voices.list();
const chineseSystemVoices = result.voice_list.filter(
  v => v.language_code === 'zh' && v.is_system_voice
);

// 使用音色进行 TTS 合成
const voiceId = chineseSystemVoices[0].voice_id;

// 在 TTS API 中使用 voice_id
// await cozeApi.audio.speech.create({
//   input_text: '你好，世界！',
//   voice_id: voiceId,
// });
```

### 2. 创建音色管理界面

```typescript
// 音色列表管理组件
function VoiceManager() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [filter, setFilter] = useState<'all' | 'system' | 'custom'>('all');

  useEffect(() => {
    const loadVoices = async () => {
      const result = await cozeApi.audio.voices.list();

      let filtered = result.voice_list;
      if (filter === 'system') {
        filtered = filtered.filter(v => v.is_system_voice);
      } else if (filter === 'custom') {
        filtered = filtered.filter(v => !v.is_system_voice);
      }

      setVoices(filtered);
    };

    loadVoices();
  }, [filter]);

  return (
    <div>
      <div>
        <button onClick={() => setFilter('all')}>全部</button>
        <button onClick={() => setFilter('system')}>系统音色</button>
        <button onClick={() => setFilter('custom')}>自定义音色</button>
      </div>
      <ul>
        {voices.map(voice => (
          <li key={voice.voice_id}>
            {voice.name} - {voice.language_name}
            {!voice.is_system_voice && ` (可训练: ${voice.available_training_times})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 3. 多语言音色选择

```typescript
// 按语言分组获取音色
async function getVoicesByLanguageGroup() {
  const result = await cozeApi.audio.voices.list();

  const grouped = result.voice_list.reduce((acc, voice) => {
    const lang = voice.language_name;
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, Voice[]>);

  return grouped;
}

// 使用示例
const groupedVoices = await getVoicesByLanguageGroup();
console.log('中文音色：', groupedVoices['中文']);
console.log('英文音色：', groupedVoices['English']);
```

## 注意事项

1. **系统音色 vs 自定义音色**:
   - 系统音色由平台提供，稳定可靠
   - 自定义音色通过声音复刻创建，需要训练时间
   - `is_system_voice` 字段可以区分两者

2. **音色训练次数**:
   - 自定义音色有训练次数限制 (`available_training_times`)
   - 系统音色该值始终为 0

3. **模型类型选择**:
   - `big`: 大模型，音质更好，但速度较慢
   - `small`: 小模型，响应更快，适合实时场景

4. **分页处理**:
   - 使用 `page_num` 和 `page_size` 控制分页
   - 注意 `has_more` 字段判断是否还有下一页

5. **预览音频**:
   - `preview_audio` 字段提供了音色试听的音频 URL
   - 可以在 UI 中提供播放按钮让用户试听

6. **情感支持**:
   - 部分音色支持情感调节 (`support_emotions`)
   - 可以通过情感参数调整合成语音的情感表达

## 相关接口

- [语音合成 API](https://www.coze.cn/docs/developer_guides/text_to_speech) - 使用音色进行 TTS 合成
- [声音复刻 API](https://www.coze.cn/docs/developer_guides/clone_voice) - 创建自定义音色
