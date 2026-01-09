import { CozeAPI, type Voice } from '@coze/api';
import getConfig from '../../../utils/config';

const getCozeApi = async (localStorageKey: string) => {
  const config = getConfig(localStorageKey);
  const cozeApi = new CozeAPI({
    baseURL: config.getBaseUrl(),
    allowPersonalAccessTokenInBrowser: true,
    token: config.getPat(),
  });
  return cozeApi;
};

const useApi = (localStorageKey: string) => {
  const getBotInfo = async (botId: string) => {
    const api = await getCozeApi(localStorageKey);
    const bot = await api.bots.retrieveNew(botId);
    return bot;
  };

  const getBots = async (workspaceId: string) => {
    const api = await getCozeApi(localStorageKey);
    const bots = await api.bots.listNew({
      workspace_id: workspaceId,
      page_num: 1,
      page_size: 50,
    });
    return bots.items;
  };

  const getWorkspaces = async () => {
    const api = await getCozeApi(localStorageKey);
    const workspaces = await api.workspaces.list({
      page_num: 1,
      page_size: 50,
    });
    return workspaces.workspaces;
  };

  const getVoices = async () => {
    try {
      const api = await getCozeApi(localStorageKey);
      const pageSize = 100;
      let pageNum = 1;
      let hasMore = true;
      let allVoices: Voice[] = [];
      while (hasMore) {
        const response = await api.audio.voices.list({
          page_size: pageSize,
          page_num: pageNum,
        });
        hasMore = response?.has_more || false;
        allVoices = [...allVoices, ...(response?.voice_list || [])];
        pageNum++;
      }

      const customVoices = allVoices.filter(voice => !voice.is_system_voice);
      const systemVoices = allVoices.filter(voice => voice.is_system_voice);

      const systemVoicesByLanguage = systemVoices.reduce<
        Record<string, typeof systemVoices>
      >((acc, voice) => {
        const languageName = voice.language_name;
        if (!acc[languageName]) {
          acc[languageName] = [];
        }
        acc[languageName].push(voice);
        return acc;
      }, {});

      const sortedSystemVoices = Object.entries(systemVoicesByLanguage)
        .sort(([langA], [langB]) => langB.localeCompare(langA))
        .flatMap(([, voices]) => voices);

      const formattedVoices = [...customVoices, ...sortedSystemVoices].map(
        voice => ({
          value: voice.voice_id,
          label: `${voice.name} (${voice.language_name})`,
        }),
      );

      return formattedVoices;
    } catch (error) {
      console.error('get voices error:', error);
      throw error;
    }
  };

  return {
    getBots,
    getWorkspaces,
    getBotInfo,
    getVoices,
  };
};

export default useApi;
