import { useGet, usePost, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type {
  AssetCategoryResponse,
  AssetCategoryAllResponse,
  AssetCategoryCreateRequest,
  AssetCategoryUpdateRequest
} from '@plug/common-services';

const END_POINT = `asset-categories`;

export const getAssetCategories = async (): Promise<AssetCategoryAllResponse> => {
  try {
    const resp = await api.get<AssetCategoryAllResponse>(END_POINT, { requireAuth: true });
    return (resp as any) ?? { list: [], maxDepth: 0 } as AssetCategoryAllResponse;
  } catch (_) {
    return { list: [], maxDepth: 0 } as AssetCategoryAllResponse;
  }
};

export const useAssetCategories = () => {
  return useGet<AssetCategoryAllResponse>(END_POINT, { requireAuth: true });
};

export const useAssetCategoryDetail = (categoryId: number) => {
  return useGet<AssetCategoryResponse>(`${END_POINT}/${categoryId}`, { requireAuth: true });
};

export const useAssetCategoryChildren = (categoryId: number) => {
  return useGet<AssetCategoryResponse[]>(`${END_POINT}/${categoryId}/children`, { requireAuth: true });
};

export const useCreateAssetCategory = () => {
  return usePost<AssetCategoryCreateRequest>(END_POINT, { requireAuth: true });
};

export const updateAssetCategory = async (categoryId: number, data: AssetCategoryUpdateRequest) => {
  return api.put(`${END_POINT}/${categoryId}`, data, { requireAuth: true });
};

export const deleteAssetCategory = async (categoryId: number) => {
  return api.delete(`${END_POINT}/${categoryId}`, { requireAuth: true });
};

export const useAssetCategoriesSWR = () => {
  return useSWRApi<AssetCategoryAllResponse>(END_POINT, 'GET', { requireAuth: true });
};

export const useAssetCategoryDetailSWR = (categoryId: number) => {
  return useSWRApi<AssetCategoryResponse>(`${END_POINT}/${categoryId}`, 'GET', { requireAuth: true });
};

export const useAssetCategoryChildrenSWR = (categoryId: number) => {
  return useSWRApi<AssetCategoryResponse[]>(`${END_POINT}/${categoryId}/children`, 'GET', { requireAuth: true });
};

export const useAssetCategoryDetailSWRConditional = (categoryId?: number) => {
  const url = categoryId ? `${END_POINT}/${categoryId}` : '';
  return useSWRApi<AssetCategoryResponse>(url, 'GET', { requireAuth: true }, {
    fallbackData: null,
    shouldRetryOnError: false,
    isPaused: () => !categoryId,
  });
};

export const useAssetCategoryChildrenSWRConditional = (categoryId?: number) => {
  const url = categoryId ? `${END_POINT}/${categoryId}/children` : '';
  return useSWRApi<AssetCategoryResponse[]>(url, 'GET', { requireAuth: true }, {
    fallbackData: [],
    shouldRetryOnError: false,
    isPaused: () => !categoryId,
  });
};

export const useAssetCategoryTree = () => {
  const { data, error, isLoading, mutate } = useAssetCategoriesSWR();
  
  return {
    categories: data?.list || [],
    maxDepth: data?.maxDepth || 0,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
  };
};