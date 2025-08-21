import { useGet, usePost, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type {
  AssetCategoryResponse,
  AssetCategoryCreateRequest,
  AssetCategoryUpdateRequest,
  AssetCategoryDepthResponse,
} from '@plug/common-services';

const END_POINT = `asset-categories`;
const DEPTH_END_POINT = `${END_POINT}/max-depth`;

// New API: list and maxDepth are fetched separately
export const getAssetCategoryList = async (): Promise<AssetCategoryResponse[]> => {
  try {
    const resp = await api.get<AssetCategoryResponse[]>(END_POINT, { requireAuth: true });
    // Some backends wrap the response in { data }
    return ((resp as any)?.data ?? (resp as any)) as AssetCategoryResponse[];
  } catch (_) {
    return [];
  }
};

export const getAssetCategoryMaxDepth = async (): Promise<number> => {
  try {
    const resp = await api.get<AssetCategoryDepthResponse>(DEPTH_END_POINT, { requireAuth: true });
    const data = (resp as any)?.data ?? (resp as any);
    return (data?.maxDepth ?? 0) as number;
  } catch (_) {
    return 0;
  }
};

export const useAssetCategories = () => {
  return useGet<AssetCategoryResponse[]>(END_POINT, { requireAuth: true });
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
  return useSWRApi<AssetCategoryResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useAssetCategoryMaxDepthSWR = () => {
  return useSWRApi<AssetCategoryDepthResponse>(DEPTH_END_POINT, 'GET', { requireAuth: true });
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
  const { data: list, error: listError, isLoading: listLoading, mutate: mutateList } = useAssetCategoriesSWR();
  const { data: depthData, error: depthError, isLoading: depthLoading, mutate: mutateDepth } = useAssetCategoryMaxDepthSWR();
  const error = listError || depthError;
  const isLoading = listLoading || depthLoading;
  return {
    categories: list ?? [],
    maxDepth: depthData?.maxDepth ?? 0,
    error,
    isLoading,
    mutate: async () => {
      await Promise.all([mutateList(), mutateDepth()]);
    },
    refresh: async () => {
      await Promise.all([mutateList(), mutateDepth()]);
    },
  };
};