/**
 * useDatasetApi Hook
 * 知识库 API 调用封装
 */

import { useState, useCallback, useRef } from 'react';
import { CozeAPI } from '@coze/api';
import { message } from 'antd';
import type {
  DatasetInfo,
  DatasetFormData,
  DocumentInfo,
  PhotoInfo,
  DocumentBase,
  DocumentProgress,
  DatasetFormatType,
  UpdateRule,
  SourceInfo,
  DocumentSourceType,
} from '../types';
import { DEFAULT_CHUNK_STRATEGY, DEFAULT_UPDATE_RULE } from '../utils/constants';
import { getAuth } from '../bot-manager/utils/storage';
import { SPACE_ID } from '../bot-manager/utils/constants';

/**
 * 文件转 Base64
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // 移除 data:type;base64, 前缀
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 获取文件扩展名
 */
const getFileExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext || '';
};

/**
 * useDatasetApi Hook
 */
export const useDatasetApi = () => {
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const apiRef = useRef<CozeAPI | null>(null);

  /**
   * 获取 Coze API 客户端
   */
  const getCozeApi = useCallback((): CozeAPI | null => {
    if (apiRef.current) {
      return apiRef.current;
    }

    const auth = getAuth();
    if (!auth || !auth.pat) {
      return null;
    }

    apiRef.current = new CozeAPI({
      baseURL: 'https://api.coze.cn',
      token: auth.pat,
      allowPersonalAccessTokenInBrowser: true,
    });

    return apiRef.current;
  }, []);

  /**
   * 获取知识库列表
   */
  const fetchDatasets = useCallback(async (): Promise<void> => {
    const api = getCozeApi();
    if (!api) {
      return;
    }

    setLoading(true);
    try {
      // 使用 knowledge API
      const result = await api.knowledge.dataset.list({
        space_id: SPACE_ID,
        page_num: 1,
        page_size: 100,
      });

      setDatasets(result.data?.dataset_list || []);
    } catch (error) {
      console.error('Failed to fetch datasets:', error);
      message.error('获取知识库列表失败');
    } finally {
      setLoading(false);
    }
  }, [getCozeApi]);

  /**
   * 创建知识库
   */
  const createDataset = useCallback(async (data: DatasetFormData): Promise<string | null> => {
    const api = getCozeApi();
    if (!api) {
      return null;
    }

    setLoading(true);
    try {
      const result = await api.knowledge.dataset.create({
        space_id: SPACE_ID,
        name: data.name,
        description: data.description,
        format_type: data.format_type,
        file_id: data.icon_file_id,
      });

      message.success('知识库创建成功');
      return result.data?.dataset_id || null;
    } catch (error) {
      console.error('Failed to create dataset:', error);
      message.error(`创建知识库失败：${(error as Error).message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getCozeApi]);

  /**
   * 更新知识库
   */
  const updateDataset = useCallback(async (
    datasetId: string,
    data: Partial<DatasetFormData>
  ): Promise<boolean> => {
    const api = getCozeApi();
    if (!api) {
      return false;
    }

    setLoading(true);
    try {
      const updateParams: any = {
        dataset_id: datasetId,
        name: data.name,
      };

      if (data.description !== undefined) {
        updateParams.description = data.description;
      }
      if (data.icon_file_id !== undefined) {
        updateParams.file_id = data.icon_file_id;
      }

      await api.knowledge.dataset.update(updateParams);
      message.success('知识库更新成功');
      return true;
    } catch (error) {
      console.error('Failed to update dataset:', error);
      message.error(`更新知识库失败：${(error as Error).message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getCozeApi]);

  /**
   * 删除知识库
   */
  const deleteDataset = useCallback(async (datasetId: string): Promise<boolean> => {
    const api = getCozeApi();
    if (!api) {
      return false;
    }

    setLoading(true);
    try {
      await api.knowledge.dataset.delete({
        dataset_id: datasetId,
      });
      message.success('知识库删除成功');
      return true;
    } catch (error) {
      console.error('Failed to delete dataset:', error);
      message.error(`删除知识库失败：${(error as Error).message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getCozeApi]);

  /**
   * 查询文件列表（文本知识库）
   */
  const fetchDocuments = useCallback(async (
    datasetId: string,
    page: number = 1
  ): Promise<DocumentInfo[]> => {
    const api = getCozeApi();
    if (!api) {
      return [];
    }

    try {
      const result = await api.knowledge.document.list({
        dataset_id: datasetId,
        page,
        size: 50,
      });

      return result.document_infos || [];
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      message.error('获取文件列表失败');
      return [];
    }
  }, [getCozeApi]);

  /**
   * 查询图片列表（图片知识库）
   */
  const fetchImages = useCallback(async (
    datasetId: string,
    page: number = 1
  ): Promise<PhotoInfo[]> => {
    const api = getCozeApi();
    if (!api) {
      return [];
    }

    try {
      const result = await api.knowledge.images.list({
        dataset_id: datasetId,
        page_num: page,
        page_size: 50,
      });

      return result.data?.photo_infos || [];
    } catch (error) {
      console.error('Failed to fetch images:', error);
      message.error('获取图片列表失败');
      return [];
    }
  }, [getCozeApi]);

  /**
   * 创建知识库文件
   */
  const createDocument = useCallback(async (
    datasetId: string,
    documentBases: DocumentBase[],
    formatType: DatasetFormatType
  ): Promise<string[] | null> => {
    const api = getCozeApi();
    if (!api) {
      return null;
    }

    try {
      const result = await api.knowledge.document.create({
        dataset_id: datasetId,
        document_bases: documentBases,
        chunk_strategy: DEFAULT_CHUNK_STRATEGY,
        format_type: formatType,
      });

      const documentIds = result.document_infos?.map(d => d.document_id) || [];
      return documentIds;
    } catch (error) {
      console.error('Failed to create document:', error);
      message.error(`文件上传失败：${(error as Error).message}`);
      return null;
    }
  }, [getCozeApi]);

  /**
   * 修改知识库文件
   */
  const updateDocument = useCallback(async (
    documentId: string,
    data: { document_name?: string; update_rule?: UpdateRule }
  ): Promise<boolean> => {
    const api = getCozeApi();
    if (!api) {
      return false;
    }

    try {
      await api.knowledge.document.update({
        document_id: documentId,
        document_name: data.document_name,
        update_rule: data.update_rule,
      });
      message.success('文件更新成功');
      return true;
    } catch (error) {
      console.error('Failed to update document:', error);
      message.error(`更新文件失败：${(error as Error).message}`);
      return false;
    }
  }, [getCozeApi]);

  /**
   * 删除文件
   */
  const deleteDocuments = useCallback(async (documentIds: string[]): Promise<boolean> => {
    const api = getCozeApi();
    if (!api) {
      return false;
    }

    try {
      await api.knowledge.document.delete({
        document_ids: documentIds,
      });
      message.success('文件删除成功');
      return true;
    } catch (error) {
      console.error('Failed to delete documents:', error);
      message.error(`删除文件失败：${(error as Error).message}`);
      return false;
    }
  }, [getCozeApi]);

  /**
   * 获取文件上传进度
   */
  const fetchDocumentProgress = useCallback(async (
    datasetId: string,
    documentIds: string[]
  ): Promise<DocumentProgress[]> => {
    const api = getCozeApi();
    if (!api) {
      return [];
    }

    try {
      const result = await api.knowledge.document.progress({
        dataset_id: datasetId,
        document_ids: documentIds,
      });

      return result.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch document progress:', error);
      return [];
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
   * 更新图片描述
   */
  const updateImageCaption = useCallback(async (
    documentId: string,
    caption: string
  ): Promise<boolean> => {
    const api = getCozeApi();
    if (!api) {
      return false;
    }

    try {
      await api.knowledge.images.updateCaption(documentId, {
        caption,
      });
      message.success('图片描述更新成功');
      return true;
    } catch (error) {
      console.error('Failed to update image caption:', error);
      message.error(`更新图片描述失败：${(error as Error).message}`);
      return false;
    }
  }, [getCozeApi]);

  return {
    loading,
    datasets,
    fetchDatasets,
    createDataset,
    updateDataset,
    deleteDataset,
    fetchDocuments,
    fetchImages,
    createDocument,
    updateDocument,
    deleteDocuments,
    fetchDocumentProgress,
    uploadFile,
    updateImageCaption,
  };
};
