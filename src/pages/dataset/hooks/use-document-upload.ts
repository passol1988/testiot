/**
 * useDocumentUpload Hook
 * 处理文件上传和进度轮询
 */

import { useState, useCallback, useRef } from 'react';
import { message } from 'antd';
import type {
  DocumentProgress,
  DocumentBase,
} from '../types';
import {
  DatasetFormatType,
  DocumentSourceType,
} from '../types';
import {
  DEFAULT_UPDATE_RULE,
  POLLING_CONFIG,
} from '../utils/constants';
import { useDatasetApi } from './use-dataset-api';

/**
 * useDocumentUpload Hook
 */
export const useDocumentUpload = () => {
  const { uploadFile, createDocument, fetchDocumentProgress } = useDatasetApi();

  const [uploading, setUploading] = useState(false);
  const [progressData, setProgressData] = useState<DocumentProgress[]>([]);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const uploadStartTimeRef = useRef<number>(0);

  /**
   * 文件转 Base64
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
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
   * 进度轮询
   */
  const pollProgress = useCallback(async (
    datasetId: string,
    documentIds: string[],
    onSuccess?: () => void
  ): Promise<void> => {
    let attempts = 0;
    uploadStartTimeRef.current = Date.now();
    setProgressModalVisible(true);

    const poll = async () => {
      attempts++;
      const progressList = await fetchDocumentProgress(datasetId, documentIds);
      // Calculate elapsed time in seconds
      const elapsedSeconds = Math.floor((Date.now() - uploadStartTimeRef.current) / 1000);
      // Add elapsed_time to each progress item
      const progressWithElapsed = progressList.map(p => ({
        ...p,
        elapsed_time: elapsedSeconds,
      }));
      setProgressData(progressWithElapsed);

      const allDone = progressList.every(
        p => p.status === 1 || p.status === 9
      );

      if (allDone || attempts >= POLLING_CONFIG.maxAttempts) {
        clearInterval(timer);
        setTimeout(() => {
          setProgressModalVisible(false);
          onSuccess?.();
        }, POLLING_CONFIG.completeDelay);
      }
    };

    await poll();
    const timer = setInterval(poll, POLLING_CONFIG.interval);
  }, [fetchDocumentProgress]);

  /**
   * 上传文本文件
   */
  const uploadDocuments = useCallback(async (
    datasetId: string,
    files: File[],
    formatType: DatasetFormatType,
    onSuccess?: () => void
  ): Promise<void> => {
    setUploading(true);
    try {
      const documentIds: string[] = [];

      for (const file of files) {
        const base64 = await fileToBase64(file);
        const documentBases: DocumentBase[] = [{
          name: file.name,
          source_info: {
            file_base64: base64,
            file_type: getFileExtension(file.name),
            document_source: 0 as DocumentSourceType,
          },
        }];

        const ids = await createDocument(
          datasetId,
          documentBases,
          formatType
        );

        if (ids) {
          documentIds.push(...ids);
        }
      }

      if (documentIds.length > 0) {
        await pollProgress(datasetId, documentIds, onSuccess);
        message.success(`成功上传 ${files.length} 个文件`);
      }
    } catch (error) {
      console.error('Upload documents error:', error);
      message.error('文件上传失败');
    } finally {
      setUploading(false);
    }
  }, [createDocument, pollProgress]);

  /**
   * 上传图片文件
   */
  const uploadImages = useCallback(async (
    datasetId: string,
    files: File[],
    captionType: 0 | 1,
    captions?: string[],
    onSuccess?: () => void
  ): Promise<void> => {
    setUploading(true);
    try {
      const documentIds: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = await uploadFile(file);

        if (fileId) {
          const documentBases: DocumentBase[] = [{
            name: file.name,
            source_info: {
              source_file_id: fileId,
              document_source: 5 as DocumentSourceType,
            },
            caption: captionType === 1 ? (captions?.[i] || '') : undefined,
          }];

          const ids = await createDocument(
            datasetId,
            documentBases,
            DatasetFormatType.IMAGE
          );

          if (ids) {
            documentIds.push(...ids);
          }
        }
      }

      if (documentIds.length > 0) {
        await pollProgress(datasetId, documentIds, onSuccess);
        message.success(`成功上传 ${files.length} 张图片`);
      }
    } catch (error) {
      console.error('Upload images error:', error);
      message.error('图片上传失败');
    } finally {
      setUploading(false);
    }
  }, [uploadFile, createDocument, pollProgress]);

  /**
   * 上传在线网页
   */
  const uploadWebPage = useCallback(async (
    datasetId: string,
    webUrl: string,
    documentName: string,
    onSuccess?: () => void,
    updateRule?: { update_type: 0 | 1; update_interval: number }
  ): Promise<void> => {
    setUploading(true);
    try {
      const documentBases: DocumentBase[] = [{
        name: documentName,
        source_info: {
          web_url: webUrl,
          document_source: 1 as DocumentSourceType,
        },
        update_rule: updateRule || DEFAULT_UPDATE_RULE,
      }];

      const ids = await createDocument(
        datasetId,
        documentBases,
        DatasetFormatType.TEXT
      );

      if (ids && ids.length > 0) {
        await pollProgress(datasetId, ids, onSuccess);
        message.success('网页添加成功');
      }
    } catch (error) {
      console.error('Upload web page error:', error);
      message.error('网页添加失败');
    } finally {
      setUploading(false);
    }
  }, [createDocument, pollProgress]);

  /**
   * 隐藏进度弹窗
   */
  const hideProgressModal = useCallback(() => {
    setProgressModalVisible(false);
  }, []);

  return {
    uploading,
    progressData,
    progressModalVisible,
    uploadDocuments,
    uploadImages,
    uploadWebPage,
    hideProgressModal,
  };
};
