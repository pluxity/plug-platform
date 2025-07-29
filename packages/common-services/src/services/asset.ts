import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { 
  AssetResponse, 
  AssetCreateRequest, 
  AssetUpdateRequest 
} from '@plug/common-services';

const END_POINT = `assets`;

// 에셋 목록 조회
export const useAssets = () => {
  return useGet<AssetResponse[]>(END_POINT, { requireAuth: true });
};

// 에셋 상세 조회
export const useAssetDetail = (assetId: number) => {
  return useGet<AssetResponse>(`${END_POINT}/${assetId}`, { requireAuth: true });
};

// 에셋 생성
export const useCreateAsset = () => {
  return usePost<AssetCreateRequest>(END_POINT, { requireAuth: true });
};

// 에셋 수정
export const useUpdateAsset = (assetId: number) => {
  return usePut<AssetUpdateRequest>(`${END_POINT}/${assetId}`, { requireAuth: true });
};

// 에셋 삭제
export const deleteAsset = async (assetId: number) => {
  return api.delete(`${END_POINT}/${assetId}`, { requireAuth: true });
};

// 에셋에 카테고리 할당
export const useAssignAssetCategory = (assetId: number, categoryId: number) => {
  return usePut<null>(`${END_POINT}/${assetId}/category/${categoryId}`, { requireAuth: true });
};

// 에셋에서 카테고리 제거
export const useRemoveAssetCategory = (assetId: number) => {
  return useDelete(`${END_POINT}/${assetId}/category`, { requireAuth: true });
};

// SWR 기반 훅들
export const useAssetsSWR = () => {
  return useSWRApi<AssetResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useAssetDetailSWR = (assetId: number | undefined) => {
  const url = assetId ? `${END_POINT}/${assetId}` : '';
  return useSWRApi<AssetResponse>(url, 'GET', { requireAuth: true }, {
    isPaused: () => !assetId, // assetId가 없으면 요청 중단
  });
};