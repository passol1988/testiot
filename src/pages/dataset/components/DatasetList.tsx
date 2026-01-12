/**
 * DatasetList 组件
 * 知识库列表
 */

import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Select, Button, Empty, Spin, Modal, Space } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { DatasetListProps } from '../types';
import { DATASET_TYPE_OPTIONS } from '../utils/constants';
import DatasetCard from './DatasetCard';
import styles from '../styles';

const { Search } = Input;

const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  loading,
  onEdit,
  onDelete,
  onManage,
}) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<number | undefined>();
  const [filteredDatasets, setFilteredDatasets] = useState(datasets);

  useEffect(() => {
    let filtered = datasets;

    // 搜索过滤
    if (searchText) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 类型过滤
    if (filterType !== undefined) {
      filtered = filtered.filter(d => d.format_type === filterType);
    }

    setFilteredDatasets(filtered);
  }, [datasets, searchText, filterType]);

  const handleDelete = (dataset: typeof datasets[0]) => {
    Modal.confirm({
      title: '确认删除',
      content: (
        <div>
          <p>确定删除知识库 <strong>{dataset.name}</strong> 吗？</p>
          <p style={{ color: '#ff4d4f' }}>
            此操作将删除知识库及其所有文件，且无法撤销。
          </p>
        </div>
      ),
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => onDelete(dataset),
    });
  };

  return (
    <div className="dataset-list" style={styles.containerStyles}>
      {/* 操作栏 */}
      <div style={{ padding: '24px 24px 16px' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={6} md={5}>
            <Button
              icon={<RollbackOutlined />}
              onClick={() => navigate('/bot-manager')}
            >
              返回智能体管理
            </Button>
          </Col>
          <Col xs={24} sm={18} md={8}>
            <Search
              placeholder="搜索知识库名称或描述"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="筛选类型"
              allowClear
              style={{ width: '100%' }}
              value={filterType}
              onChange={setFilterType}
              options={DATASET_TYPE_OPTIONS}
            />
          </Col>
          <Col xs={24} sm={12} md={6} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  // 触发刷新通过父组件
                  window.location.reload();
                }}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => onEdit('')}
                style={styles.buttonStyles.botBtnPrimary}
              >
                新建知识库
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 知识库卡片网格 */}
      <div style={{ padding: '0 24px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 100 }}>
            <Spin size="large" />
          </div>
        ) : filteredDatasets.length === 0 ? (
          <Empty
            description={searchText || filterType !== undefined ? '未找到匹配的知识库' : '暂无知识库'}
            style={{ padding: 100 }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => onEdit('')}
              style={styles.buttonStyles.botBtnPrimary}
            >
              创建第一个知识库
            </Button>
          </Empty>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredDatasets.map(dataset => (
              <Col key={dataset.dataset_id} xs={24} sm={12} lg={8} xl={6}>
                <DatasetCard
                  dataset={dataset}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  onManage={onManage}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* 统计信息 */}
      {!loading && datasets.length > 0 && (
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            color: '#8c8c8c',
            fontSize: 12,
          }}
        >
          共 {filteredDatasets.length} 个知识库
          {searchText || filterType !== undefined ? ` (已筛选)` : ''}
        </div>
      )}
    </div>
  );
};

export default DatasetList;
