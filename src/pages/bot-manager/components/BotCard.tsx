/**
 * BotCard 组件
 * 智能体卡片
 */

import { Card, Tag, Button, Space, Avatar } from 'antd';
import {
  EditOutlined,
  PhoneOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { BotCardProps } from '../types';

const BotCard = ({ bot, onEdit, onCall, onPublish }: BotCardProps) => {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s',
      }}
      styles={{
        body: { padding: 16 },
      }}
      bodyStyle={{ padding: 16 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        <Avatar
          src={bot.icon_url}
          size={64}
          shape="square"
          style={{ borderRadius: 12 }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
          }}>
            <h3 style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 180,
            }}>
              {bot.name}
            </h3>
            <Tag color={bot.is_published ? 'success' : 'default'}>
              {bot.is_published ? '已发布' : '草稿'}
            </Tag>
          </div>

          <p style={{
            margin: 0,
            fontSize: 13,
            color: '#888',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: 12,
          }}>
            {bot.description || '暂无描述'}
          </p>

          <Space size={8} wrap>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(bot.bot_id)}
              style={{ borderRadius: 8 }}
            >
              编辑
            </Button>
            <Button
              size="small"
              icon={<PhoneOutlined />}
              onClick={() => onCall(bot.bot_id)}
              style={{ borderRadius: 8 }}
            >
              通话
            </Button>
            {!bot.is_published && (
              <Button
                size="small"
                icon={<SendOutlined />}
                onClick={() => onPublish(bot.bot_id)}
                style={{ borderRadius: 8 }}
              >
                发布
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default BotCard;
