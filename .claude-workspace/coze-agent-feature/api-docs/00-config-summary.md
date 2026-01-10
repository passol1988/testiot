# Coze API 配置参数总结

本文档总结了 Coze API 中与智能体创建、会话、房间相关的所有可配置参数，方便在开发时进行规划。

---

## 一、智能体创建配置 (Bot Creation)

### CreateBotReq - 创建智能体请求

#### 基础配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| space_id | string | 是 | 工作空间 ID |
| name | string | 是 | 智能体名称，1-20 字符 |
| description | string | 否 | 描述信息，0-500 字符 |
| icon_file_id | string | 否 | 头像文件 ID（需先上传文件） |

#### 提示词配置 (prompt_info)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| prompt | string | 是 | 智能体提示词/Prompt |

#### 开场白配置 (onboarding_info)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| prologue | string | 是 | 开场白内容 |
| suggested_questions | string[] | 否 | 建议问题列表 |

#### 模型配置 (model_info_config)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| model_id | string | 是 | 模型 ID（使用预设数据常量） |
| temperature | number | 否 | 采样温度 |
| top_p | number | 否 | Top P 采样（核采样） |
| top_k | number | 否 | Top K 采样 |
| max_tokens | number | 否 | 生成 token 最大数量 |
| context_round | number | 否 | 上下文轮数 |
| response_format | string | 否 | 输出格式：text / markdown / json |
| presence_penalty | number | 否 | 重复主题的惩罚 |
| frequency_penalty | number | 否 | 重复语句的惩罚 |

#### 插件配置 (plugin_id_list)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id_list | PluginIdInfo[] | 否 | 插件 ID 列表 |

`PluginIdInfo` 结构：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plugin_id | string | 是 | 插件 ID |
| api_id | string | 否 | API ID |

#### 工作流配置 (workflow_id_list)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | WorkflowIdInfo[] | 否 | 工作流 ID 列表 |

`WorkflowIdInfo` 结构：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 工作流 ID |

#### 知识库配置 (knowledge)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_ids | string[] | 否 | 数据集 ID 列表 |
| auto_call | boolean | 否 | 是否自动调用知识库 |
| search_strategy | number | 否 | 搜索策略 |

#### 建议回复配置 (suggest_reply_info)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| reply_mode | SuggestReplyMode | 是 | 建议回复模式 |
| customized_prompt | string | 否 | 自定义提示词（reply_mode=customized 时必填） |

`SuggestReplyMode` 枚举值：
| 值 | 说明 |
|----|------|
| disable | Bot 不建议回复 |
| enable | Bot 建议回复 |
| customized | Bot 根据自定义提示词建议回复 |

---

## 二、会话配置 (Chat)

### CreateChatReq - 创建会话请求

#### 基础配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bot_id | string | 是 | 智能 Bot ID |
| user_id | string | 否 | 用户 ID（业务系统自定义） |
| conversation_id | string | 否 | 会话 ID（不填则自动创建） |
| auto_save_history | boolean | 否 | 是否自动保存历史记录，默认 true |

#### 消息配置 (additional_messages)

数组长度限制 100 条消息。

`EnterMessage` 结构：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| role | string | 是 | user / assistant |
| content | string / ObjectStringItem[] | 是 | 消息内容 |
| content_type | string | 否 | text / object_string / card |
| type | string | 否 | query / answer / function_call / tool_output / follow_up / verbose |
| meta_data | Record<string, string> | 否 | 自定义元数据（16 组键值对） |

`ObjectStringItem` 多模态内容类型：
| 类型 | 参数 | 说明 |
|------|------|------|
| text | text | 纯文本 |
| image | file_id / file_url | 图片 |
| file | file_id / file_url | 文件 |
| audio | file_id / file_url | 音频 |

#### 变量配置 (custom_variables)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | string | - | 变量名（在提示词中用 {{key}} 引用） |
| value | string | - | 变量值（支持 Jinja2 语法） |

#### 元数据配置 (meta_data)

自定义键值对，16 组键值对：
- key 长度：1-64 字符
- value 长度：1-512 字符

#### 附加参数 (extra_params)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 自定义键值对 | string | 否 | 额外的自定义参数 |

#### 快捷指令配置 (shortcut_command)

`ShortcutCommand` 结构：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| command_id | string | 是 | 快捷指令 ID |
| parameters | Record<string, ObjectStringItem \| string> | 否 | 指令参数 |

#### 自定义参数 (parameters)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 自定义键值对 | unknown | 否 | 赋值给聊天流起始节点的输入参数 |

---

## 三、音频房间配置 (Audio Rooms)

### CreateRoomReq - 创建房间请求

#### 基础配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bot_id | string | 是 | 智能 Bot ID |
| connector_id | string | 是 | 发布渠道 ID |
| conversation_id | string | 否 | 会话 ID |
| voice_id | string | 否 | 音色 ID |
| workflow_id | string | 否 | 工作流 ID |
| uid | string | 否 | 用户 ID |

#### 房间配置 (config)

`RoomConfig` 结构：

**视频配置 (video_config)**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| stream_video_type | string | 否 | main / screen |

**开场白配置 (prologue_content)**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| prologue_content | string | 否 | 开场白内容 |

**翻译配置 (translate_config)**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| from | string | 是 | 源语言 |
| to | string | 是 | 目标语言 |

**房间模式 (room_mode)**
| 值 | 说明 |
|----|------|
| default | 普通模式 |
| s2s | 端到端模式 |
| podcast | 博客模式 |
| translate | 翻译模式 |

**语音活动检测配置 (turn_detection)**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | server_vad / client_vad / client_interrupt |

---

## 四、语音合成配置 (TTS / Speech)

### CreateSpeechReq - 语音合成请求

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| input | string | 是 | 待合成文本（最大 1024 字符） |
| voice_id | string | 是 | 音色 ID |
| response_format | string | 否 | 音频格式：wav / pcm / ogg / opus / mp3（默认 mp3） |
| speed | number | 否 | 语速，范围 [0.2, 3]，默认 1 |
| sample_rate | number | 否 | 采样率，默认 24000，支持 8000/16000/24000/32000/44100/48000 |
| emotion | string | 否 | 情感类型 |
| emotion_scale | number | 否 | 情感强度，范围 [1, 5]，默认 4 |

---

## 五、会话创建配置 (Conversations)

### CreateConversationReq - 创建会话请求

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bot_id | string | 否 | 绑定 Bot 进行隔离 |
| messages | EnterMessage[] | 否 | 会话中的消息内容 |
| meta_data | Record<string, string> | 否 | 自定义元数据 |

---

## 六、WebSocket 语音对话配置 (WsChatClient)

### WsChatClient 初始化配置

#### 基础配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string \| function | 是 | Personal Access Token 或返回 Token 的函数 |
| baseWsURL | string | 是 | WebSocket 基础 URL（默认 wss://ws.coze.cn） |
| botId | string | 是 | 智能体 ID |
| voiceId | string | 否 | 音色 ID（用于 TTS 输出） |
| workflowId | string | 否 | 工作流 ID |
| debug | boolean | 否 | 开发模式，输出详细日志 |
| allowPersonalAccessTokenInBrowser | boolean | 是 | 是否允许浏览器使用 PAT |
| headers | Headers \| Record | 否 | 自定义 HTTP 头 |
| websocketOptions | WebsocketOptions | 否 | WebSocket 连接选项（见下文） |
| playbackVolumeDefault | number | 否 | 默认播放音量 [0, 1]，默认 1 |
| mediaStreamTrack | MediaStreamTrack | 否 | 自定义音频流轨道 |

#### 音频采集配置 (audioCaptureConfig)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| echoCancellation | boolean | 否 | 回声消除（默认 true） |
| noiseSuppression | boolean | 否 | 噪声抑制（浏览器原生） |
| autoGainControl | boolean | 否 | 自动增益控制（默认 true） |

#### AI 降噪配置 (aiDenoisingConfig)

当不使用浏览器原生噪声抑制时，启用 AI 降噪：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| mode | AIDenoiserProcessorMode | 是 | 降噪模式：NSNG（推荐）/ STATIONARY_NS |
| level | AIDenoiserProcessorLevel | 是 | 降噪强度：SOFT（推荐）/ AGGRESSIVE |
| assetsPath | string | 是 | AI 降噪资源路径 |

#### 音频录制配置 (wavRecordConfig)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| enableSourceRecord | boolean | 否 | 启用原始音频录制 |
| enableDenoiseRecord | boolean | 否 | 启用降噪后音频录制 |

#### 设备配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| deviceId | string | 否 | 指定麦克风设备 ID |
| audioMutedDefault | boolean | 否 | 默认静音麦克风 |
| enableLocalLoopback | boolean | 否 | 启用本地回环（鸿蒙手机需设为 true） |

#### WebSocket 连接选项 (websocketOptions)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| WebSocket | any | 否 | 自定义 WebSocket 类 |
| maxReconnectionDelay | number | 否 | 最大重连延迟（ms），默认 10000 |
| minReconnectionDelay | number | 否 | 最小重连延迟（ms），默认 1000 |
| reconnectionDelayGrowFactor | number | 否 | 重连延迟增长因子，默认 1.3 |
| minUptime | number | 否 | 最小连接时间（ms），默认 5000 |
| connectionTimeout | number | 否 | 连接超时（ms），默认 4000 |
| maxRetries | number | 否 | 最大重试次数，默认 Infinity |
| maxEnqueuedMessages | number | 否 | 最大排队消息数，默认 1000 |
| startClosed | boolean | 否 | 是否开始时关闭连接，默认 false |
| debug | boolean | 否 | WebSocket 调试模式 |
| headers | Record<string, string> | 否 | WebSocket 自定义头 |

### 连接配置 (chatUpdate)

连接时传入的 ChatUpdateEvent 配置：

#### 对话配置 (chat_config)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 否 | 用户 ID |
| conversation_id | string | 否 | 会话 ID |
| auto_save_history | boolean | 否 | 自动保存历史 |
| custom_variables | Record<string, string> | 否 | 自定义变量 |
| meta_data | Record<string, string> | 否 | 元数据 |
| extra_params | object | 否 | 额外参数（如经纬度） |
| parameters | Record<string, any> | 否 | 聊天流起始节点参数 |

#### 输入音频配置 (input_audio)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| format | string | 否 | 音频格式：pcm / wav / ogg（默认 pcm） |
| codec | string | 否 | 编码格式：pcm / opus / g711a / g711u（默认 pcm） |
| sample_rate | number | 否 | 采样率（默认 48000） |
| channel | number | 否 | 声道数（默认 1） |
| bit_depth | number | 否 | 位深度（默认 16） |

#### 输出音频配置 (output_audio)

**基础配置**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| codec | string | 否 | 编码：pcm / opus / g711a / g711u |
| voice_id | string | 否 | 音色 ID |
| speech_rate | number | 否 | 语速调节 [-50, 100]，默认 0<br>-50 = 0.5倍速, 0 = 原速, 100 = 2倍速 |

**PCM 编码配置 (pcm_config)**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sample_rate | number | 否 | 采样率（默认 24000） |

**Opus 编码配置 (opus_config)**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sample_rate | number | 否 | 采样率（默认 24000） |
| bitrate | number | 否 | 码率（默认 48000） |
| use_cbr | boolean | 否 | 使用 CBR 编码（默认 false） |
| frame_size_ms | number | 否 | 帧长（默认 10ms） |

**情感配置 (emotion_config)**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| emotion | string | 否 | 情感类型（如 happy, sad） |
| emotion_scale | number | 否 | 情感强度 [1, 5]，默认 4 |

#### 语音活动检测配置 (turn_detection)

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | TurnDetectionType | 是 | 检测类型 |
| prefix_padding_ms | number | 否 | 语音前填充时长（ms），默认 600 |
| silence_duration_ms | number | 否 | 静音持续时间（ms），默认 500 |

**TurnDetectionType 类型**
| 值 | 说明 |
|----|------|
| server_vad | 服务端 VAD 检测 |
| client_interrupt | 客户端中断（按键说话） |
| client_vad | 客户端 VAD 检测 |

#### 其他配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| need_play_prologue | boolean | 否 | 是否播放开场白（默认 false） |
| event_subscriptions | string[] | 否 | 订阅的事件列表 |
| voice_print_config | VoicePrintConfig | 否 | 声纹配置 |

**声纹配置 (VoicePrintConfig)**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| group_id | string | 是 | 声纹分组 ID |
| score | number | 否 | 匹配阈值 |
| reuse_voice_info | boolean | 否 | 复用声纹信息 |

### 运行时方法

| 方法 | 说明 |
|------|------|
| setPlaybackVolume(volume: number) | 设置播放音量 [0, 1] |
| getPlaybackVolume() | 获取当前播放音量 |
| setAudioInputDevice(deviceId: string) | 切换输入设备 |
| setAudioEnable(enable: boolean) | 设置是否静音 |
| startRecord() | 开始录音（client_interrupt 模式） |
| stopRecord() | 停止录音 |
| interrupt() | 打断对话 |
| setDenoiserEnabled(enabled: boolean) | 设置是否启用降噪 |
| setDenoiserLevel(level) | 设置降噪等级 |
| setDenoiserMode(mode) | 设置降噪模式 |
| disconnect() | 断开连接 |

### 事件监听 (WsChatEventNames)

客户端事件（client.*）：

| 事件名 | 说明 |
|--------|------|
| client.connected | 客户端已连接 |
| client.connecting | 客户端连接中 |
| client.disconnected | 客户端已断开 |
| client.interrupted | 客户端中断对话 |
| client.audio.muted | 麦克风已静音 |
| client.audio.unmuted | 麦克风已取消静音 |
| client.denoiser.enabled | 降噪已启用 |
| client.denoiser.disabled | 降噪已禁用 |
| client.input.device.changed | 输入设备已改变 |
| client.output.device.changed | 输出设备已改变 |
| client.audio.sentence.playback_start | 句子开始播放 |
| client.audio.sentence.playback_ended | 句子播放结束 |
| client.audio.input.dump | 音频输入 dump |
| client.error | 客户端错误 |

服务端事件（server.*）：

| 事件名 | 说明 |
|--------|------|
| server.chat.created | 对话创建成功 |
| server.chat.updated | 对话更新 |
| server.conversation.chat.created | 会话对话创建 |
| server.conversation.chat.in_progress | 对话正在处理中 |
| server.conversation.message.delta | 文本消息增量返回 |
| server.conversation.audio.delta | 语音消息增量返回 |
| server.conversation.message.completed | 文本消息完成 |
| server.conversation.audio.completed | 语音回复完成 |
| server.conversation.chat.completed | 对话完成 |
| server.conversation.chat.failed | 对话失败 |
| server.conversation.chat.cancelled | 对话被取消 |
| server.conversation.cleared | 对话上下文已清除 |
| server.conversation.audio_transcript.update | 用户语音识别实时字幕更新 |
| server.conversation.audio_transcript.completed | 用户语音识别完成 |
| server.conversation.audio.sentence_start | 音频句子开始 |
| server.input_audio_buffer.completed | 语音输入缓冲区提交完成 |
| server.input_audio_buffer.cleared | 语音输入缓冲区已清除 |
| server.input_audio_buffer.speech_started | 检测到用户开始说话 |
| server.input_audio_buffer.speech_stopped | 检测到用户停止说话 |
| server.dump.audio | 音频 dump |
| server.error | 服务端错误 |

**事件监听示例：**
```typescript
client.on(WsChatEventNames.CONVERSATION_AUDIO_DELTA, (_, data) => {
  console.log('收到音频数据', data);
});

client.on(WsChatEventNames.CONVERSATION_MESSAGE_DELTA, (_, data) => {
  console.log('收到文本消息', data);
});

client.on(WsChatEventNames.CONVERSATION_AUDIO_TRANSCRIPT_UPDATE, (_, data) => {
  console.log('语音识别结果', data);
});
```

---

## 七、WebSocket 语音转录配置 (WsTranscriptionClient)

### 初始化配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string \| function | 是 | Personal Access Token |
| baseWsURL | string | 是 | WebSocket 基础 URL |
| debug | boolean | 否 | 开发模式 |
| allowPersonalAccessTokenInBrowser | boolean | 是 | 是否允许浏览器使用 PAT |
| deviceId | string | 否 | 音频输入设备 ID |
| audioCaptureConfig | AudioCaptureConfig | 否 | 音频采集配置 |
| aiDenoisingConfig | AIDenoisingConfig | 否 | AI 降噪配置 |
| mediaStreamTrack | MediaStreamTrack \| function | 否 | 自定义音频流 |
| wavRecordConfig | WavRecordConfig | 否 | 音频录制配置（仅 debug=true 时有效） |
| entityType | 'bot' \| 'workflow' | 否 | 实体类型 |
| entityId | string | 否 | 实体 ID |
| transcriptionUpdateData | object | 否 | 初始语音识别更新配置 |

### 连接配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| input_audio | AudioConfig | 否 | 输入音频配置 |

---

## 八、WebSocket 同传翻译配置 (WsSimultInterpretationClient)

### 初始化配置

配置与 `WsTranscriptionClient` 相同，增加翻译配置：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| translate_config | TranslateConfig | 是 | 翻译配置 |

### TranslateConfig 结构

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| from | string | 是 | 源语言（如：zh, en） |
| to | string | 是 | 目标语言 |
| hot_words | string[] | 否 | 热词列表 |
| glossary | GlossaryItem[] | 否 | 术语表 |

**GlossaryItem 结构：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| original | string | 是 | 原文 |
| translation | string | 是 | 译文 |

### 同传翻译事件

| 事件名 | 说明 |
|--------|------|
| simult_interpretation.created | 同传翻译创建 |
| simult_interpretation.updated | 同传翻译更新 |
| simult_interpretation.audio.delta | 音频增量返回 |
| simult_interpretation.transcription.delta | 转录增量返回 |
| simult_interpretation.translation.delta | 翻译增量返回 |
| simult_interpretation.message.completed | 消息完成 |

---

## 九、WebSocket 语音合成配置 (WsSpeechClient)

### WsSpeechClient 初始化配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | Personal Access Token |
| baseWsURL | string | 是 | WebSocket 基础 URL |
| debug | boolean | 否 | 开发模式 |
| allowPersonalAccessTokenInBrowser | boolean | 是 | 是否允许浏览器使用 PAT |

### 连接配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| voiceId | string | 是 | 音色 ID |

### 语音合成方法

| 方法 | 说明 |
|------|------|
| append(text: string) | 追加文本（流式） |
| appendAndComplete(text: string) | 整句播放 |
| complete() | 标记文本结束 |
| interrupt() | 中断播放 |
| pause() | 暂停播放 |
| resume() | 恢复播放 |

### 事件监听

| 事件 | 说明 |
|------|------|
| completed | 合成完成（含中断） |
| data | 收到数据事件 |

---

## 十、配置规划建议

### 关于 emotion（情感）配置的重要说明

⚠️ **emotion 和 emotion_scale 需要音色支持**

**如何判断音色是否支持情感：**
1. 调用 `/v1/audio/voices` 接口获取音色列表
2. 检查音色的 `support_emotions` 字段
3. 如果该字段存在且有值，表示支持情感调节

**支持情感的音色示例：**
```typescript
// 获取音色列表
const voices = await cozeApi.audio.voices.list();

// 筛选支持情感的音色
const emotionalVoices = voices.voice_list.filter(
  v => v.support_emotions && v.support_emotions.length > 0
);

// 查看支持的情感类型
const voice = emotionalVoices[0];
voice.support_emotions.forEach(emotion => {
  console.log(`情感: ${emotion.display_name}`);
  console.log(`  类型: ${emotion.emotion}`);
  console.log(`  范围: ${emotion.emotion_scale_interval.min} - ${emotion.emotion_scale_interval.max}`);
  console.log(`  默认: ${emotion.emotion_scale_interval.default}`);
});
```

**情感配置示例：**
```typescript
// 仅在音色支持时配置 emotion
output_audio: {
  codec: 'pcm',
  voice_id: 'zh_female_emotional',  // 支持情感的音色
  emotion_config: {
    emotion: 'happy',      // 情感类型（从音色 support_emotions 中获取）
    emotion_scale: 4.0,    // 情感强度（从音色的 emotion_scale_interval 范围内选择）
  },
}
```

**不支持情感的音色：**
- 如果配置了 emotion_config 但音色不支持，参数会被忽略
- 建议在使用前先检查音色的 `support_emotions` 字段

---

## 十一、配置规划建议

### 智能体创建时需要配置

```typescript
// 最简配置
{
  space_id: string,
  name: string,
}

// 完整配置
{
  // 基础信息
  space_id: string,
  name: string,
  description: string,
  icon_file_id: string,

  // 行为配置
  prompt_info: { prompt: string },
  onboarding_info: {
    prologue: string,
    suggested_questions: string[]
  },

  // 模型配置
  model_info_config: {
    model_id: string,        // 使用预设常量
    temperature?: number,
    max_tokens?: number,
    // ... 其他模型参数
  },

  // 能力配置
  plugin_id_list: { id_list: [...] },
  workflow_id_list: { ids: [...] },
  knowledge: { ... },

  // 交互配置
  suggest_reply_info: {
    reply_mode: 'enable',
  },
}
```

### 发起对话时需要配置

```typescript
// 最简配置
{
  bot_id: string,
  additional_messages: [{
    role: 'user',
    content: '用户问题',
  }],
}

// 完整配置
{
  bot_id: string,
  user_id: string,              // 用户标识
  conversation_id: string,      // 继续会话
  auto_save_history: boolean,

  // 消息内容
  additional_messages: [...],   // 支持多模态

  // 变量注入
  custom_variables: {
    userName: '张三',
    userPreference: '...'
  },

  // 元数据
  meta_data: { ... },

  // 快捷指令
  shortcut_command: {
    command_id: string,
    parameters: { ... }
  },

  // 自定义参数
  parameters: { ... },
}
```

### 创建音频房间时需要配置

```typescript
{
  // 基础配置
  bot_id: string,
  connector_id: string,
  voice_id: string,           // 音色 ID

  // 房间配置
  config: {
    room_mode: 'default',     // 房间模式

    // 视频配置
    video_config: {
      stream_video_type: 'main'
    },

    // 翻译配置
    translate_config: {
      from: 'zh',
      to: 'en'
    },

    // 语音检测
    turn_detection: {
      type: 'server_vad'
    },

    // 开场白
    prologue_content: string,
  },
}
```

### 语音合成时需要配置

```typescript
{
  input: string,              // 待合成文本
  voice_id: string,           // 音色 ID

  // 音频参数
  response_format: 'mp3',
  speed: 1.0,                 // 语速 [0.2, 3]
  sample_rate: 24000,

  // 情感配置（部分音色支持）
  emotion: 'happy',
  emotion_scale: 4.0,         // [1, 5]
}
```

### WebSocket 语音对话时需要配置

**客户端初始化：**
```typescript
import { WsChatClient } from '@coze/api/ws-tools';

const client = new WsChatClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  botId: 'bot_id',
  voiceId: 'zh_female_warm',  // 音色 ID
  workflowId: 'workflow_id',  // 可选
  debug: false,

  // 音频采集配置
  audioCaptureConfig: {
    echoCancellation: true,    // 回声消除
    noiseSuppression: true,    // 浏览器噪声抑制
    autoGainControl: true,     // 自动增益
  },

  // AI 降噪配置（当 noiseSuppression = false 时）
  aiDenoisingConfig: {
    mode: 'NSNG',              // AI 降噪模式
    level: 'SOFT',             // 舒适降噪
    assetsPath: 'https://lf3-static.bytednsdoc.com/...',
  },

  // 设备配置
  deviceId: 'microphone_id',
  audioMutedDefault: false,
  enableLocalLoopback: false,  // 鸿蒙手机设为 true
});
```

**连接时配置 (chatUpdate)：**
```typescript
await client.connect({
  chatUpdate: {
    data: {
      // 对话配置
      chat_config: {
        user_id: 'user_123',
        conversation_id: 'conv_id',  // 继续会话
        auto_save_history: true,
        custom_variables: {
          userName: '张三',
        },
        meta_data: {
          source: 'web',
        },
      },

      // 输入音频配置
      input_audio: {
        format: 'pcm',
        codec: 'pcm',
        sample_rate: 48000,
        channel: 1,
      },

      // 输出音频配置
      output_audio: {
        codec: 'pcm',
        voice_id: 'zh_female_warm',
        speech_rate: 0,            // 语速调节 [-50, 100]
        pcm_config: {
          sample_rate: 24000,
        },
        emotion_config: {           // 情感配置
          emotion: 'happy',
          emotion_scale: 4,
        },
      },

      // 语音活动检测
      turn_detection: {
        type: 'server_vad',        // 或 'client_interrupt'
        prefix_padding_ms: 600,
        silence_duration_ms: 500,
      },

      // 其他配置
      need_play_prologue: true,    // 播放开场白
    },
  },
});
```

### WebSocket 语音合成时需要配置

```typescript
import { WsSpeechClient } from '@coze/api/ws-tools';

const speechClient = new WsSpeechClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  allowPersonalAccessTokenInBrowser: true,
  debug: false,
});

// 连接
await speechClient.connect({
  voiceId: 'zh_female_warm',      // 音色 ID
});

// 整句播放
speechClient.appendAndComplete('你好，这是一个测试。');

// 流式播放
speechClient.append('你好');
speechClient.append('，');
speechClient.append('这是');
speechClient.append('流式');
speechClient.append('播放');
speechClient.complete();

// 控制播放
speechClient.interrupt();  // 中断
speechClient.pause();      // 暂停
speechClient.resume();     // 恢复
```

---

## 七、预设数据使用

### 模型 ID 预设

```typescript
import { COZE_MODELS, RECOMMENDED_MODELS } from '../presets/preset-data';

// 直接使用常量
model_info_config: {
  model_id: COZE_MODELS.DOUBAO_PROGRAMMING
}

// 使用推荐模型
model_info_config: {
  model_id: RECOMMENDED_MODELS.DEFAULT
}
```

### 音色 ID 获取

```typescript
// 获取音色列表
const voices = await cozeApi.audio.voices.list();

// 筛选系统音色
const systemVoices = voices.voice_list.filter(v => v.is_system_voice);

// 按语言筛选
const chineseVoices = voices.voice_list.filter(v => v.language_code === 'zh');

// 选择音色
const voice_id = systemVoices[0].voice_id;
```

---

## 八、参数限制说明

### 字符串长度限制

| 参数 | 限制 |
|------|------|
| name | 1-20 字符 |
| description | 0-500 字符 |
| input (TTS) | 最大 1024 字符 |
| voice_name | 必须 > 6 字符 |
| meta_data key | 1-64 字符 |
| meta_data value | 1-512 字符 |

### 数量限制

| 参数 | 限制 |
|------|------|
| additional_messages | 最多 100 条 |
| meta_data 键值对 | 最多 16 组 |
| suggested_questions | 建议不超过 5 个 |
| page_size | (0, 100] |
| temperature | 通常 0-2 |
| speed (TTS) | [0.2, 3] |
| emotion_scale | [1, 5] |
| speech_rate (WebSocket) | [-50, 100] |
| prefix_padding_ms | 默认 600ms |
| silence_duration_ms | 默认 500ms |

---

## 十三、配置检查清单

### 创建智能体前检查

- [ ] 已获取 space_id
- [ ] 已选择 model_id（使用预设常量）
- [ ] 已编写 prompt（提示词）
- [ ] 已设置开场白（可选）
- [ ] 如需头像，已上传并获取 icon_file_id
- [ ] 如需插件/工作流，已获取对应 ID
- [ ] 如需知识库，已获取 dataset_ids

### 发起对话前检查

- [ ] 已获取 bot_id（必须是已发布的 Bot）
- [ ] 已准备用户问题
- [ ] 如需多轮对话，已准备 conversation_id
- [ ] 如需传入变量，已准备 custom_variables
- [ ] 如需多模态，已准备文件 ID 或 URL

### 创建房间前检查

- [ ] 已获取 bot_id
- [ ] 已获取 connector_id（发布渠道）
- [ ] 已选择 voice_id（音色）
- [ ] 已确定 room_mode（房间模式）
- [ ] 如需翻译，已配置 translate_config

### 语音合成前检查

- [ ] 已获取 voice_id
- [ ] 文本长度不超过 1024 字符
- [ ] 已选择音频格式（默认 mp3）
- [ ] 如需情感调节，确认音色支持

### WebSocket 语音对话前检查

- [ ] 已获取 PAT 和 botId
- [ ] 已获取 voice_id（音色 ID）
- [ ] 已选择 turn_detection 类型
- [ ] 已配置音频采集参数
- [ ] 如需 AI 降噪，确认浏览器支持
- [ ] 已设置输入/输出音频配置
- [ ] 如需情感调节，配置 emotion_config

---

## 十四、常见配置组合

### 编程助手智能体

```typescript
{
  name: '编程助手',
  description: '专业的编程助手，帮助解决编程问题',
  model_info_config: {
    model_id: COZE_MODELS.DOUBAO_PROGRAMMING,
    temperature: 0.3,  // 降低随机性
    max_tokens: 4096,
  },
  prompt_info: {
    prompt: '你是一个专业的编程助手...'
  },
  suggest_reply_info: {
    reply_mode: 'enable'
  }
}
```

### 快速对话机器人

```typescript
{
  name: '快速对话',
  model_info_config: {
    model_id: RECOMMENDED_MODELS.FAST_RESPONSE,  // 极速模型
  },
  onboarding_info: {
    prologue: '你好！有什么可以帮助你的吗？',
    suggested_questions: ['你能做什么？', '怎么用？']
  }
}
```

### 语音聊天房间

```typescript
{
  bot_id: 'xxx',
  connector_id: 'xxx',
  voice_id: 'zh_female_warm',
  config: {
    room_mode: 'default',
    turn_detection: {
      type: 'server_vad'  // 服务端语音检测
    },
    prologue_content: '你好，我是你的语音助手'
  }
}
```

### 翻译助手

```typescript
{
  name: '翻译助手',
  model_info_config: {
    model_id: COZE_MODELS.DOUBAO_16_FLASH,
    temperature: 0.1
  },
  // 创建房间时
  config: {
    room_mode: 'translate',
    translate_config: {
      from: 'zh',
      to: 'en'
    }
  }
}
```

### WebSocket 语音对话（服务端 VAD 模式）

```typescript
// 服务端自动检测语音停止
await client.connect({
  chatUpdate: {
    data: {
      input_audio: {
        format: 'pcm',
        codec: 'pcm',
        sample_rate: 48000,
      },
      output_audio: {
        codec: 'pcm',
        voice_id: 'zh_female_warm',
        speech_rate: 0,
      },
      turn_detection: {
        type: 'server_vad',
        silence_duration_ms: 500,  // 静音 500ms 后停止
      },
      need_play_prologue: true,
    },
  },
});
```

### WebSocket 语音对话（按键说话模式）

```typescript
// 用户按住按钮说话，松开发送
await client.connect({
  chatUpdate: {
    data: {
      input_audio: {
        format: 'pcm',
        codec: 'pcm',
        sample_rate: 48000,
      },
      output_audio: {
        codec: 'pcm',
        voice_id: 'zh_male_calm',
      },
      turn_detection: {
        type: 'client_interrupt',  // 客户端控制
      },
    },
  },
});

// 按钮按下
await client.startRecord();

// 按钮松开
await client.stopRecord();
```

### WebSocket 情感语音对话

```typescript
// 带情感表达的语音对话
await client.connect({
  chatUpdate: {
    data: {
      input_audio: {
        format: 'pcm',
        codec: 'pcm',
        sample_rate: 48000,
      },
      output_audio: {
        codec: 'pcm',
        voice_id: 'zh_female_emotional',
        emotion_config: {
          emotion: 'happy',      // 开心的情感
          emotion_scale: 4.5,    // 情感强度
        },
      },
      turn_detection: {
        type: 'server_vad',
      },
    },
  },
});
```

### WebSocket 语速调节

```typescript
// 加速 1.5 倍语音输出
await client.connect({
  chatUpdate: {
    data: {
      input_audio: {
        format: 'pcm',
        codec: 'pcm',
        sample_rate: 48000,
      },
      output_audio: {
        codec: 'pcm',
        voice_id: 'zh_female_warm',
        speech_rate: 50,     // +50 = 1.5 倍速
      },
      turn_detection: {
        type: 'server_vad',
      },
    },
  },
});
```

### WebSocket Opus 编码优化

```typescript
// 使用 Opus 编码降低带宽
await client.connect({
  chatUpdate: {
    data: {
      input_audio: {
        format: 'pcm',
        codec: 'opus',       // 使用 Opus 编码
        sample_rate: 48000,
      },
      output_audio: {
        codec: 'opus',
        opus_config: {
          sample_rate: 24000,
          bitrate: 32000,     // 降低码率
          frame_size_ms: 20,  // 增大帧长
          use_cbr: true,      // 使用 CBR 稳定码率
        },
        voice_id: 'zh_female_warm',
      },
      turn_detection: {
        type: 'server_vad',
      },
    },
  },
});
```

### WebSocket 持续对话（带会话 ID）

```typescript
// 保持多轮对话的上下文
await client.connect({
  chatUpdate: {
    data: {
      chat_config: {
        conversation_id: 'existing_conversation_id',  // 使用已有会话
        auto_save_history: true,
      },
      input_audio: {
        format: 'pcm',
        codec: 'pcm',
        sample_rate: 48000,
      },
      output_audio: {
        codec: 'pcm',
        voice_id: 'zh_female_warm',
      },
      turn_detection: {
        type: 'server_vad',
      },
    },
  },
});
```


### WebSocket 自动重连配置

```typescript
import { WsChatClient } from '@coze/api/ws-tools';

const client = new WsChatClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  botId: 'bot_id',

  // WebSocket 连接选项
  websocketOptions: {
    maxReconnectionDelay: 10000,      // 最大重连延迟 10 秒
    minReconnectionDelay: 1000,       // 最小重连延迟 1 秒
    reconnectionDelayGrowFactor: 1.3, // 每次重连延迟增长 30%
    minUptime: 5000,                  // 连接稳定 5 秒后才重置重连计数
    connectionTimeout: 4000,           // 连接超时 4 秒
    maxRetries: 10,                    // 最多重试 10 次（默认 Infinity）
    maxEnqueuedMessages: 1000,         // 最多缓存 1000 条消息
    startClosed: false,                // 开始时不自动连接
    debug: false,                      // WebSocket 调试模式
  },
});
```

### WebSocket 自定义 Token 函数

```typescript
const client = new WsChatClient({
  // 使用函数动态获取 Token（支持 Token 过期刷新）
  token: async () => {
    const response = await fetch('/api/get-coze-token');
    const data = await response.json();
    return data.token;
  },
  baseWsURL: 'wss://api.coze.cn/v1',
  botId: 'bot_id',
});
```

### WebSocket 自定义音频流

```typescript
// 使用自定义 MediaStreamTrack（例如从其他音频源获取）
const mediaStream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
  }
});
const audioTrack = mediaStream.getAudioTracks()[0];

const client = new WsChatClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  botId: 'bot_id',
  mediaStreamTrack: audioTrack,  // 使用自定义音频轨道
});
```

### WebSocket 自定义请求头

```typescript
const client = new WsChatClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  botId: 'bot_id',

  // 自定义 HTTP 头
  headers: {
    'X-Custom-Header': 'custom-value',
    'X-Request-ID': 'unique-request-id',
  },

  // WebSocket 连接时的自定义头
  websocketOptions: {
    headers: {
      'X-WS-Custom-Header': 'ws-custom-value',
    },
  },
});
```

### WebSocket 设置初始音量

```typescript
const client = new WsChatClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  botId: 'bot_id',
  playbackVolumeDefault: 0.5,  // 初始音量 50%
});
```

### 语音转录配置 (WsTranscriptionClient)

```typescript
import { WsTranscriptionClient } from '@coze/api/ws-tools';

const transcriptionClient = new WsTranscriptionClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  allowPersonalAccessTokenInBrowser: true,

  // 音频采集配置
  audioCaptureConfig: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },

  // AI 降噪配置
  aiDenoisingConfig: {
    mode: 'NSNG',
    level: 'SOFT',
    assetsPath: 'https://lf3-static.bytednsdoc.com/...',
  },

  // 实体类型和 ID
  entityType: 'bot',
  entityId: 'bot_id',

  // 初始转录配置
  transcriptionUpdateData: {
    input_audio: {
      format: 'pcm',
      codec: 'pcm',
      sample_rate: 48000,
    },
  },
});
```

### 同传翻译配置 (WsSimultInterpretationClient)

```typescript
import { WsSimultInterpretationClient } from '@coze/api/ws-tools';

const simultClient = new WsSimultInterpretationClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  allowPersonalAccessTokenInBrowser: true,
});

await simultClient.connect({
  data: {
    input_audio: {
      format: 'pcm',
      codec: 'pcm',
      sample_rate: 48000,
    },
    output_audio: {
      codec: 'pcm',
      voice_id: 'zh_female_warm',
    },
    translate_config: {
      from: 'zh',  // 中文
      to: 'en',    // 英文
      hot_words: ['Coze', 'AI', '智能体'],  // 热词
      glossary: [  // 术语表
        { original: '智能体', translation: 'Agent' },
        { original: '工作流', translation: 'Workflow' },
      ],
    },
  },
});
```

### 动态切换降噪模式

```typescript
// 初始化时使用浏览器原生降噪
const client = new WsChatClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  botId: 'bot_id',
  audioCaptureConfig: {
    noiseSuppression: true,  // 浏览器原生降噪
  },
});

// 运行时切换到 AI 降噪
client.setDenoiserEnabled(true);
client.setDenoiserMode('NSNG');
client.setDenoiserLevel('SOFT');
```

### 鸿蒙手机特殊配置

```typescript
// 检测是否为鸿蒙系统
const isHarmonOS = /HarmonyOS/.test(navigator.userAgent);

const client = new WsChatClient({
  token: 'your_pat',
  baseWsURL: 'wss://api.coze.cn/v1',
  botId: 'bot_id',

  // 鸿蒙手机需要启用本地回环来解决回音问题
  enableLocalLoopback: isHarmonOS,
});
```
