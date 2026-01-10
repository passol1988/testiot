/**
 * Bot Manager - 管理页面
 * 智能体列表与管理
 */

import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LoginModal, PageHeader, BotList, KnowledgeFab } from './components';
import { useBotApi } from './hooks';
import { isLoggedIn, clearAuth } from './utils/storage';
import type { BotFormData } from './types';
import BotForm from './components/BotForm';
import CallPage from './call';
import './styles.css';

/**
 * Bot Manager 主组件
 */
const BotManager = () => {
  const navigate = useNavigate();

  // 状态管理
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [botFormMode, setBotFormMode] = useState<'create' | 'edit'>('create');
  const [editBotId, setEditBotId] = useState<string | undefined>();

  // API Hooks
  const {
    loading,
    botList,
    fetchBotList,
    createBot,
    updateBot,
    publishBot,
    uploadFile,
    fetchVoices,
    fetchPlugins,
  } = useBotApi();

  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn()) {
      setLoginModalVisible(true);
    } else {
      fetchBotList();
    }
  }, [fetchBotList]);

  // 处理登录
  const handleLogin = useCallback(() => {
    setLoginModalVisible(false);
    fetchBotList();
  }, [fetchBotList]);

  // 处理登出
  const handleLogout = useCallback(() => {
    clearAuth();
    setLoginModalVisible(true);
  }, []);

  // 打开创建表单
  const handleOpenCreateForm = useCallback(() => {
    setBotFormMode('create');
    setEditBotId(undefined);
    navigate('/bot-manager/form');
  }, [navigate]);

  // 打开编辑表单
  const handleEdit = useCallback((botId: string) => {
    setBotFormMode('edit');
    setEditBotId(botId);
    navigate(`/bot-manager/form/${botId}`);
  }, [navigate]);

  // 关闭表单
  const handleCloseForm = useCallback(() => {
    setEditBotId(undefined);
    navigate('/bot-manager');
  }, [navigate]);

  // 跳转到通话页面
  const handleCall = useCallback((botId: string) => {
    navigate(`/bot-manager/call/${botId}`);
  }, [navigate]);

  // 发布智能体
  const handlePublish = useCallback(async (botId: string) => {
    const success = await publishBot(botId);
    if (success) {
      fetchBotList();
    }
  }, [publishBot, fetchBotList]);

  // 刷新列表
  const handleRefresh = useCallback(() => {
    fetchBotList();
  }, [fetchBotList]);

  // 提交表单
  const handleSubmitForm = useCallback(async (data: BotFormData): Promise<void> => {
    if (botFormMode === 'create') {
      const botId = await createBot(data);
      if (botId) {
        fetchBotList();
        handleCloseForm();
      }
    } else {
      const success = await updateBot({ bot_id: editBotId, ...data });
      if (success) {
        fetchBotList();
        handleCloseForm();
      }
    }
  }, [botFormMode, editBotId, createBot, updateBot, fetchBotList, handleCloseForm]);

  // 管理页面
  const ManagementPage = () => (
    <div className="bot-manager-container">
      <PageHeader
        onCreate={handleOpenCreateForm}
        onRefresh={handleRefresh}
        loading={loading}
      />

      <BotList
        bots={botList}
        loading={loading}
        onEdit={handleEdit}
        onCall={handleCall}
        onPublish={handlePublish}
      />

      <KnowledgeFab />
    </div>
  );

  return (
    <>
      {/* 登录弹窗 */}
      <LoginModal
        visible={loginModalVisible}
        onSubmit={handleLogin}
        onCancel={handleLogout}
      />

      {/* 路由配置 */}
      <Routes>
        {/* 管理页面 */}
        <Route path="/" element={<ManagementPage />} />

        {/* 表单页面 */}
        <Route
          path="/form"
          element={
            <BotForm
              mode="create"
              onSubmit={handleSubmitForm}
              onCancel={handleCloseForm}
              uploadFile={uploadFile}
              fetchVoices={fetchVoices}
              fetchPlugins={fetchPlugins}
            />
          }
        />
        <Route
          path="/form/:id"
          element={
            <BotForm
              mode="edit"
              botId={editBotId}
              onSubmit={handleSubmitForm}
              onCancel={handleCloseForm}
              uploadFile={uploadFile}
              fetchVoices={fetchVoices}
              fetchPlugins={fetchPlugins}
              fetchBotDetail={async () => {
                // 这里需要从 useBotApi 获取
                return null;
              }}
            />
          }
        />

        {/* 通话页面 */}
        <Route path="/call/:botId" element={<CallPage />} />
      </Routes>
    </>
  );
};

export default BotManager;
