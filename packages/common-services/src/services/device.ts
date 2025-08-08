import { useGet, usePost, usePatch, useDelete, useSWRApi, usePut } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { 
  GsDeviceResponse, 
  GsDeviceCreateRequest, 
  GsDeviceUpdateRequest,
  DeviceCategoryResponse,
  DeviceCategoryRequest,
  DeviceCategoryAllResponse
} from '../types/device';

const DEVICE_END_POINT = `devices`;
const DEVICE_CATEGORY_END_POINT = `device-categories`;

// === Device 관련 ===

// 디바이스 목록 조회
export const useDevices = () => {
  return useGet<GsDeviceResponse[]>(DEVICE_END_POINT, { requireAuth: true });
};

// 디바이스 상세 조회
export const useDeviceDetail = (deviceId: string) => {
  return useGet<GsDeviceResponse>(`${DEVICE_END_POINT}/${deviceId}`, { requireAuth: true });
};

// 디바이스 생성
export const useCreateDevice = () => {
  return usePost<GsDeviceCreateRequest>(DEVICE_END_POINT, { requireAuth: true });
};

// 디바이스 수정
export const useUpdateDevice = (deviceId: string) => {
  return usePut<GsDeviceUpdateRequest>(`${DEVICE_END_POINT}/${deviceId}`, { requireAuth: true });
};

// 디바이스 삭제
export const deleteDevice = async (deviceId: string) => {
  return api.delete(`${DEVICE_END_POINT}/${deviceId}`, { requireAuth: true });
};

// 디바이스에 카테고리 할당
export const useAssignDeviceCategory = (deviceId: string, categoryId: number) => {
  return usePatch<null>(`${DEVICE_END_POINT}/${deviceId}/category/${categoryId}`, { requireAuth: true });
};

// 디바이스의 카테고리 제거
export const useRemoveDeviceCategory = (deviceId: string) => {
  return useDelete(`${DEVICE_END_POINT}/${deviceId}/category`, { requireAuth: true });
};

// SWR 기반 훅들
export const useDevicesSWR = () => {
  return useSWRApi<GsDeviceResponse[]>(DEVICE_END_POINT, 'GET', { requireAuth: true });
};

export const useDeviceDetailSWR = (deviceId: string | undefined) => {
  const url = deviceId ? `${DEVICE_END_POINT}/${deviceId}` : '';
  return useSWRApi<GsDeviceResponse>(url, 'GET', { requireAuth: true }, {
    isPaused: () => !deviceId, // deviceId가 없으면 요청 중단
  });
};

// === Device Category 관련 ===

// 디바이스 카테고리 목록 조회 (계층 구조)
export const useDeviceCategories = () => {
  return useGet<DeviceCategoryAllResponse>(DEVICE_CATEGORY_END_POINT, { requireAuth: true });
};

// 디바이스 카테고리 상세 조회
export const useDeviceCategoryDetail = (categoryId: number) => {
  return useGet<DeviceCategoryResponse>(`${DEVICE_CATEGORY_END_POINT}/${categoryId}`, { requireAuth: true });
};

// 디바이스 카테고리 생성
export const useCreateDeviceCategory = () => {
  return usePost<DeviceCategoryRequest>(DEVICE_CATEGORY_END_POINT, { requireAuth: true });
};

// 디바이스 카테고리 수정
export const updateDeviceCategory = async (categoryId: number, data: DeviceCategoryRequest) => {  
  return api.put(`${DEVICE_CATEGORY_END_POINT}/${categoryId}`, data, { requireAuth: true });
};

// 디바이스 카테고리 삭제
export const deleteDeviceCategory = async (categoryId: number) => {
  return api.delete(`${DEVICE_CATEGORY_END_POINT}/${categoryId}`, { requireAuth: true });
};

// 하위 디바이스 카테고리 목록 조회
export const useChildDeviceCategories = (categoryId: number) => {
  return useGet<DeviceCategoryResponse[]>(`${DEVICE_CATEGORY_END_POINT}/${categoryId}/children`, { requireAuth: true });
};

export const useDeviceCategoriesSWR = () => {
  return useSWRApi<DeviceCategoryAllResponse>(DEVICE_CATEGORY_END_POINT, 'GET', { requireAuth: true });
};

// 유틸리티 훅
export const useDeviceCategoryTree = () => {
  const { data, error, isLoading, mutate } = useDeviceCategoriesSWR();
  
  return {
    categories: data?.list || [],
    maxDepth: data?.maxDepth || 0,
    error,
    isLoading,
    mutate, 
    refresh: () => mutate(), 
  };
};
