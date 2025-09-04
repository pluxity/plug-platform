import { useGet, usePost, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type {
  FeatureResponse,
  FeatureCreateRequest,
  FeatureUpdateRequest,
  FeatureAssignDto
} from '../types/feature';

const END_POINT = `features`;

export const getFeaturesByFacility = async (
  facilityId: number,
  queryParams?: Record<string, any>
): Promise<FeatureResponse[]> => {
  const allParams = { facilityId: facilityId.toString(), ...queryParams };
  const queryString = '?' + new URLSearchParams(allParams).toString();
  try {
    const response = await api.get<FeatureResponse[]>(`${END_POINT}${queryString}`, { requireAuth: true });
    return (response as any)?.data ?? [];
  } catch (e) {
    return [];
  }
};

export const useFeatures = (facilityId: number, queryParams?: Record<string, any>) => {
  const allParams = { facilityId: facilityId.toString(), ...queryParams };
  const queryString = '?' + new URLSearchParams(allParams).toString();
  return useGet<FeatureResponse[]>(`${END_POINT}${queryString}`, { requireAuth: true });
};

export const useCreateFeature = () => {
  return usePost<FeatureCreateRequest>(END_POINT, { requireAuth: true });
};

export const createFeature = async (data: FeatureCreateRequest): Promise<FeatureResponse> => {
  const response = await api.post(END_POINT, data, { requireAuth: true });
  
  if (response.status !== 201) {
    throw new Error(`Unexpected response status: ${response.status}`);
  }
  
  return await response.json();
};

export const deleteFeature = async (featureId: string): Promise<void> => {
  await api.delete(`${END_POINT}/${featureId}`, { requireAuth: true });
};

export const updateFeatureTransform = async (featureId: string, data: FeatureUpdateRequest): Promise<void> => {
  await api.patch(`${END_POINT}/${featureId}/transform`, data, { requireAuth: true });
};

export const assignDeviceToFeature = async (featureId: string, data: FeatureAssignDto, force?: boolean): Promise<void> => {
  const url = force ? `${END_POINT}/${featureId}/assign?force=true` : `${END_POINT}/${featureId}/assign`;
  await api.patch(url, data, { requireAuth: true });
};

export const removeDeviceFromFeature = async (featureId: string): Promise<void> => {
  await api.delete(`${END_POINT}/${featureId}/revoke`, { requireAuth: true });
};

export const useFeaturesSWR = (facilityId: number, queryParams?: Record<string, any>) => {
  const allParams = { facilityId: facilityId.toString(), ...queryParams };
  const queryString = '?' + new URLSearchParams(allParams).toString();
  return useSWRApi<FeatureResponse[]>(`${END_POINT}${queryString}`, 'GET', { requireAuth: true });
};

export const useFeaturesByFacilitySWR = (facilityId: number) => {
  const queryString = `?facilityId=${facilityId}`;
  return useSWRApi<FeatureResponse[]>(`${END_POINT}${queryString}`, 'GET', { requireAuth: true });
};

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
