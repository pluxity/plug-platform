import { useCallback, useState } from 'react';
import { useGet, usePost } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { RequestOptions } from '@plug/api-hooks';
import type { FileResponse, UseFileUploadWithInfoReturn } from '../types/file';

const END_POINT = `files`;

export const useFileInfo = (fileId: number | string, options?: RequestOptions) => {
  return useGet<FileResponse>(`${END_POINT}/${fileId}`, {
    requireAuth: true,
    ...options
  });
};

export const useFileUpload = (options?: RequestOptions) => {
  return usePost<FormData>(`${END_POINT}/upload`, {
    requireAuth: true,
    ...options
  });
};

export const useFileUploadWithInfo = (options?: RequestOptions): UseFileUploadWithInfoReturn => {
  const [fileInfo, setFileInfo] = useState<FileResponse | null>(null);
  const [isLoadingFileInfo, setIsLoadingFileInfo] = useState(false);
  const [fileInfoError, setFileInfoError] = useState<Error | null>(null);
  
  const uploadMutation = useFileUpload(options);
  const { execute: executeUpload, ...uploadState } = uploadMutation;
  
  const executeUploadWithAutoFetch = useCallback(async (file: File): Promise<{ data: any; response: Response | null }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResult = await executeUpload(formData);
      
      if (!uploadResult) {
        return { data: null, response: null };
      }
      
      // Location 헤더에서 파일 ID 추출
      const location = uploadResult.response?.headers.get('Location');
      const extractedFileId = location?.split('/').pop() || null;

      if (extractedFileId) {
        setIsLoadingFileInfo(true);
        setFileInfoError(null);

        try {
          const fileInfoResult = await api.get<FileResponse>(`${END_POINT}/${extractedFileId}`, {
            requireAuth: true,
            ...options
          });

          setFileInfo(fileInfoResult.data);

        } catch (error) {
          setFileInfoError(error instanceof Error ? error : new Error('파일 정보 조회 중 오류 발생'));
        } finally {
          setIsLoadingFileInfo(false);
        }
      }
      
      return uploadResult;
    } catch (error) {
      setFileInfoError(error instanceof Error ? error : new Error('업로드 중 오류 발생'));
      throw error;
    }
  }, [executeUpload, options]);
  
  return {
    ...uploadState,
    execute: executeUploadWithAutoFetch,
    fileInfo,
    isLoadingFileInfo,
    fileInfoError,
    clearFileInfo: () => {
      setFileInfo(null);
      setFileInfoError(null);
    }
  };
};