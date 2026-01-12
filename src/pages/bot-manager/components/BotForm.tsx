/**
 * BotForm 组件
 * 智能体创建/编辑表单
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Card,
  Button,
  Space,
  message,
  Spin,
  Tag,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import type { BotFormProps, BotFormData, PluginInfo } from '../types';
import {
  REPLY_STYLE_OPTIONS,
  VALUES_OPTIONS,
  HABITS_OPTIONS,
  DEFAULT_PROLOGUE,
  DEFAULT_SUGGESTED_QUESTIONS,
  PROMPT_LIMITS,
  DEFAULT_SELECTED_PLUGINS,
} from '../utils/constants';
import {
  generatePrompt,
  isPromptTooLong,
} from '../utils/prompt-template';
import {
  setBotExtConfig,
  getBotExtConfig,
} from '../utils/storage';

import AvatarUpload from './AvatarUpload';
import PluginSelector from './PluginSelector';
import VoiceSelector from './VoiceSelector';
import PromptPreview from './PromptPreview';
import DatasetSelector from '../../dataset/components/DatasetSelector';

const BotForm = ({
  mode,
  botId,
  onSubmit,
  onCancel,
  uploadFile,
  fetchPlugins,
  fetchBotDetail,
  datasets = []
}: BotFormProps) => {
  const params = useParams();
  const actualBotId = botId || params.botId;

  const [form] = Form.useForm<BotFormData>();
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // 头像相关状态
  const [currentIconUrl, setCurrentIconUrl] = useState<string | undefined>();
  const [hasNewAvatar, setHasNewAvatar] = useState(false);

  // 表单状态
  const [customPrompt, setCustomPrompt] = useState('你是一个会讲故事、会聊天、会回答问题的好朋友。');
  const [replyStyle, setReplyStyle] = useState<BotFormData['replyStyle']>('适中详细');
  const [selectedValues, setSelectedValues] = useState<string[]>(['善良', '真诚']);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(['好好吃饭', '爱阅读', '讲文明']);
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>(DEFAULT_SELECTED_PLUGINS);
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<string[]>([]);
  const [voiceId, setVoiceId] = useState<string | undefined>(undefined);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);

  // 建议问题状态（独立的 tag 列表）
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(DEFAULT_SUGGESTED_QUESTIONS);
  const [questionInput, setQuestionInput] = useState('');
  const [questionInputVisible, setQuestionInputVisible] = useState(false);

  // 插件和音色选项
  const [pluginOptions, setPluginOptions] = useState<PluginInfo[]>([]);

  // 生成当前 Prompt
  const currentPrompt = generatePrompt({
    customPrompt,
    replyStyle,
    values: selectedValues,
    habits: selectedHabits,
    skills: selectedPlugins.length > 0
      ? ['聊天对话', ...pluginOptions.filter((p: PluginInfo) => selectedPlugins.includes(p.id)).map((p: PluginInfo) => p.name)]
      : ['聊天对话'],
  });

  // 加载插件选项
  useEffect(() => {
    const loadPlugins = async () => {
      if (fetchPlugins) {
        const plugins = await fetchPlugins();
        setPluginOptions(plugins);
      }
    };
    loadPlugins();
  }, [fetchPlugins]);

  // 加载编辑数据
  useEffect(() => {
    if (mode === 'edit' && actualBotId) {
      const loadData = async () => {
        setLoading(true);
        try {
          // 获取扩展配置
          const extConfig = getBotExtConfig(actualBotId);
          if (extConfig) {
            setCustomPrompt(extConfig.customPrompt);
            setReplyStyle(extConfig.replyStyle);
            setSelectedValues(extConfig.values);
            setSelectedHabits(extConfig.habits);
            setVoiceId(extConfig.voiceId);
            setVoiceSpeed(extConfig.voiceSpeed);
          }

          // 从 API 获取智能体详情并填充表单
          if (fetchBotDetail) {
            const botDetail = await fetchBotDetail(actualBotId);
            if (botDetail) {
              // 保存原始 icon_url，用于显示
              setCurrentIconUrl(botDetail.icon_url);
              setHasNewAvatar(false);

              // 加载建议问题列表
              setSuggestedQuestions(botDetail.onboarding_info?.suggested_questions || DEFAULT_SUGGESTED_QUESTIONS);

              // 加载知识库 IDs
              if (botDetail.knowledge?.knowledge_infos) {
                setSelectedDatasetIds(botDetail.knowledge.knowledge_infos.map(k => k.id));
              }

              form.setFieldsValue({
                name: botDetail.name,
                description: botDetail.description,
                // icon_file_id 不设置，保持为空
                prompt_info: botDetail.prompt_info,
                onboarding_info: botDetail.onboarding_info,
              });
              setSelectedPlugins(botDetail.plugin_info_list?.map(p => p.id) || []);
            }
          }
        } catch (error) {
          console.error('Failed to load bot data:', error);
          message.error('加载智能体数据失败');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [mode, actualBotId, fetchBotDetail, form]);

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 验证 Prompt 长度
      if (isPromptTooLong(currentPrompt)) {
        message.error('Prompt 过长，请精简内容');
        return;
      }

      // 验证自定义 Prompt
      if (customPrompt.length < PROMPT_LIMITS.MIN_CUSTOM) {
        message.error(`自定义 Prompt 至少需要 ${PROMPT_LIMITS.MIN_CUSTOM} 个字符`);
        return;
      }

      const formData: BotFormData = {
        ...values,
        // 只有上传了新头像时才传 icon_file_id
        icon_file_id: hasNewAvatar ? values.icon_file_id : undefined,
        prompt_info: {
          prompt: currentPrompt,
        },
        onboarding_info: {
          prologue: values.onboarding_info?.prologue || DEFAULT_PROLOGUE,
          suggested_questions: suggestedQuestions.length > 0 ? suggestedQuestions : DEFAULT_SUGGESTED_QUESTIONS,
        },
        plugin_id_list: selectedPlugins.length > 0 ? {
          id_list: selectedPlugins.map(id => {
            // 从 pluginOptions 中查找对应的插件，获取 api_id
            const plugin = pluginOptions.find((p: PluginInfo) => p.id === id);
            return {
              plugin_id: id,
              api_id: plugin?.apiList?.[0]?.apiId,  // 使用第一个 API 的 ID
            };
          }),
        } : undefined,
        knowledge: selectedDatasetIds.length > 0 ? {
          dataset_ids: selectedDatasetIds,
        } : undefined,
        replyStyle,
        values: selectedValues,
        habits: selectedHabits,
        customPrompt,
        voiceId,
        voiceSpeed,
        dataset_ids: selectedDatasetIds,
      };

      await onSubmit(formData);

      // 保存扩展配置
      if (actualBotId) {
        setBotExtConfig(actualBotId, {
          replyStyle,
          values: selectedValues,
          habits: selectedHabits,
          customPrompt,
          voiceId,
          voiceSpeed,
        });
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bot-manager-container">
      <div className="bot-manager-content">
        {/* 头部 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '1px solid #f0f0f0',
        }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onCancel}
            style={{ marginRight: 16 }}
          >
            返回
          </Button>
          <h1 style={{ margin: 0, fontSize: 20 }}>
            {mode === 'create' ? '创建智能体' : '编辑智能体'}
          </h1>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: '',
            description: '',
            onboarding_info: {
              prologue: DEFAULT_PROLOGUE,
              suggested_questions: DEFAULT_SUGGESTED_QUESTIONS,
            },
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" className="form-section-card" style={{ marginBottom: 24 }}>
            <Form.Item
              label="头像"
              name="icon_file_id"
            >
              <AvatarUpload
                uploadFile={uploadFile}
                initialUrl={currentIconUrl}
                onChange={() => setHasNewAvatar(true)}
              />
            </Form.Item>

            <Form.Item
              label="名称"
              name="name"
              rules={[
                { required: true, message: '请输入智能体名称' },
                { max: 20, message: '名称最多 20 个字符' },
              ]}
            >
              <Input placeholder="请输入智能体名称（最多 20 字符）" maxLength={20} />
            </Form.Item>

            <Form.Item
              label="描述"
              name="description"
              rules={[{ max: 500, message: '描述最多 500 个字符' }]}
            >
              <Input.TextArea
                placeholder="请输入智能体描述（可选）"
                rows={3}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Card>

          {/* Prompt 配置 */}
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Prompt 配置</span>
                <PromptPreview
                  prompt={currentPrompt}
                  visible={previewVisible}
                  onToggle={() => setPreviewVisible(!previewVisible)}
                />
              </div>
            }
            className="form-section-card"
            style={{ marginBottom: 24 }}
          >
            {/* 自定义 Prompt */}
            <Form.Item label="自定义 Prompt">
              <Input.TextArea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="请输入自定义 Prompt（至少 10 字符）"
                rows={4}
                minLength={PROMPT_LIMITS.MIN_CUSTOM}
              />
            </Form.Item>

            {/* 回复风格 */}
            <Form.Item label="回复风格">
              <Space wrap>
                {REPLY_STYLE_OPTIONS.map(option => (
                  <div
                    key={option.value}
                    className={`selector-card ${replyStyle === option.value ? 'selected' : ''}`}
                    onClick={() => setReplyStyle(option.value)}
                    style={{ padding: '8px 16px' }}
                  >
                    {option.label}
                  </div>
                ))}
              </Space>
            </Form.Item>

            {/* 价值观 */}
            <Form.Item label="价值观（多选）">
              <Space wrap>
                {VALUES_OPTIONS.map(option => (
                  <div
                    key={option.value}
                    className={`selector-card ${selectedValues.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedValues(prev =>
                        prev.includes(option.value)
                          ? prev.filter(v => v !== option.value)
                          : [...prev, option.value]
                      );
                    }}
                    style={{ padding: '8px 16px' }}
                  >
                    {option.label}
                  </div>
                ))}
              </Space>
            </Form.Item>

            {/* 习惯 */}
            <Form.Item label="习惯培养（多选）">
              <Space wrap>
                {HABITS_OPTIONS.map(option => (
                  <div
                    key={option.value}
                    className={`selector-card ${selectedHabits.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedHabits(prev =>
                        prev.includes(option.value)
                          ? prev.filter(h => h !== option.value)
                          : [...prev, option.value]
                      );
                    }}
                    style={{ padding: '8px 16px' }}
                  >
                    {option.label}
                  </div>
                ))}
              </Space>
            </Form.Item>
          </Card>

          {/* 开场白 */}
          <Card title="开场白配置" className="form-section-card" style={{ marginBottom: 24 }}>
            <Form.Item
              label="开场白"
              name={['onboarding_info', 'prologue']}
            >
              <Input.TextArea
                placeholder="请输入开场白"
                rows={3}
              />
            </Form.Item>

            <Form.Item label="建议问题">
              <div>
                <div style={{ marginBottom: 8 }}>
                  {suggestedQuestions.map((question, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => {
                        const newQuestions = suggestedQuestions.filter((_, i) => i !== index);
                        setSuggestedQuestions(newQuestions);
                      }}
                      style={{ marginBottom: 8, fontSize: 14, padding: '4px 10px' }}
                    >
                      {question}
                    </Tag>
                  ))}
                </div>
                {!questionInputVisible ? (
                  <Button
                    type="dashed"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => setQuestionInputVisible(true)}
                  >
                    添加问题
                  </Button>
                ) : (
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      placeholder="输入问题"
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      onPressEnter={() => {
                        if (questionInput.trim()) {
                          setSuggestedQuestions([...suggestedQuestions, questionInput.trim()]);
                          setQuestionInput('');
                          setQuestionInputVisible(false);
                        }
                      }}
                    />
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        if (questionInput.trim()) {
                          setSuggestedQuestions([...suggestedQuestions, questionInput.trim()]);
                          setQuestionInput('');
                          setQuestionInputVisible(false);
                        }
                      }}
                    >
                      确定
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setQuestionInput('');
                        setQuestionInputVisible(false);
                      }}
                    >
                      取消
                    </Button>
                  </Space.Compact>
                )}
              </div>
            </Form.Item>
          </Card>

          {/* 插件选择 */}
          <Card title="插件选择" className="form-section-card" style={{ marginBottom: 24 }}>
            <PluginSelector
              value={selectedPlugins}
              onChange={setSelectedPlugins}
              options={pluginOptions}
            />
          </Card>

          {/* 知识库选择 */}
          <Card title="知识库选择" className="form-section-card" style={{ marginBottom: 24 }}>
            <DatasetSelector
              value={selectedDatasetIds}
              onChange={setSelectedDatasetIds}
              datasets={datasets}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              选择关联的知识库，智能体在对话时可以检索和使用这些知识库中的内容
            </div>
          </Card>

          {/* 音色配置 */}
          <Card title="语音配置" className="form-section-card" style={{ marginBottom: 24 }}>
            <VoiceSelector
              voiceId={voiceId}
              speed={voiceSpeed}
              onVoiceChange={setVoiceId}
              onSpeedChange={setVoiceSpeed}
              supportEmotion={false}
            />
          </Card>

          {/* 操作按钮 */}
          <Card>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={onCancel} className="bot-btn-secondary">
                取消
              </Button>
              <Button type="primary" onClick={handleSubmit} className="bot-btn-primary">
                {mode === 'create' ? '创建' : '保存'}
              </Button>
            </Space>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default BotForm;
