import { useGet, usePost, usePatch, useDelete, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { 
  FeatureResponse, 
  FeatureCreateRequest, 
  FeatureUpdateRequest,
  FeatureAssignDto
} from '../types/feature';

const END_POINT = `features`;

// 피처 목록 조회
export const useFeatures = () => {
  return useGet<FeatureResponse[]>(END_POINT, { requireAuth: true });
};

// 피처 상세 조회
export const useFeatureDetail = (featureId: string) => {
  return useGet<FeatureResponse>(`${END_POINT}/${featureId}`, { requireAuth: true });
};

// 피처 생성
export const useCreateFeature = () => {
  return usePost<FeatureCreateRequest>(END_POINT, { requireAuth: true });
};

// 피처 삭제
export const deleteFeature = async (featureId: string) => {
  return api.delete(`${END_POINT}/${featureId}`, { requireAuth: true });
};

// 피처 정보 수정 (transform)
export const useUpdateFeature = (featureId: string) => {
  return usePatch<FeatureUpdateRequest>(`${END_POINT}/${featureId}/transform`, { requireAuth: true });
};

// 피처에 디바이스 할당
export const useAssignDeviceToFeature = (featureId: string) => {
  return usePatch<FeatureAssignDto>(`${END_POINT}/${featureId}/assign-device`, { requireAuth: true });
};

// 피처에 에셋 할당
export const useAssignAssetToFeature = (featureId: string, assetId: number) => {
  return usePatch<null>(`${END_POINT}/${featureId}/assets/${assetId}`, { requireAuth: true });
};

// 피처에서 디바이스 연결 해제
export const useRemoveDeviceFromFeature = (featureId: string) => {
  return useDelete(`${END_POINT}/${featureId}/revoke-device`, { requireAuth: true });
};

// 피처에서 에셋 연결 해제
export const useRemoveAssetFromFeature = (featureId: string) => {
  return useDelete(`${END_POINT}/${featureId}/assets`, { requireAuth: true });
};

// SWR 기반 훅들
export const useFeaturesSWR = () => {
  return useSWRApi<FeatureResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useFeatureDetailSWR = (featureId: string) => {
  return useSWRApi<FeatureResponse>(`${END_POINT}/${featureId}`, 'GET', { requireAuth: true });
};
