import React from 'react';
import { Layout, Button, Popover, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import './IoTHeader.css';

const { Header } = Layout;

interface IoTHeaderProps {
  title: string;
  advancedSettingsContent: React.ReactNode;
  ttsButton?: React.ReactNode;
  ttsSettingsContent?: React.ReactNode;
  ttsVisible?: boolean;
  onTtsVisibleChange?: (visible: boolean) => void;
  extraContent?: React.ReactNode;
}

const IoTHeader: React.FC<IoTHeaderProps> = ({
  title,
  advancedSettingsContent,
  ttsButton,
  ttsSettingsContent,
  ttsVisible,
  onTtsVisibleChange,
  extraContent
}) => {
  return (
    <Header
      style={{
        padding: '0 16px',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
      }}
      className="iot-header"
    >
      <h3
        style={{
          fontSize: '16px',
          marginBottom: '0',
          lineHeight: '62px', // 64px header height - 1px border top/bottom
        }}
      >
        {title}
      </h3>
      <div className="header-right">
        <Space>
          {extraContent}
          {ttsButton && ttsSettingsContent && (
            <Popover
              placement="bottomRight"
              title="TTS音色设置"
              content={ttsSettingsContent}
              trigger="click"
              open={ttsVisible}
              onOpenChange={onTtsVisibleChange}
            >
              {ttsButton}
            </Popover>
          )}
          <Popover
            placement="bottomRight"
            title="高级配置"
            content={advancedSettingsContent}
            trigger="click"
          >
            <Button icon={<SettingOutlined />}>高级配置</Button>
          </Popover>
        </Space>
      </div>
    </Header>
  );
};

export default IoTHeader;
