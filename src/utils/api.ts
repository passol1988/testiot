import { CozeAPI } from '@coze/api';
import getConfig from './config';

const getCozeApi = async (localStorageKey: string) => {
  const config = getConfig(localStorageKey);
  const cozeApi = new CozeAPI({
    baseURL: config.getBaseUrl(),
    allowPersonalAccessTokenInBrowser: true,
    token: config.getPat(),
  });
  return cozeApi;
};

export const getChatMessages = async (
  conversationId: string,
  chatId: string,
  localStorageKey: string
) => {
  try {
    const api = await getCozeApi(localStorageKey);
    const messages = await api.chat.messages.list(conversationId, chatId);
    return messages;
  } catch (error) {
    console.error('获取聊天消息失败:', error);
    throw error;
  }
};
