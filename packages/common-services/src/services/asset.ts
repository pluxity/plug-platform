import { useGet, usePost, usePut, useDelete } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import { AssetResponse, AssetCreateRequest, AssetUpdateRequest } from '@plug/common-services/types';

const ASSET_API = `asset`;

export const useAssets = () => {
    return useGet<AssetResponse[]>(ASSET_API, { requireAuth: true });
};

export const useAssetDetail = (id: number) => {
    return useGet<AssetResponse>(`${ASSET_API}/${id}`, { requireAuth: true });
};

export const useAssetDelete = (id: number) => {
    return useDelete(`${ASSET_API}/${id}`, { requireAuth: true });
};

export const useAssetCreate = () => {
    return usePost<CreatedResponseBody, AssetCreateRequest>(ASSET_API, { requireAuth: true });
};

export const useAssetUpdate = () => {
    return usePut<BaseResponseBody, AssetUpdateRequest>(`${ASSET_API}`, { requireAuth: true });
};


