import { useEffect, useState } from 'react';
import { Modal, Form, Button, Input, message, TreeSelect, type TreeSelectProps, Select, type OptionProps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import getConfig from '../../../utils/config';
import useApi from './use-api';

const SettingsComponent = ({
  onSettingsChange,
  localStorageKey,
  fields,
  buttonText,
  modalTitle,
  className,
}: {
  onSettingsChange?: () => void;
  localStorageKey: string;
  fields: string[];
  buttonText?: string;
  modalTitle?: string;
  className?: string;
}) => {
  const config = getConfig(localStorageKey);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [form] = Form.useForm();
  const { getBotInfo, getBots, getWorkspaces, getVoices } = useApi(localStorageKey);

  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([]);
  const [voiceData, setVoiceData] = useState<OptionProps[]>([]);
  const [isVoicesLoading, setIsVoicesLoading] = useState(false);
  const [isWorkspacesLoading, setIsWorkspacesLoading] = useState(false);

  const onLoadData: TreeSelectProps['loadData'] = async ({ id }) => {
    const options = await getBots(id);
    const treeData2: Omit<DefaultOptionType, 'label'>[] = [];
    options.forEach(item => {
      treeData2.push({
        id: item.id,
        pId: id,
        value: item.id,
        title: item.name,
        isLeaf: true,
      });
    });
    setTreeData(treeData.concat(treeData2));
  };

  const loadInitialSettings = () => {
    const values: Record<string, string> = {};
    fields.forEach(field => {
      values[field] = localStorage.getItem(`${localStorageKey}_${field}`) || '';
    });
    form.setFieldsValue(values);

    const botId = config.getBotId();
    if (botId) {
      getBotInfo(botId).then(bot => {
        form.setFieldValue('bot_id', bot.name);
      });
    }
  };

  const fetchAllWorkspaces = async () => {
    if (!config.getPat()) return;
    setIsWorkspacesLoading(true);
    try {
      const workspaces = await getWorkspaces();
      const treeData2: Omit<OptionProps, 'label'>[] = workspaces.map(workspace => ({
        id: workspace.id,
        pId: 0,
        value: workspace.id,
        title: workspace.name,
        isLeaf: false,
        selectable: false,
      }));
      setTreeData(treeData2);
    } catch (error) {
      message.error('获取工作空间列表失败');
    } finally {
      setIsWorkspacesLoading(false);
    }
  };

  const fetchAllVoices = async () => {
    if (!config.getPat()) return;
    setIsVoicesLoading(true);
    try {
      const voices = await getVoices();
      const defaultOption = { value: '', label: '默认音色' };
      setVoiceData([defaultOption, ...voices]);
    } catch (error) {
      message.error('获取音色列表失败');
    } finally {
      setIsVoicesLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsSettingsVisible(true);
    loadInitialSettings();
    fetchAllWorkspaces();
    fetchAllVoices();
  };

  const handleSettingsSave = (values: any) => {
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'bot_id' || /^\d+$/.test(String(value))) {
        localStorage.setItem(`${localStorageKey}_${key}`, value as string);
      }
    });
    setIsSettingsVisible(false);
    onSettingsChange?.();
    message.success('配置已保存');
  };

  const renderField = (field: string) => {
    switch (field) {
      case 'bot_id':
        return (
          <Form.Item key={field} name={field} label="智能体ID" rules={[{ required: true, message: '请选择智能体' }]}>
            <TreeSelect
              treeDataSimpleMode
              placeholder="请选择"
              loadData={onLoadData}
              treeData={treeData}
              loading={isWorkspacesLoading}
              showSearch
              filterTreeNode={(inputValue, treeNode) =>
                (treeNode.title as string).toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
              }
              treeNodeFilterProp="title"
            />
          </Form.Item>
        );
      case 'voice_id':
        return (
          <Form.Item key={field} name={field} label="音色">
            <Select
              placeholder="请选择"
              showSearch
              loading={isVoicesLoading}
              filterOption={(inputValue, option) =>
                (option?.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
              }
              options={voiceData}
            />
          </Form.Item>
        );
      default:
        return (
          <Form.Item key={field} name={field} label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} rules={[{ required: ['pat', 'bot_id', 'base_ws_url'].includes(field), message: `请输入 ${field}!` }]}>
            <Input />
          </Form.Item>
        );
    }
  };

  return (
    <>
      <Button
        icon={<SettingOutlined />}
        type="default"
        onClick={handleOpenModal}
        className={className}
      >
        {buttonText || '配置'}
      </Button>
      <Modal
        title={modalTitle || '配置'}
        open={isSettingsVisible}
        onCancel={() => setIsSettingsVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSettingsSave} layout="vertical">
          {fields.map(renderField)}
        </Form>
      </Modal>
    </>
  );
};

export default SettingsComponent;
