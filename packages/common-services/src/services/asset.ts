import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import { AssetResponse, AssetCreateRequest, AssetUpdateRequest } from '@plug/common-services/types';

const ASSET_API = `asset`;

export const useAssets = () => {
    return useGet<AssetResponse[]>(ASSET_API, { requireAuth: true });
};

export const useAssetDetail = (assetId: number) => {
    return useGet<AssetResponse>(`${ASSET_API}/${assetId}`, { requireAuth: true });
};

export const useAssetDelete = (assetId: number) => {
    return useDelete(`${ASSET_API}/${assetId}`, { requireAuth: true });
};

export const useAssetCreate = () => {
    return usePost<CreatedResponseBody, AssetCreateRequest>(ASSET_API, { requireAuth: true });
};

export const useAssetUpdate = () => {
    return usePut<BaseResponseBody, AssetUpdateRequest>(`${ASSET_API}`, { requireAuth: true });
};

// SWR 기반 훅
export const useAssetsSWR = () => {
    return useSWRApi<AssetResponse[]>(ASSET_API, 'GET', { requireAuth: true });
};

export const useAssetsDetailSWR = (assetId: number) => {
    return useSWRApi<AssetResponse>(`${ASSET_API}/${assetId}`, 'GET', { requireAuth: true });
}
