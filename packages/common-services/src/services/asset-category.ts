import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import type { 
  AssetCategoryResponse, 
  AssetCategoryAllResponse,
  AssetCategoryCreateRequest, 
  AssetCategoryUpdateRequest 
} from '@plug/common-services';

const ASSET_CATEGORY_API = `/asset-categories`;

// 에셋 카테고리 목록 조회
export const useAssetCategories = () => {
  return useGet<AssetCategoryAllResponse>(ASSET_CATEGORY_API, { requireAuth: true });
};

// 에셋 카테고리 상세 조회
export const useAssetCategoryDetail = (categoryId: number) => {
  return useGet<AssetCategoryResponse>(`${ASSET_CATEGORY_API}/${categoryId}`, { requireAuth: true });
};

// 하위 에셋 카테고리 목록 조회
export const useAssetCategoryChildren = (categoryId: number) => {
  return useGet<AssetCategoryResponse[]>(`${ASSET_CATEGORY_API}/${categoryId}/children`, { requireAuth: true });
};

// 에셋 카테고리 생성
export const useCreateAssetCategory = () => {
  return usePost<CreatedResponseBody, AssetCategoryCreateRequest>(ASSET_CATEGORY_API, { requireAuth: true });
};

// 에셋 카테고리 수정
export const useUpdateAssetCategory = (categoryId: number) => {
  return usePut<BaseResponseBody, AssetCategoryUpdateRequest>(`${ASSET_CATEGORY_API}/${categoryId}`, { requireAuth: true });
};

// 에셋 카테고리 삭제
export const useDeleteAssetCategory = (categoryId: number) => {
  return useDelete(`${ASSET_CATEGORY_API}/${categoryId}`, { requireAuth: true });
};

// SWR 기반 훅들
export const useAssetCategoriesSWR = () => {
  return useSWRApi<AssetCategoryAllResponse>(ASSET_CATEGORY_API, 'GET', { requireAuth: true });
};

export const useAssetCategoryDetailSWR = (categoryId: number) => {
  return useSWRApi<AssetCategoryResponse>(`${ASSET_CATEGORY_API}/${categoryId}`, 'GET', { requireAuth: true });
};

export const useAssetCategoryChildrenSWR = (categoryId: number) => {
  return useSWRApi<AssetCategoryResponse[]>(`${ASSET_CATEGORY_API}/${categoryId}/children`, 'GET', { requireAuth: true });
};
