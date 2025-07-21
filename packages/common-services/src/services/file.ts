import { useCallback, useState } from 'react';
import { useGet, usePost } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { RequestOptions } from '@plug/api-hooks';
import type { FileResponse, UseFileUploadWithInfoReturn } from '../types/file';

const END_POINT = `files`;

const extractFileIdFromLocation = (location: string | null): number | null => {
  if (!location) return null;
  
  const id = parseInt(location.split('/').pop() || '');
  return isNaN(id) ? null : id;
};

export const useFileInfo = (fileId?: number | string, options?: RequestOptions) => {
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
  
  const executeUploadWithAutoFetch = useCallback(async (file: File): Promise<FileResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResult = await executeUpload(formData);
      
      const location = uploadResult.response?.headers.get('Location') || null;
      const extractedFileId = extractFileIdFromLocation(location);

      if (extractedFileId) {
        setIsLoadingFileInfo(true);
        setFileInfoError(null);

        try {
          const fileInfoResult = await api.get<FileResponse>(`${END_POINT}/${extractedFileId}`, {
            requireAuth: true,
            ...options
          });

          setFileInfo(fileInfoResult.data);
          return fileInfoResult.data; // FileResponse 반환

        } catch (error) {
          setFileInfoError(error instanceof Error ? error : new Error('파일 정보 조회 중 오류 발생'));
          throw error;
        } finally {
          setIsLoadingFileInfo(false);
        }
      } else {
        const errorMsg = `Location 헤더에서 유효한 파일 ID를 추출할 수 없습니다: ${location || 'null'}`;
        console.warn(errorMsg);
        const error = new Error(errorMsg);
        setFileInfoError(error);
        throw error;
      }
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