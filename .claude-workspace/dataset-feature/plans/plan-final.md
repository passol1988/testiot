# 知识库管理功能 - 技术方案

> **已确认版本 - 基于 v1 定稿**
>
> 本文档为知识库管理功能的最终技术方案。

---

## 1. 关键决策总结

| 问题 | 决策 | 说明 |
|------|------|------|
| chunk_strategy | 使用接口默认值 | 用户无需配置 |
| caption_type | 创建知识库时用户选择 | 影响后续图片上传行为 |
| 在线网页 | 支持，update_rule 使用默认值 | 用户无需配置 |
| 进度轮询 | 1秒间隔，完成后自动刷新 | 最多轮询 5 分钟 |
| 批量操作 | 支持批量删除 | 最多 100 个文件 |

---

## 2. UI/UX 设计规范

### 2.1 设计原则

知识库管理页面需要与 **bot-manager** 保持完全一致的视觉风格和交互体验，确保用户在两个功能之间无缝切换。

### 2.2 样式系统（复用 bot-manager）

所有知识库相关组件**必须复用** `bot-manager/styles.ts` 和 `bot-manager/styles.css` 中定义的样式系统：

```typescript
// 从 bot-manager/styles.ts 导入现有样式
import {
  containerStyles,
  cardStyles,
  buttonStyles,
  inputStyles,
  tableStyles
} from '../bot-manager/styles';

// 知识库页面复用相同的容器样式
export const datasetPageStyles = {
  ...containerStyles,  // 相同的渐变背景
};
```

### 2.3 核心设计 Token

| 类别 | Token | 值 | 应用场景 |
|------|-------|-----|----------|
| **主色调** | `--primary-gradient` | `linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)` | 主按钮、激活状态 |
| **背景** | `--page-bg-gradient` | `linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 100%)` | 页面背景 |
| **卡片圆角** | `--card-radius` | `16px` | 所有卡片容器 |
| **按钮圆角** | `--btn-radius` | `20px` | 所有按钮 |
| **卡片阴影** | `--card-shadow` | `0 2px 8px rgba(0, 0, 0, 0.08)` | 卡片悬停/静态 |
| **卡片阴影-hover** | `--card-shadow-hover` | `0 8px 24px rgba(255, 107, 107, 0.15)` | 卡片悬停状态 |
| **边框色** | `--border-color` | `#f0f0f0` | 分割线、边框 |
| **文本-主** | `--text-primary` | `#262626` | 标题、正文 |
| **文本-次** | `--text-secondary` | `#8c8c8c` | 辅助说明 |

### 2.4 动画效果

复用 bot-manager 的动画定义：

```css
/* Pulse 动画 - 用于新建按钮 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Wave 动画 - 用于卡片入场 */
@keyframes wave {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* FadeIn 动画 - 用于内容渐入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 2.5 组件样式映射

| 知识库组件 | 复用样式 | 说明 |
|-----------|---------|------|
| `DatasetCard` | `cardStyles.botCard` | 卡片容器、圆角、阴影、悬停效果 |
| `DatasetList` | `containerStyles.botManagerContainer` | 页面容器、渐变背景 |
| 主按钮 | `buttonStyles.botBtnPrimary` | 渐变背景、圆角、悬停效果 |
| 次按钮 | `buttonStyles.botBtnSecondary` | 白色背景、边框、圆角 |
| 危险按钮 | `buttonStyles.botBtnDanger` | 红色背景、圆角 |
| 输入框 | `inputStyles.botInput` | 边框、圆角、聚焦效果 |
| 搜索框 | `inputStyles.botSearchInput` | 搜索图标、圆角 |

### 2.6 DatasetCard 样式示例

```tsx
// DatasetCard.tsx
import { cardStyles, buttonStyles } from '../bot-manager/styles';

const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, onEdit, onDelete }) => {
  return (
    <div
      className="dataset-card"
      style={{
        ...cardStyles.botCard,
        animation: 'wave 0.6s ease-out',
      }}
    >
      {/* 卡片内容 */}
      <div className="card-header">
        <Avatar size={48} src={dataset.icon_url} />
        <Space direction="vertical" size={4}>
          <Title level={5} style={{ margin: 0 }}>{dataset.name}</Title>
          <Text type="secondary">{dataset.description}</Text>
        </Space>
      </div>

      {/* 统计数据 */}
      <div className="card-stats">
        <Statistic title="文档数" value={dataset.doc_count} />
        <Statistic title="分段数" value={dataset.slice_count} />
      </div>

      {/* 操作按钮 - 复用 bot-btn-primary 样式 */}
      <Space>
        <button
          style={buttonStyles.botBtnPrimary}
          onClick={() => onEdit(dataset.dataset_id)}
        >
          编辑
        </button>
        <button
          style={buttonStyles.botBtnDanger}
          onClick={() => onDelete(dataset)}
        >
          删除
        </button>
      </Space>
    </div>
  );
};
```

### 2.7 页面布局参考

知识库列表页布局与 bot-manager 一致：

```
┌─────────────────────────────────────────────────────────────┐
│  头部导航栏 (固定高度，与 bot-manager 相同)                   │
│  Logo | Bot Manager | Knowledge Base | User               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  操作栏: [+ 新建知识库]  [🔍 搜索_______________]            │
│  筛选:   [全部类型 ▼]  [排序 ▼]                             │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  卡片 1   │  │  卡片 2   │  │  卡片 3   │  │  卡片 4   │    │
│  │  (16px   │  │          │  │          │  │          │    │
│  │   圆角)  │  │          │  │          │  │          │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  ...更多卡片（响应式网格布局，间距 24px）                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.8 响应式设计

```css
/* 与 bot-manager 一致的响应式断点 */
.dataset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 24px;
}

@media (max-width: 768px) {
  .dataset-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
}
```

---

## 3. 优化后的页面路由

```
/bot-manager
├── /                          # 智能体列表
├── /form                      # 创建智能体
├── /form/:id                  # 编辑智能体
├── /datasets                  # 知识库列表
├── /datasets/create           # 创建/编辑知识库（复用路由，state 区分）
├── /datasets/:id              # 知识库详情（默认显示文件管理）
└── /call/:botId               # 通话页面
```

**说明**：`/datasets/create` 通过 `location.state` 区分创建/编辑模式

---

## 4. 知识库表单（DatasetForm）

### 4.1 表单字段

```tsx
interface DatasetFormProps {
  mode: 'create' | 'edit';
  datasetId?: string;
  onSuccess?: (datasetId: string) => void;  // 创建成功回调
}

// 表单字段
- name (Input, 必填, max 100)
- description (TextArea, 可选)
- icon (AvatarUpload, 可选)
- format_type (Radio.Group, 必选)
  - ○ 文本类型 (0)
  - ○ 图片类型 (2)

- caption_type (Radio.Group, 仅 format_type=2 时显示, 必选)
  - ○ 系统自动标注 (0) - 上传后系统自动生成描述
  - ○ 手工标注 (1) - 上传后需要手动设置描述
```

### 4.2 caption_type 的作用

这个设置决定了**后续上传图片**时的默认行为：

| caption_type | 上传图片后 |
|-------------|-----------|
| 0 (自动) | 系统自动生成描述，无需手动操作 |
| 1 (手工) | 上传后需要调用 `updateImageCaption` 设置描述 |

**注意**：根据 API 文档，空知识库首次上传图片时必须设置此参数，所以创建时需要让用户选择。

---

## 5. 文件管理页面详解

### 5.1 页面结构

```
┌─────────────────────────────────────────────────────────────┐
│  ← 返回列表    知识库名称                  [编辑] [删除]    │
├─────────────────────────────────────────────────────────────┤
│  [📁 文件管理] [ℹ️ 基本信息] [🤖 绑定智能体(3)]             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  操作栏: [+ 上传文件]  [批量删除]  [🔄 刷新]               │
│  搜索:   [___________]  [🔍 搜索]                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 表格/网格内容区                                         │  │
│  │                                                        │  │
│  │  文本知识库: 表格列表                                  │  │
│  │  图片知识库: 图片网格                                  │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│              < 1 2 3 4 5 ... 10 >                          │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 文件列表（文本知识库）

```tsx
interface FileListProps {
  datasetId: string;
  formatType: 0 | 2;
}

// 表格列
const columns = [
  {
    title: '',
    dataIndex: 'document_id',
    width: 50,
    render: (_, record) => (
      <Checkbox onChange={(e) => handleSelect(e, record.document_id)} />
    ),
  },
  { title: '文件名', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', width: 80 },
  { title: '大小', dataIndex: 'size', width: 100, render: formatBytes },
  { title: '分段数', dataIndex: 'slice_count', width: 100 },
  { title: '状态', dataIndex: 'status', width: 120, render: renderStatus },
  { title: '上传时间', dataIndex: 'create_time', width: 160, render: formatTime },
  {
    title: '操作',
    key: 'action',
    width: 80,
    render: (_, record) => (
      <Button
        size="small"
        danger
        onClick={() => handleDelete([record.document_id])}
      >
        删除
      </Button>
    ),
  },
];

// 状态渲染
const renderStatus = (status: number, record: DocumentInfo) => {
  if (status === 0) {
    return (
      <Tooltip title={`预计剩余时间: ${record.remaining_time}秒`}>
        <Tag color="processing">处理中...</Tag>
      </Tooltip>
    );
  }
  if (status === 1) {
    return <Tag color="success">完成</Tag>;
  }
  if (status === 9) {
    return (
      <Tooltip title={record.status_descript || '处理失败，请重新上传'}>
        <Tag color="error">失败</Tag>
      </Tooltip>
    );
  }
  return <Tag>未知</Tag>;
};
```

### 5.3 图片网格（图片知识库）

```tsx
interface ImageGridProps {
  datasetId: string;
  captionType: 0 | 1;  // 知识库的标注方式
}

// 操作栏
<div className="image-toolbar">
  <Button type="primary" icon={<UploadOutlined />} onClick={showUploadModal}>
    上传图片
  </Button>
  <Input.Search
    placeholder="搜索图片描述..."
    onSearch={handleSearch}
    style={{ width: 200 }}
  />
  <Select
    placeholder="筛选状态"
    allowClear
    onChange={handleStatusFilter}
    style={{ width: 120 }}
  >
    <Option value="">全部</Option>
    <Option value="0">处理中</Option>
    <Option value="1">完成</Option>
    <Option value="9">失败</Option>
  </Select>
  <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
</div>

// 图片卡片网格
<div className="image-grid">
  {images.map(img => (
    <div key={img.document_id} className="image-card">
      <img src={img.url} alt={img.name} />

      {/* 状态遮罩 */}
      {img.status === 0 && (
        <div className="image-status-overlay">
          <Spin indicator={<LoadingOutlined spin />} />
          <span>处理中...</span>
        </div>
      )}

      {/* Hover 显示操作 */}
      <div className="image-actions">
        <div className="image-caption">{img.caption || '无描述'}</div>
        <Space>
          {captionType === 1 && (
            <Button
              size="small"
              onClick={() => showUpdateCaptionModal(img)}
            >
              编辑描述
            </Button>
          )}
          <Button
            size="small"
            danger
            onClick={() => handleDelete([img.document_id])}
          >
            删除
          </Button>
        </Space>
      </div>
    </div>
  ))}
</div>
```

---

## 6. 文件上传弹窗（FileUploadModal）

### 6.1 弹窗结构

```tsx
<Modal
  title={formatType === 0 ? "上传文件" : "上传图片"}
  open={visible}
  onCancel={onClose}
  footer={null}
  width={700}
  destroyOnClose
>
  <Tabs
    defaultActiveKey="local"
    items={[
      {
        key: 'local',
        label: '本地文件',
        children: <LocalFileUpload />,
      },
      {
        key: 'web',
        label: '在线网页',
        children: <WebPageUpload />,
        disabled: formatType === 2,  // 图片不支持网页上传
      },
    ]}
  />
</Modal>
```

### 6.2 本地文件上传（文本知识库）

```tsx
<Form layout="vertical">
  <Form.Item label="选择文件" required>
    <Upload
      multiple
      accept=".pdf,.txt,.doc,.docx"
      beforeUpload={() => false}
      onChange={handleFileSelect}
      fileList={selectedFiles}
      onRemove={handleFileRemove}
    >
      <Button icon={<UploadOutlined />}>选择文件</Button>
      <div className="upload-tip">
        支持 PDF、TXT、DOC、DOCX 格式，单个文件最大 512MB
      </div>
    </Upload>
  </Form.Item>

  <Form.Item>
    <Space>
      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
        disabled={selectedFiles.length === 0}
      >
        上传 ({selectedFiles.length})
      </Button>
      <Button onClick={onClose}>取消</Button>
    </Space>
  </Form.Item>
</Form>
```

### 6.3 本地图片上传（图片知识库）

```tsx
<Form layout="vertical">
  <Form.Item label="选择图片" required>
    <Upload
      multiple
      accept="image/*"
      listType="picture-card"
      beforeUpload={() => false}
      onChange={handleFileSelect}
      fileList={selectedFiles}
      onRemove={handleFileRemove}
    >
      {selectedFiles.length < 10 && (
        <div>
          <PlusOutlined />
          <div>上传图片</div>
        </div>
      )}
    </Upload>
    <div className="upload-tip">
      支持 JPG、PNG、GIF 等格式，单个文件最大 512MB，最多 10 个
    </div>
  </Form.Item>

  <Form.Item label="描述" required>
    <Radio.Group
      value={captionInputMode}
      onChange={(e) => setCaptionInputMode(e.target.value)}
    >
      <Radio value={0}>使用系统自动生成的描述</Radio>
      <Radio value={1}>手工输入描述</Radio>
    </Radio.Group>
  </Form.Item>

  {captionInputMode === 1 && (
    <Form.Item label="图片描述" required>
      <Input.TextArea
        placeholder="请输入图片描述..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={3}
      />
    </Form.Item>
  )}

  <Form.Item>
    <Space>
      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
        disabled={selectedFiles.length === 0}
      >
        上传
      </Button>
      <Button onClick={onClose}>取消</Button>
    </Space>
  </Form.Item>
</Form>
```

### 6.4 在线网页上传（仅文本知识库）

```tsx
<Form layout="vertical">
  <Form.Item
    label="网页 URL"
    required
    rules={[
      { required: true, message: '请输入网页 URL' },
      { type: 'url', message: '请输入有效的 URL' }
    ]}
  >
    <Input
      placeholder="https://example.com/page"
      value={webUrl}
      onChange={(e) => setWebUrl(e.target.value)}
    />
  </Form.Item>

  <Form.Item label="文件名" required>
    <Input
      placeholder="为这个网页起个名字"
      value={documentName}
      onChange={(e) => setDocumentName(e.target.value)}
    />
  </Form.Item>

  <Form.Item>
    <Space>
      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
      >
        添加
      </Button>
      <Button onClick={onClose}>取消</Button>
    </Space>
  </Form.Item>
</Form>
```

---

## 7. 上传与进度轮询

### 7.1 上传流程

```typescript
const handleUpload = async () => {
  setUploading(true);

  try {
    // 文本知识库 - Base64 上传
    if (formatType === 0) {
      const documentIds: string[] = [];

      for (const file of selectedFiles) {
        // 1. 转换为 Base64
        const base64 = await fileToBase64(file);

        // 2. 调用创建文件接口（使用默认分片策略）
        const result = await createDocument({
          dataset_id: datasetId,
          document_bases: [{
            name: file.name,
            source_info: {
              file_base64: base64,
              file_type: getFileExtension(file.name),
            },
          }],
          chunk_strategy: DEFAULT_CHUNK_STRATEGY,  // 使用默认值
          format_type: 0,
        });

        if (result) {
          documentIds.push(...result);
        }
      }

      // 3. 开始轮询进度
      if (documentIds.length > 0) {
        await pollProgress(documentIds);
      }
    }

    // 图片知识库 - file_id 上传
    if (formatType === 2) {
      const documentIds: string[] = [];

      for (const file of selectedFiles) {
        // 1. 先上传文件获取 file_id
        const fileId = await uploadFile(file);

        if (fileId) {
          // 2. 调用创建文件接口
          const result = await createDocument({
            dataset_id: datasetId,
            document_bases: [{
              name: file.name,
              source_info: {
                source_file_id: fileId,
                document_source: 5,
              },
              caption: captionInputMode === 1 ? caption : undefined,
            }],
            chunk_strategy: {
              chunk_type: 0,
              caption_type: knowledgeCaptionType,  // 使用知识库的设置
            },
            format_type: 2,
          });

          if (result) {
            documentIds.push(...result);
          }
        }
      }

      // 3. 开始轮询进度
      if (documentIds.length > 0) {
        await pollProgress(documentIds);
      }
    }
  } finally {
    setUploading(false);
  }
};
```

### 7.2 进度轮询

```typescript
const pollProgress = async (documentIds: string[]) => {
  const MAX_ATTEMPTS = 300;  // 最多 5 分钟
  let attempts = 0;

  // 显示进度弹窗
  setProgressModalVisible(true);

  const poll = async () => {
    attempts++;

    // 查询进度
    const progressList = await fetchDocumentProgress(datasetId, documentIds);

    // 更新进度显示
    setProgressData(progressList);

    // 检查是否全部完成/失败
    const allDone = progressList.every(
      p => p.status === 1 || p.status === 9
    );

    if (allDone || attempts >= MAX_ATTEMPTS) {
      // 停止轮询
      clearInterval(timer);

      // 延迟关闭弹窗，让用户看到最终状态
      setTimeout(() => {
        setProgressModalVisible(false);
        // 自动刷新文件列表
        await fetchDocuments(datasetId);
        // 刷新父组件
        onSuccess?.();
      }, 1500);
    }
  };

  // 立即执行一次
  await poll();

  // 每 1 秒执行一次
  const timer = setInterval(poll, 1000);
};
```

### 7.3 进度弹窗

```tsx
<Modal
  title="文件处理进度"
  open={progressModalVisible}
  footer={null}
  closable={false}
  maskClosable={false}
>
  <List
    dataSource={progressData}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          avatar={
            item.status === 1 ? (
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
            ) : item.status === 9 ? (
              <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
            ) : (
              <LoadingOutlined style={{ fontSize: 20 }} />
            )
          }
          title={item.document_name}
          description={
            <div>
              <Progress
                percent={item.progress}
                status={item.status === 9 ? 'exception' : 'active'}
                size="small"
              />
              {item.status === 0 && (
                <Text type="secondary">
                  {' '}预计剩余 {item.remaining_time} 秒
                </Text>
              )}
              {item.status === 9 && (
                <Text type="danger">
                  {' '}{item.status_descript || '处理失败，请重新上传'}
                </Text>
              )}
            </div>
          }
        />
      </List.Item>
    )}
  />
</Modal>
```

---

## 8. 批量删除

```typescript
// 表格行选择配置
const rowSelection = {
  selectedRowKeys: selectedIds,
  onChange: (selectedRowKeys: React.Key[]) => {
    setSelectedIds(selectedRowKeys as string[]);
  },
};

// 批量删除按钮
<Button
  type="primary"
  danger
  disabled={selectedIds.length === 0}
  onClick={handleBatchDelete}
>
  批量删除 {selectedIds.length > 0 && `(${selectedIds.length})`}
</Button>

// 删除确认
const handleBatchDelete = () => {
  Modal.confirm({
    title: '确认删除',
    icon={<ExclamationCircleOutlined />,
    content: (
      <div>
        <p>确定删除选中的 <strong>{selectedIds.length}</strong> 个文件吗？</p>
        <p type="secondary">此操作无法撤销，请谨慎操作。</p>
      </div>
    ),
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteDocuments(selectedIds);
      setSelectedIds([]);
      await fetchDocuments(datasetId);
    },
  });
};
```

---

## 9. 智能体集成（DatasetSelector）

### 9.1 组件实现

```tsx
const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  value,
  onChange,
  disabled,
  datasets = [],
}) => {
  return (
    <div>
      <Select
        mode="multiple"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="选择知识库"
        style={{ width: '100%' }}
        options={datasets.map(d => ({
          label: `${d.name} (${d.format_type === 0 ? '文本' : '图片'})`,
          value: d.dataset_id,
        }))}
        filterOption={(input, option) =>
          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
        }
        showSearch
        allowClear
        maxTagCount={3}
        maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}...`}
      />
      {disabled && (
        <div style={{ marginTop: 4 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            提示：创建智能体后，可在编辑页面绑定知识库
          </Text>
        </div>
      )}
    </div>
  );
};
```

### 9.2 BotForm 集成

```tsx
<Form.Item label="知识库">
  <DatasetSelector
    value={knowledgeDatasetIds}
    onChange={(ids) => setFieldValue('knowledgeDatasetIds', ids)}
    disabled={mode === 'create'}
    datasets={allDatasets}
  />
</Form.Item>
```

---

## 10. 默认值总结

```typescript
// 默认分片策略（创建文件时使用）
const DEFAULT_CHUNK_STRATEGY: ChunkStrategy = {
  chunk_type: 0,  // 自动分段与清洗
};

// 默认更新策略（在线网页上传时使用）
const DEFAULT_UPDATE_RULE: UpdateRule = {
  update_type: 0,  // 不自动更新
  update_interval: 0,
};

// 默认标注方式（创建知识库时用户选择，但系统默认推荐）
const DEFAULT_CAPTION_TYPE = 0;  // 系统自动标注
```

---

## 11. 数据流向总览

### 11.0.1 核心数据流

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        知识库管理核心数据流                              │
└─────────────────────────────────────────────────────────────────────────┘

【创建知识库流程】
用户输入 → DatasetForm → createDataset() → Coze API
                              ↓
                         返回 dataset_id
                              ↓
                    跳转到文件管理页面
                              ↓
                        FileList/ImageGrid 初始化


【文件上传流程（文本）】
用户选择文件 → fileToBase64() → createDocument() → Coze API
                                           ↓
                                      返回 document_id[]
                                           ↓
                                    启动进度轮询
                                           ↓
                              pollProgress(document_ids)
                                           ↓
                         每1秒调用 documentProgress()
                                           ↓
                          status=1/9 → 停止轮询 → 刷新列表


【文件上传流程（图片）】
用户选择图片 → uploadFile() → 获取 file_id
                          ↓
                 createDocument(file_id) → Coze API
                          ↓
                     返回 document_id[]
                          ↓
              pollProgress() → documentProgress()
                          ↓
              status=1 → 显示图片 / status=9 → 显示失败


【知识库绑定流程】
BotForm (编辑模式) → DatasetSelector 选择 → updateBot()
                                                       ↓
                                             knowledge: { dataset_ids: [] }
                                                       ↓
                                                    Coze API


【数据存储层次】
Redux/Context (全局状态)
    ↓
组件 State (页面级状态)
    ↓
useDatasetApi (API 调用层)
    ↓
Coze API SDK
    ↓
Coze 服务端
```

### 11.0.2 状态管理数据流

```typescript
// 全局状态结构
interface AppState {
  datasets: {
    items: Dataset[];        // 知识库列表缓存
    currentId: string | null; // 当前操作的知识库 ID
    loading: boolean;
    error: string | null;
  };
  documents: {
    [datasetId: string]: {
      items: DocumentInfo[];
      selectedIds: string[];
      loading: boolean;
    };
  };
  upload: {
    documentIds: string[];    // 上传中的文件 ID 列表
    progress: ProgressItem[]; // 上传进度数据
    polling: boolean;         // 是否正在轮询
  };
}

// 数据流向
用户操作 → dispatch(action)
         → reducer 更新状态
         → 组件重新渲染
         → useEffect 监听状态变化
         → 触发 API 调用或副作用
```

### 11.0.3 API 调用数据流

```typescript
// 文件上传完整数据流
handleUpload()
  │
  ├─► setUploading(true)                 // UI: 禁用按钮，显示 loading
  │
  ├─► for (file of files)                // 遍历文件
  │   │
  │   ├─► fileToBase64(file)             // 转换为 Base64
  │   │       ↓
  │   │   const base64 = "JVBERi0x..."
  │   │
  │   └─► createDocument({               // 调用 API
  │         dataset_id,
  │         document_bases: [{
  │           name: file.name,
  │           source_info: {
  │             file_base64: base64,
  │             file_type: "pdf"
  │           }
  │         }],
  │         chunk_strategy: DEFAULT,
  │         format_type: 0
  │       })
  │           ↓
  │       const document_ids = ["doc_1", "doc_2"]
  │           ↓
  │   └─► documentIds.push(...document_ids)
  │
  ├─► pollProgress(documentIds)          // 开始轮询
  │   │
  │   ├─► setProgressModalVisible(true)  // UI: 显示进度弹窗
  │   │
  │   └─► setInterval(() => {
  │         │
  │         ├─► documentProgress({ document_ids })  // API: 查询进度
  │         │       ↓
  │         │   const progressList = [
  │         │     { document_id: "doc_1", status: 0, progress: 45 },
  │         │     { document_id: "doc_2", status: 1, progress: 100 }
  │         │   ]
  │         │       ↓
  │         ├─► setProgressData(progressList)          // UI: 更新进度显示
  │         │
  │         ├─► allDone = progressList.every(         // 判断是否完成
  │         │     p => p.status === 1 || p.status === 9
  │         │   )
  │         │
  │         └─► if (allDone) {
  │               clearInterval(timer)
  │               setTimeout(() => {
  │                 setProgressModalVisible(false)
  │                 fetchDocuments(datasetId)           // 刷新文件列表
  │                 onSuccess?.()                       // 通知父组件
  │               }, 1500)
  │             }
  │       }, 1000)
  │
  └─► setUploading(false)                // UI: 恢复按钮状态
```

---

## 12. 关键逻辑说明

### 12.1 caption_type 的设置时机

1. **创建知识库时**：用户选择 `caption_type`（自动/手工）
2. **创建图片文件时**：将知识库的 `caption_type` 传入 `chunk_strategy`
3. **上传图片后**：
   - `caption_type = 0`：系统自动生成描述，无需操作
   - `caption_type = 1`：需要调用 `updateImageCaption` 手动设置

### 12.2 文件处理失败的处理

- status = 9：显示失败状态 + 错误信息
- 用户需手动删除失败的文件记录
- 重新上传文件

### 12.3 空知识库首次上传

根据 API 文档，空知识库首次上传图片时 `caption_type` 是必选的：
- 如果用户在创建知识库时选择了，后续上传时系统会使用这个值
- 这个设置会影响**该知识库的所有图片上传行为**

---

## 13. 组件列表

| 组件 | 路径 | 说明 |
|------|------|------|
| DatasetList | `components/DatasetList.tsx` | 知识库列表页 |
| DatasetCard | `components/DatasetCard.tsx` | 知识库卡片 |
| DatasetForm | `components/DatasetForm.tsx` | 创建/编辑表单 |
| DatasetDetail | `components/DatasetDetail.tsx` | 知识库详情页 |
| FileList | `components/FileList.tsx` | 文件列表（文本） |
| ImageGrid | `components/ImageGrid.tsx` | 图片网格（图片） |
| FileUploadModal | `components/FileUploadModal.tsx` | 文件上传弹窗 |
| UploadProgressModal | `components/UploadProgressModal.tsx` | 上传进度弹窗 |
| DatasetSelector | `components/DatasetSelector.tsx` | 知识库多选器 |
| ConfirmDeleteModal | `components/ConfirmDeleteModal.tsx` | 删除确认弹窗 |
| useDatasetApi | `hooks/use-dataset-api.ts` | API Hook |

---

*版本：final - 已确认，进入实现阶段*
