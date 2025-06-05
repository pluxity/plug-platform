import { api } from '@plug/api-hooks';
import { useGet, usePost, usePut, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import { AssetResponse, AssetCreateRequest, AssetUpdateRequest } from '@plug/common-services/types';

const ASSET_API = `assets`;

// 자산 목록 조회
export const useAssets = () => {
    return useGet<AssetResponse[]>(ASSET_API, { requireAuth: true });
};

// 자산 상세 조회
export const useAssetDetail = (assetId: number) => {
    return useGet<AssetResponse>(`${ASSET_API}/${assetId}`, { requireAuth: true });
};

// 자산 삭제
export const deleteAsset = async (assetId: number) => {
    return await api.delete(`${ASSET_API}/${assetId}`, { requireAuth: true });
  }

// 자산 생성
export const useAssetCreate = () => {
    return usePost<CreatedResponseBody, AssetCreateRequest>(ASSET_API, { requireAuth: true });
};

// 자산 수정
export const useAssetUpdate = (assetId: number) => {
    return usePut<BaseResponseBody, AssetUpdateRequest>(`${ASSET_API}/${assetId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useAssetsSWR = () => {
    return useSWRApi<AssetResponse[]>(ASSET_API, 'GET', { requireAuth: true });
};

export const useAssetsDetailSWR = (assetId: number) => {
    const key = assetId ? `${ASSET_API}/${assetId}` : '';
    return useSWRApi<AssetResponse>(key, 'GET', { requireAuth: true });
};
