import { useGet, usePost, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { 
  FeatureResponse, 
  FeatureCreateRequest, 
  FeatureUpdateRequest,
  FeatureAssignDto
} from '../types/feature';

const END_POINT = `features`;

export const useFeatures = (queryParams?: Record<string, any>) => {
  const queryString = queryParams ? '?' + new URLSearchParams(queryParams).toString() : '';
  return useGet<FeatureResponse[]>(`${END_POINT}${queryString}`, { requireAuth: true });
};

export const useFeatureDetail = (featureId: string) => {
  return useGet<FeatureResponse>(`${END_POINT}/${featureId}`, { requireAuth: true });
};

export const useCreateFeature = () => {
  return usePost<FeatureCreateRequest>(END_POINT, { requireAuth: true });
};

export const createFeature = async (data: FeatureCreateRequest): Promise<FeatureResponse> => {
  const response = await api.post(END_POINT, data, { requireAuth: true });
  
  if (response.status === 201) {
    const result = await response.json() as any;
    return result.data || result;
  }
  
  throw new Error(`Unexpected response status: ${response.status}`);
};

export const deleteFeature = async (featureId: string) => {
  return api.delete(`${END_POINT}/${featureId}`, { requireAuth: true });
};

export const updateFeature = async (featureId: string, data: FeatureUpdateRequest): Promise<void> => {
  return api.patch(`${END_POINT}/${featureId}/transform`, data, { requireAuth: true });
};

export const assignDeviceToFeature = async (featureId: string, data: FeatureAssignDto): Promise<void> => {
  return api.patch(`${END_POINT}/${featureId}/assign-device`, data, { requireAuth: true });
};

export const removeDeviceFromFeature = async (featureId: string): Promise<void> => {
  return api.delete(`${END_POINT}/${featureId}/revoke-device`, { requireAuth: true });
};

export const useFeaturesSWR = (queryParams?: Record<string, any>) => {
  const queryString = queryParams ? '?' + new URLSearchParams(queryParams).toString() : '';
  return useSWRApi<FeatureResponse[]>(`${END_POINT}${queryString}`, 'GET', { requireAuth: true });
};

export const useFeatureDetailSWR = (featureId: string) => {
  return useSWRApi<FeatureResponse>(`${END_POINT}/${featureId}`, 'GET', { requireAuth: true });
};

export const useFeaturesByFacilitySWR = (facilityId: number) => {
  return useSWRApi<FeatureResponse[]>(`${END_POINT}?facilityId=${facilityId}`, 'GET', { requireAuth: true });
};
