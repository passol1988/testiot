/**
 * LocalStorage 工具函数
 * Storage Utility Functions
 */

import type { AuthStorage, BotExtConfig } from '../types';
import { STORAGE_KEYS } from './constants';

/**
 * 获取登录信息
 */
export const getAuth = (): AuthStorage | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get auth from storage:', error);
    return null;
  }
};

/**
 * 保存登录信息
 */
export const setAuth = (auth: AuthStorage): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
  } catch (error) {
    console.error('Failed to set auth to storage:', error);
  }
};

/**
 * 清除登录信息
 */
export const clearAuth = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } catch (error) {
    console.error('Failed to clear auth from storage:', error);
  }
};

/**
 * 检查是否已登录
 */
export const isLoggedIn = (): boolean => {
  const auth = getAuth();
  return !!(auth && auth.user_id && auth.pat);
};

/**
 * 获取所有智能体扩展配置
 */
export const getAllBotExtConfig = (): Record<string, BotExtConfig> => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXT);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to get bot ext config from storage:', error);
    return {};
  }
};

/**
 * 获取指定智能体的扩展配置
 */
export const getBotExtConfig = (botId: string): BotExtConfig | null => {
  const allConfig = getAllBotExtConfig();
  return allConfig[botId] || null;
};

/**
 * 保存智能体扩展配置
 */
export const setBotExtConfig = (botId: string, config: BotExtConfig): void => {
  try {
    const allConfig = getAllBotExtConfig();
    allConfig[botId] = config;
    localStorage.setItem(STORAGE_KEYS.EXT, JSON.stringify(allConfig));
  } catch (error) {
    console.error('Failed to set bot ext config to storage:', error);
  }
};

/**
 * 删除智能体扩展配置
 */
export const removeBotExtConfig = (botId: string): void => {
  try {
    const allConfig = getAllBotExtConfig();
    delete allConfig[botId];
    localStorage.setItem(STORAGE_KEYS.EXT, JSON.stringify(allConfig));
  } catch (error) {
    console.error('Failed to remove bot ext config from storage:', error);
  }
};
