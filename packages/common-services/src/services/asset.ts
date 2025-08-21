import { useGet, usePost, usePatch, useDelete, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { AssetResponse, AssetCreateRequest, AssetUpdateRequest } from '@plug/common-services';

const END_POINT = `assets`;

export const getAssets = async (): Promise<AssetResponse[]> => {
  try {
    const resp = await api.get<AssetResponse[]>(END_POINT, { requireAuth: true });
    return (resp as any)?.data ?? [];
  } catch (_) {
    return [];
  }
};

export const useAssets = () => {
  return useGet<AssetResponse[]>(END_POINT, { requireAuth: true });
};

export const useAssetDetail = (assetId: number) => {
  return useGet<AssetResponse>(`${END_POINT}/${assetId}`, { requireAuth: true });
};

export const useCreateAsset = () => {
  return usePost<AssetCreateRequest>(END_POINT, { requireAuth: true });
};

export const useUpdateAsset = (assetId: number) => {
  return usePatch<AssetUpdateRequest>(`${END_POINT}/${assetId}`, { requireAuth: true });
};

export const deleteAsset = async (assetId: number) => {
  return api.delete(`${END_POINT}/${assetId}`, { requireAuth: true });
};

export const useAssignAssetCategory = (assetId: number, categoryId: number) => {
  return usePatch<null>(`${END_POINT}/${assetId}/category/${categoryId}`, { requireAuth: true });
};

export const useRemoveAssetCategory = (assetId: number) => {
  return useDelete(`${END_POINT}/${assetId}/category`, { requireAuth: true });
};

export const useAssetsSWR = () => {
  return useSWRApi<AssetResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useAssetDetailSWR = (assetId: number | undefined) => {
  const url = assetId ? `${END_POINT}/${assetId}` : '';
  return useSWRApi<AssetResponse>(url, 'GET', { requireAuth: true }, {
  isPaused: () => !assetId,
  });
};