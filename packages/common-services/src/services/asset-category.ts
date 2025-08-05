import { 
  useGet, 
  usePost, 
  useSWRApi
} from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { 
  AssetCategoryResponse, 
  AssetCategoryAllResponse,
  AssetCategoryCreateRequest, 
  AssetCategoryUpdateRequest 
} from '@plug/common-services';

const END_POINT = `asset-categories`;

// 에셋 카테고리 목록 조회
export const useAssetCategories = () => {
  return useGet<AssetCategoryAllResponse>(END_POINT, { requireAuth: true });
};

// 에셋 카테고리 상세 조회
export const useAssetCategoryDetail = (categoryId: number) => {
  return useGet<AssetCategoryResponse>(`${END_POINT}/${categoryId}`, { requireAuth: true });
};

// 하위 에셋 카테고리 목록 조회
export const useAssetCategoryChildren = (categoryId: number) => {
  return useGet<AssetCategoryResponse[]>(`${END_POINT}/${categoryId}/children`, { requireAuth: true });
};

// 에셋 카테고리 생성 (201 응답, 생성된 카테고리 전체 반환)
export const useCreateAssetCategory = () => {
  return usePost<AssetCategoryCreateRequest>(END_POINT, { requireAuth: true });
};

// 에셋 카테고리 수정 (204 No Content 응답)
export const updateAssetCategory = async (categoryId: number, data: AssetCategoryUpdateRequest) => {
  return api.put(`${END_POINT}/${categoryId}`, data, { requireAuth: true });
};

// 에셋 카테고리 삭제 (204 No Content 응답)
export const deleteAssetCategory = async (categoryId: number) => {
  return api.delete(`${END_POINT}/${categoryId}`, { requireAuth: true });
};

// SWR 기반 훅들
export const useAssetCategoriesSWR = () => {
  return useSWRApi<AssetCategoryAllResponse>(END_POINT, 'GET', { requireAuth: true });
};

export const useAssetCategoryDetailSWR = (categoryId: number) => {
  return useSWRApi<AssetCategoryResponse>(`${END_POINT}/${categoryId}`, 'GET', { requireAuth: true });
};

export const useAssetCategoryChildrenSWR = (categoryId: number) => {
  return useSWRApi<AssetCategoryResponse[]>(`${END_POINT}/${categoryId}/children`, 'GET', { requireAuth: true });
};

// 조건부 훅들 (categoryId가 있을 때만 요청)
export const useAssetCategoryDetailSWRConditional = (categoryId?: number) => {
  const url = categoryId ? `${END_POINT}/${categoryId}` : '';
  return useSWRApi<AssetCategoryResponse>(url, 'GET', { requireAuth: true }, {
    fallbackData: null,
    shouldRetryOnError: false,
    isPaused: () => !categoryId, // categoryId가 없으면 요청 중단
  });
};

export const useAssetCategoryChildrenSWRConditional = (categoryId?: number) => {
  const url = categoryId ? `${END_POINT}/${categoryId}/children` : '';
  return useSWRApi<AssetCategoryResponse[]>(url, 'GET', { requireAuth: true }, {
    fallbackData: [],
    shouldRetryOnError: false,
    isPaused: () => !categoryId, // categoryId가 없으면 요청 중단
  });
};

// 유틸리티 훅들
export const useAssetCategoryTree = () => {
  const { data, error, isLoading, mutate } = useAssetCategoriesSWR();
  
  return {
    categories: data?.list || [],
    maxDepth: data?.maxDepth || 0,
    error,
    isLoading,
    mutate, // mutate 함수 반환
    refresh: () => mutate(), // 호환성을 위한 refresh 함수
  };
};