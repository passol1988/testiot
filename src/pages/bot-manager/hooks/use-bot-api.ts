/**
 * useBotApi Hook
 * 智能体 API 调用封装
 */

import { useState, useCallback } from 'react';
import { CozeAPI } from '@coze/api';
import { message } from 'antd';
import type { BotInfo, BotDetail, PluginInfo, VoiceInfo } from '../types';
import { SPACE_ID } from '../utils/constants';
import { getAuth } from '../utils/storage';

/**
 * Bot API Hook 返回值
 */
interface UseBotApiReturn {
  // 加载状态
  loading: boolean;

  // 智能体列表
  botList: BotInfo[];

  // 获取智能体列表
  fetchBotList: () => Promise<void>;

  // 获取智能体详情
  fetchBotDetail: (botId: string) => Promise<BotDetail | null>;

  // 创建智能体
  createBot: (data: any) => Promise<string | null>;

  // 更新智能体
  updateBot: (data: any) => Promise<boolean>;

  // 发布智能体
  publishBot: (botId: string) => Promise<boolean>;

  // 上传文件
  uploadFile: (file: File) => Promise<string | null>;

  // 获取音色列表
  fetchVoices: () => Promise<VoiceInfo[]>;

  // 获取插件列表
  fetchPlugins: () => Promise<PluginInfo[]>;
}

/**
 * useBotApi Hook
 */
export const useBotApi = (): UseBotApiReturn => {
  const [loading, setLoading] = useState(false);
  const [botList, setBotList] = useState<BotInfo[]>([]);

  /**
   * 获取 Coze API 客户端
   */
  const getCozeApi = useCallback((): CozeAPI | null => {
    const auth = getAuth();
    if (!auth || !auth.pat) {
      return null;
    }
    return new CozeAPI({
      baseURL: 'https://api.coze.cn',
      token: auth.pat,
      allowPersonalAccessTokenInBrowser: true,
    });
  }, []);

  /**
   * 获取智能体列表
   */
  const fetchBotList = useCallback(async (): Promise<void> => {
    const api = getCozeApi();
    if (!api) {
      return;
    }

    setLoading(true);
    try {
      const result = await api.bots.listNew({
        workspace_id: SPACE_ID,
        publish_status: 'all',
        page_size: 50,
      });
      setBotList(
        result.items.map(bot => ({
          bot_id: bot.id,
          name: bot.name,
          description: bot.description || '',
          icon_url: bot.icon_url,
          is_published: bot.is_published,
          publish_time: bot.published_at,
          create_time: 0,
          update_time: bot.updated_at,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch bot list:', error);
      message.error('获取智能体列表失败');
    } finally {
      setLoading(false);
    }
  }, [getCozeApi]);

  /**
   * 获取智能体详情
   */
  const fetchBotDetail = useCallback(async (botId: string): Promise<BotDetail | null> => {
    const api = getCozeApi();
    if (!api) {
      return null;
    }

    setLoading(true);
    try {
      const bot = await api.bots.retrieveNew(botId, { is_published: false });
      return {
        bot_id: bot.bot_id,
        name: bot.name,
        description: bot.description || '',
        icon_url: bot.icon_url,
        is_published: false,
        create_time: bot.create_time,
        update_time: bot.update_time,
        prompt_info: {
          prompt: bot.prompt_info.prompt,
          prompt_mode: 'string',
        },
        onboarding_info: {
          prologue: bot.onboarding_info.prologue,
          suggested_questions: bot.onboarding_info.suggested_questions || [],
        },
        plugin_info_list: bot.plugin_info_list?.map(p => ({
          id: p.plugin_id,
          name: p.name,
          description: p.description || '',
          icon: p.icon_url,
          apiList: [],
        })),
        knowledge: bot.knowledge ? {
          knowledge_infos: bot.knowledge.knowledge_infos || [],
        } : undefined,
      };
    } catch (error) {
      console.error('Failed to fetch bot detail:', error);
      message.error('获取智能体详情失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getCozeApi]);

  /**
   * 创建智能体
   */
  const createBot = useCallback(async (data: any): Promise<string | null> => {
    const api = getCozeApi();
    if (!api) {
      return null;
    }

    setLoading(true);
    try {
      const result = await api.bots.create({
        space_id: SPACE_ID,
        name: data.name,
        description: data.description,
        icon_file_id: data.icon_file_id,
        prompt_info: data.prompt_info,
        onboarding_info: data.onboarding_info,
        plugin_id_list: data.plugin_id_list,
        // Note: knowledge field not supported in create, need to update after create
      });
      message.success('智能体创建成功');
      return result.bot_id;
    } catch (error) {
      console.error('Failed to create bot:', error);
      message.error(`创建智能体失败：${(error as Error).message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getCozeApi]);

  /**
   * 更新智能体
   */
  const updateBot = useCallback(async (data: any): Promise<boolean> => {
    const api = getCozeApi();
    if (!api) {
      return false;
    }

    setLoading(true);
    try {
      // 过滤掉 undefined 的字段
      const updateParams: any = {
        bot_id: data.bot_id,
      };

      if (data.name !== undefined) updateParams.name = data.name;
      if (data.description !== undefined) updateParams.description = data.description;
      if (data.icon_file_id !== undefined) updateParams.icon_file_id = data.icon_file_id;
      if (data.prompt_info !== undefined) updateParams.prompt_info = data.prompt_info;
      if (data.onboarding_info !== undefined) updateParams.onboarding_info = data.onboarding_info;
      if (data.plugin_id_list !== undefined) updateParams.plugin_id_list = data.plugin_id_list;
      if (data.knowledge !== undefined) updateParams.knowledge = data.knowledge;

      console.log('更新智能体参数:', JSON.stringify(updateParams, null, 2));

      await api.bots.update(updateParams);
      message.success('智能体更新成功');
      return true;
    } catch (error: any) {
      console.error('Failed to update bot:', error);
      console.error('错误详情:', JSON.stringify(error, null, 2));
      message.error(`更新智能体失败：${error.message || error.msg || '未知错误'}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getCozeApi]);

  /**
   * 发布智能体
   */
  const publishBot = useCallback(async (botId: string): Promise<boolean> => {
    const api = getCozeApi();
    if (!api) {
      return false;
    }

    setLoading(true);
    try {
      await api.bots.publish({
        bot_id: botId,
        connector_ids: ['1024'], // 1024 渠道
      });
      message.success('智能体发布成功');
      return true;
    } catch (error) {
      console.error('Failed to publish bot:', error);
      message.error(`发布智能体失败：${(error as Error).message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getCozeApi]);

  /**
   * 上传文件
   */
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const api = getCozeApi();
    if (!api) {
      return null;
    }

    try {
      const result = await api.files.upload({ file });
      return result.id;
    } catch (error) {
      console.error('Failed to upload file:', error);
      message.error('文件上传失败');
      return null;
    }
  }, [getCozeApi]);

  /**
   * 获取音色列表
   */
  const fetchVoices = useCallback(async (): Promise<VoiceInfo[]> => {
    const api = getCozeApi();
    if (!api) {
      return [];
    }

    try {
      const result = await api.audio.voices.list();
      return result.voice_list.map(v => ({
        voice_id: v.voice_id,
        voice_name: v.name,
        language: v.language_code,
        gender: 'unknown',
        support_emotions: v.support_emotions?.map(e => e.emotion || e.display_name || ''),
      }));
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      message.error('获取音色列表失败');
      return [];
    }
  }, [getCozeApi]);

  /**
   * 获取插件列表
   */
  const fetchPlugins = useCallback(async (): Promise<PluginInfo[]> => {
    // 返回预设插件列表（包含 api_id）
    return [
      {
        id: '7548028105068183561',
        name: '今日诗词',
        description: '无需参数配置，无需认证授权，每次访问即返回一句精选诗句，附带作者简介、完整原文与详细解释。让古典诗词的智慧与美感，轻松融入您的日常。',
        icon: 'https://lf6-appstore-sign.oceancloudapi.com/ocean-cloud-tos/plugin_icon/4223672455014680_1757412179311746878_cfqpVn9V7Q.jpg',
        apiList: [
          {
            apiId: '7548028105068199945',
            name: 'daily_poetry',
            description: '即开即用：无需API密钥或身份验证，直接调用即可返回结果',
          }
        ],
      },
      {
        id: '7477951904853639209',
        name: '百度天气插件',
        description: '获取实时天气查询',
        icon: 'https://lf3-appstore-sign.oceancloudapi.com/ocean-cloud-tos/plugin_icon/1018601783965514_1741096339319344099_VRyg92Wosy.png',
        apiList: [
          {
            apiId: '7477951904853655593',
            name: 'weather',
            description: '输入你所在城市或经纬度等参数，以获取最新的天气状况。',
          }
        ],
      },
      {
        id: '7375329794130591770',
        name: '亲子关系问题清单',
        description: '亲子关系是家庭中非常重要的一部分，它影响着孩子的成长和发展。这个插件是关于亲子关系问题的清单。当用户有亲子关系问题，不知道该问哪些问题时，这个插件可以将相关问题展示出来，便于用户提问。',
        icon: 'https://lf6-appstore-sign.oceancloudapi.com/ocean-cloud-tos/plugin_icon/default_icon.png',
        apiList: [
          {
            apiId: '7375329794130608154',
            name: 'parent_children_QA',
            description: '亲子关系问题清单',
          }
        ],
      },
    ];
  }, []);

  return {
    loading,
    botList,
    fetchBotList,
    fetchBotDetail,
    createBot,
    updateBot,
    publishBot,
    uploadFile,
    fetchVoices,
    fetchPlugins,
  };
};
