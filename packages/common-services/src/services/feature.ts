import { useGet, usePost, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { 
  FeatureResponse, 
  FeatureCreateRequest, 
  FeatureUpdateRequest,
  FeatureAssignDto
} from '../types/feature';

const END_POINT = `features`;

// Features 목록 조회 (facilityId가 필수)
export const useFeatures = (facilityId: number, queryParams?: Record<string, any>) => {
  const allParams = { facilityId: facilityId.toString(), ...queryParams };
  const queryString = '?' + new URLSearchParams(allParams).toString();
  return useGet<FeatureResponse[]>(`${END_POINT}${queryString}`, { requireAuth: true });
};

// Feature 생성
export const useCreateFeature = () => {
  return usePost<FeatureCreateRequest>(END_POINT, { requireAuth: true });
};

// Feature 생성 (단순한 경우)
export const createFeature = async (data: FeatureCreateRequest): Promise<FeatureResponse> => {
  const response = await api.post(END_POINT, data, { requireAuth: true });
  
  if (response.status !== 201) {
    throw new Error(`Unexpected response status: ${response.status}`);
  }
  
  return await response.json();
};

// Feature 삭제
export const deleteFeature = async (featureId: string): Promise<void> => {
  await api.delete(`${END_POINT}/${featureId}`, { requireAuth: true });
};

// Feature Transform 업데이트 (position, rotation, scale)
export const updateFeatureTransform = async (featureId: string, data: FeatureUpdateRequest): Promise<void> => {
  await api.patch(`${END_POINT}/${featureId}/transform`, data, { requireAuth: true });
};

// Feature에 디바이스 할당
export const assignDeviceToFeature = async (featureId: string, data: FeatureAssignDto): Promise<void> => {
  await api.patch(`${END_POINT}/${featureId}/assign-device`, data, { requireAuth: true });
};

// Feature에서 디바이스 연결 해제
export const removeDeviceFromFeature = async (featureId: string): Promise<void> => {
  await api.delete(`${END_POINT}/${featureId}/revoke-device`, { requireAuth: true });
};

// SWR 훅들
export const useFeaturesSWR = (facilityId: number, queryParams?: Record<string, any>) => {
  const allParams = { facilityId: facilityId.toString(), ...queryParams };
  const queryString = '?' + new URLSearchParams(allParams).toString();
  return useSWRApi<FeatureResponse[]>(`${END_POINT}${queryString}`, 'GET', { requireAuth: true });
};

export const useFeaturesByFacilitySWR = (facilityId: number) => {
  const queryString = `?facilityId=${facilityId}`;
  return useSWRApi<FeatureResponse[]>(`${END_POINT}${queryString}`, 'GET', { requireAuth: true });
};

// 3D 화면에서 Feature transform 업데이트를 위한 편의 함수들
export const updateFeaturePosition = async (featureId: string, position: { x: number; y: number; z: number }): Promise<void> => {
  return updateFeatureTransform(featureId, { position });
};

export const updateFeatureRotation = async (featureId: string, rotation: { x: number; y: number; z: number }): Promise<void> => {
  return updateFeatureTransform(featureId, { rotation });
};

export const updateFeatureScale = async (featureId: string, scale: { x: number; y: number; z: number }): Promise<void> => {
  return updateFeatureTransform(featureId, { scale });
};

export const updateFeatureFullTransform = async (
  featureId: string, 
  transform: {
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
  }
): Promise<void> => {
  return updateFeatureTransform(featureId, transform);
};
