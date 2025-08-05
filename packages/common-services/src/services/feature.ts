import { useGet, usePost, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { RequestOptions } from '@plug/api-hooks';
import type { 
  FeatureResponse, 
  FeatureCreateRequest, 
  FeatureUpdateRequest,
  FeatureAssignDto
} from '../types/feature';

const END_POINT = `features`;

const extractFeatureIdFromLocation = (location: string | null): string | null => {
  if (!location) return null;
  
  const id = location.split('/').pop() || '';
  return id || null;
};

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

export const createFeature = async (data: FeatureCreateRequest): Promise<void> => {
  const response = await api.post(END_POINT, data, { requireAuth: true });
  
  if (response.status !== 201) {
    throw new Error(`Unexpected response status: ${response.status}`);
  }
};

export const createFeatureWithInfo = async (data: FeatureCreateRequest, options?: RequestOptions): Promise<FeatureResponse> => {
  try {
    const response = await api.post(END_POINT, data, { requireAuth: true, ...options });
    
    if (response.status === 201) {
      const location = response.headers.get('Location') || null;
      const extractedFeatureId = extractFeatureIdFromLocation(location);

      if (extractedFeatureId) {
        try {
          const featureInfoResult = await api.get<FeatureResponse>(`${END_POINT}/${extractedFeatureId}`, {
            requireAuth: true,
            ...options
          });

          return featureInfoResult.data;

        } catch (error) {
          throw new Error(`피처 정보 조회 중 오류 발생: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        throw new Error(`Location 헤더에서 유효한 피처 ID를 추출할 수 없습니다: ${location || 'null'}`);
      }
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`피처 생성 중 오류 발생: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
