/**
 * Dataset Manager - 知识库管理页面
 * 主入口组件
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
 * 主页面组件
 */
const DatasetManager: React.FC = () => {
  const navigate = useNavigate();
  const { id, action } = useParams();
  const api = useDatasetApi();

  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formDatasetId, setFormDatasetId] = useState<string>();
  const [authChecked, setAuthChecked] = useState(false);
  const actionProcessedRef = useRef(false);

  // Define handlers BEFORE useEffect that uses them
  const openCreateForm = useCallback(() => {
    setFormMode('create');
    setFormDatasetId(undefined);
    setFormVisible(true);
  }, []);

  const openEditForm = useCallback((datasetId: string) => {
    setFormMode('edit');
    setFormDatasetId(datasetId);
    setFormVisible(true);
  }, []);

  // Handle action-based routing
  useEffect(() => {
    // Only process action if it's not already being processed
    if (action === 'create' && !formVisible && !actionProcessedRef.current) {
      actionProcessedRef.current = true;
      openCreateForm();
    } else if (action === 'edit' && id && !formVisible && !actionProcessedRef.current) {
      actionProcessedRef.current = true;
      openEditForm(id);
    }
    // Reset the flag when action changes
    if (!action) {
      actionProcessedRef.current = false;
    }
  }, [action, id, formVisible, openCreateForm, openEditForm]);

  useEffect(() => {
    const auth = getAuth();
    if (!auth || !auth.pat) {
      setAuthChecked(true);
      return;
    }
    setAuthChecked(true);
    api.fetchDatasets();
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormVisible(false);
    setFormDatasetId(undefined);
    // Navigate to clean URL
    if (id) {
      navigate(`/datasets/${id}`);
    } else {
      navigate('/datasets');
    }
  }, [navigate, id]);

  const handleFormSubmit = useCallback(async (data: DatasetFormData): Promise<string | null> => {
    if (formMode === 'create') {
      const datasetId = await api.createDataset(data);
      if (datasetId) {
        api.fetchDatasets();
        setFormVisible(false);
        actionProcessedRef.current = false;
        navigate(`/datasets/${datasetId}`);
      }
      return datasetId;
    } else {
      const success = await api.updateDataset(formDatasetId!, data);
      if (success) {
        api.fetchDatasets();
        setFormVisible(false);
        actionProcessedRef.current = false;
        navigate(`/datasets/${formDatasetId!}`);
      }
      return success ? formDatasetId! : null;
    }
  }, [formMode, formDatasetId, api, navigate]);

  const handleDelete = useCallback(async (dataset: typeof api.datasets[0]) => {
    const success = await api.deleteDataset(dataset.dataset_id);
    if (success) {
      api.fetchDatasets();
    }
  }, [api]);

  const handleManage = useCallback((datasetId: string) => {
    actionProcessedRef.current = false;
    navigate(`/datasets/${datasetId}`);
  }, [navigate]);

  const handleDetailBack = useCallback(() => {
    navigate('/datasets');
  }, [navigate]);

  const handleDetailEdit = useCallback(() => {
    if (id) {
      actionProcessedRef.current = false;
      navigate(`/datasets/${id}/edit`);
    }
  }, [id, navigate]);

  // Handlers for list page
  const handleListEdit = useCallback((datasetId?: string) => {
    actionProcessedRef.current = false;
    if (datasetId) {
      navigate(`/datasets/${datasetId}/edit`);
    } else {
      navigate('/datasets/create');
    }
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

  // 知识库详情页
  if (id && action !== 'create') {
    return (
      <>
        <DatasetDetail
          datasetId={id}
          onBack={handleDetailBack}
          onEdit={handleDetailEdit}
        />
        {formVisible && (
          <DatasetForm
            mode={formMode}
            datasetId={formDatasetId}
            initialValues={formMode === 'edit' ? api.datasets.find(d => d.dataset_id === id) : undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            uploadFile={api.uploadFile}
          />
        )}
      </>
    );
  }

  // 知识库列表页
  return (
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
  );
};

export default DatasetManager;
