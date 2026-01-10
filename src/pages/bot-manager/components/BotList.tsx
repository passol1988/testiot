/**
 * BotList 组件
 * 智能体列表
 */

import { Empty, Spin, Row, Col } from 'antd';
import type { BotListProps } from '../types';
import BotCard from './BotCard';

const BotList = ({
  bots,
  loading,
  onEdit,
  onCall,
  onPublish
}: BotListProps) => {
  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 0',
      }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#888' }}>加载中...</p>
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>还没有智能体</p>
            <p style={{ color: '#888' }}>点击上方"创建智能体"按钮开始吧！</p>
          </div>
        }
        style={{ marginTop: 60 }}
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {bots.map(bot => (
        <Col
          key={bot.bot_id}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={6}
        >
          <BotCard
            bot={bot}
            onEdit={onEdit}
            onCall={onCall}
            onPublish={onPublish}
          />
        </Col>
      ))}
    </Row>
  );
};

export default BotList;
