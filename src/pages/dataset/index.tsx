/**
 * Dataset Manager - 知识库管理页面
 * 主入口组件
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Result, Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import DatasetList from './components/DatasetList';
import DatasetForm from './components/DatasetForm';
import DatasetDetail from './components/DatasetDetail';
import { useDatasetApi } from './hooks/use-dataset-api';
import { getAuth } from '../bot-manager/utils/storage';
import type { DatasetFormData } from './types';
import styles from './styles';

/**
 * 详情页包装器 - 提取 useParams
 */
const DetailPageWrapper: React.FC<{
  api: ReturnType<typeof useDatasetApi>;
  onBack: () => void;
  onEdit: () => void;
  formVisible: boolean;
  formMode: 'create' | 'edit';
  formDatasetId?: string;
  onFormSubmit: (data: DatasetFormData) => Promise<string | null>;
  onFormCancel: () => void;
}> = ({ api, onBack, onEdit, formVisible, formMode, formDatasetId, onFormSubmit, onFormCancel }) => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <>
      <DatasetDetail
        datasetId={id}
        onBack={onBack}
        onEdit={onEdit}
      />
      {formVisible && (
        <DatasetForm
          mode={formMode}
          datasetId={formDatasetId}
          initialValues={formMode === 'edit' ? api.datasets.find(d => d.dataset_id === formDatasetId) : undefined}
          onSubmit={onFormSubmit}
          onCancel={onFormCancel}
          uploadFile={api.uploadFile}
        />
      )}
    </>
  );
};

/**
 * 主页面组件
 */
const DatasetManager = () => {
  const navigate = useNavigate();
  const api = useDatasetApi();

  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formDatasetId, setFormDatasetId] = useState<string>();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth || !auth.pat) {
      setAuthChecked(true);
      return;
    }
    setAuthChecked(true);
    api.fetchDatasets();
  }, []);

  // 关闭表单
  const handleCloseForm = useCallback(() => {
    setFormVisible(false);
    setFormDatasetId(undefined);
    navigate('/datasets');
  }, [navigate]);

  // 提交表单
  const handleFormSubmit = useCallback(async (data: DatasetFormData): Promise<string | null> => {
    if (formMode === 'create') {
      const datasetId = await api.createDataset(data);
      if (datasetId) {
        api.fetchDatasets();
        setFormVisible(false);
        navigate(`/datasets/${datasetId}`);
      }
      return datasetId;
    } else {
      const success = await api.updateDataset(formDatasetId!, data);
      if (success) {
        api.fetchDatasets();
        setFormVisible(false);
        navigate(`/datasets/${formDatasetId!}`);
      }
      return success ? formDatasetId! : null;
    }
  }, [formMode, formDatasetId, api, navigate]);

  // 删除知识库
  const handleDelete = useCallback(async (dataset: typeof api.datasets[0]) => {
    const success = await api.deleteDataset(dataset.dataset_id);
    if (success) {
      api.fetchDatasets();
    }
  }, [api]);

  // 管理知识库（跳转到详情页）
  const handleManage = useCallback((datasetId: string) => {
    navigate(`/datasets/${datasetId}`);
  }, [navigate]);

  // 列表页 - 新建/编辑
  const handleListEdit = useCallback((datasetId?: string) => {
    setFormVisible(true);
    if (datasetId) {
      setFormMode('edit');
      setFormDatasetId(datasetId);
    } else {
      setFormMode('create');
      setFormDatasetId(undefined);
    }
  }, []);

  // 详情页 - 编辑
  const handleDetailEdit = useCallback(() => {
    setFormVisible(true);
    setFormMode('edit');
  }, []);

  // 详情页 - 返回
  const handleDetailBack = useCallback(() => {
    navigate('/datasets');
  }, [navigate]);

  // 未登录状态
  if (!authChecked) {
    return null;
  }

  const auth = getAuth();
  if (!auth || !auth.pat) {
    return (
      <div style={styles.containerStyles}>
        <Result
          icon={<LoginOutlined style={{ color: '#8c8c8c' }} />}
          title="请先登录"
          subTitle="您需要先登录才能使用知识库管理功能"
          extra={
            <Button type="primary" onClick={() => navigate('/bot-manager')}>
              前往登录
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      {/* 路由配置 */}
      <Routes>
        {/* 列表页 */}
        <Route
          path="/"
          element={
            <>
              <DatasetList
                datasets={api.datasets}
                loading={api.loading}
                onEdit={handleListEdit}
                onDelete={handleDelete}
                onManage={handleManage}
              />
              {formVisible && (
                <DatasetForm
                  mode={formMode}
                  datasetId={formDatasetId}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCloseForm}
                  uploadFile={api.uploadFile}
                />
              )}
            </>
          }
        />

        {/* 详情页 */}
        <Route
          path=":id"
          element={
            <DetailPageWrapper
              api={api}
              onBack={handleDetailBack}
              onEdit={handleDetailEdit}
              formVisible={formVisible}
              formMode={formMode}
              formDatasetId={formDatasetId}
              onFormSubmit={handleFormSubmit}
              onFormCancel={handleCloseForm}
            />
          }
        />
      </Routes>
    </>
  );
};

export default DatasetManager;
