import { api } from '@plug/api-hooks';
import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { 
  AssetResponse, 
  AssetCreateRequest, 
  AssetUpdateRequest 
} from '@plug/common-services';

const ASSET_API = `assets`;

// 에셋 목록 조회
export const useAssets = () => {
  return useGet<AssetResponse[]>(ASSET_API, { requireAuth: true });
};

// 에셋 상세 조회
export const useAssetDetail = (assetId: number) => {
  return useGet<AssetResponse>(`${ASSET_API}/${assetId}`, { requireAuth: true });
};

// 에셋 생성
export const useCreateAsset = () => {
  return usePost<AssetCreateRequest>(ASSET_API, { requireAuth: true });
};

// 에셋 수정
export const useUpdateAsset = (assetId: number) => {
  return usePut<AssetUpdateRequest>(`${ASSET_API}/${assetId}`, { requireAuth: true });
};

// 에셋 삭제
export const deleteAsset = (assetId: number) => {
  return api.delete(`${ASSET_API}/${assetId}`, { requireAuth: true });
};

// 에셋에 카테고리 할당
export const useAssignAssetCategory = (assetId: number, categoryId: number) => {
  return usePut<null>(`${ASSET_API}/${assetId}/category/${categoryId}`, { requireAuth: true });
};

// 에셋에서 카테고리 제거
export const useRemoveAssetCategory = (assetId: number) => {
  return useDelete(`${ASSET_API}/${assetId}/category`, { requireAuth: true });
};

// SWR 기반 훅들
export const useAssetsSWR = () => {
  return useSWRApi<AssetResponse[]>(ASSET_API, 'GET', { requireAuth: true });
};

export const useAssetDetailSWR = (assetId: number | null) => {
  const url = assetId && assetId > 0 ? `${ASSET_API}/${assetId}` : '';
  return useSWRApi<AssetResponse>(url, 'GET', undefined, { requireAuth: true });
};