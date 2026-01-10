/**
 * PageHeader 组件
 * 管理页面头部
 */

import { Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

interface PageHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

const PageHeader = ({ onCreate, onRefresh, loading }: PageHeaderProps) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingBottom: 16,
      borderBottom: '1px solid #f0f0f0',
    }}>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          🤖 生活物联网智能体
        </h1>
        <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
          为儿童智能玩具配置专属 AI 伙伴
        </p>
      </div>

      <Space>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
        >
          刷新
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreate}
          style={{
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
            border: 'none',
            borderRadius: 20,
            height: 36,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          创建智能体
        </Button>
      </Space>
    </div>
  );
};

export default PageHeader;
