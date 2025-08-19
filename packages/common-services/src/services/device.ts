import { useGet, usePost, usePatch, useDelete, useSWRApi } from '@plug/api-hooks';
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

export const getDevices = async (): Promise<GsDeviceResponse[]> => {
  try {
    const resp = await api.get<GsDeviceResponse[]>(DEVICE_END_POINT, { requireAuth: true });
    return (resp as any)?.data ?? [];
  } catch (_) {
    return [];
  }
};

export const useDevices = () => {
  return useGet<GsDeviceResponse[]>(DEVICE_END_POINT, { requireAuth: true });
};

export const useDeviceDetail = (deviceId: string) => {
  return useGet<GsDeviceResponse>(`${DEVICE_END_POINT}/${deviceId}`, { requireAuth: true });
};

export const useCreateDevice = () => {
  return usePost<GsDeviceCreateRequest>(DEVICE_END_POINT, { requireAuth: true });
};

export const useUpdateDevice = (deviceId: string) => {
  return usePatch<GsDeviceUpdateRequest>(`${DEVICE_END_POINT}/${deviceId}`, { requireAuth: true });
};

export const deleteDevice = async (deviceId: string) => {
  return api.delete(`${DEVICE_END_POINT}/${deviceId}`, { requireAuth: true });
};

export const useAssignDeviceCategory = (deviceId: string, categoryId: number) => {
  return usePatch<null>(`${DEVICE_END_POINT}/${deviceId}/category/${categoryId}`, { requireAuth: true });
};

export const useRemoveDeviceCategory = (deviceId: string) => {
  return useDelete(`${DEVICE_END_POINT}/${deviceId}/category`, { requireAuth: true });
};

export const useDeviceCategories = () => {
  return useGet<DeviceCategoryAllResponse>(DEVICE_CATEGORY_END_POINT, { requireAuth: true });
};

export const useDeviceCategoryDetail = (categoryId: number) => {
  return useGet<DeviceCategoryResponse>(`${DEVICE_CATEGORY_END_POINT}/${categoryId}`, { requireAuth: true });
};

export const useCreateDeviceCategory = () => {
  return usePost<DeviceCategoryRequest>(DEVICE_CATEGORY_END_POINT, { requireAuth: true });
};

export const updateDeviceCategory = async (categoryId: number, data: DeviceCategoryRequest) => {  
  return api.put(`${DEVICE_CATEGORY_END_POINT}/${categoryId}`, data, { requireAuth: true });
};

export const deleteDeviceCategory = async (categoryId: number) => {
  return api.delete(`${DEVICE_CATEGORY_END_POINT}/${categoryId}`, { requireAuth: true });
};

export const useChildDeviceCategories = (categoryId: number) => {
  return useGet<DeviceCategoryResponse[]>(`${DEVICE_CATEGORY_END_POINT}/${categoryId}/children`, { requireAuth: true });
};

export const useDevicesSWR = () => {
  return useSWRApi<GsDeviceResponse[]>(DEVICE_END_POINT, 'GET', { requireAuth: true });
};

export const useDeviceDetailSWR = (deviceId: string) => {
  return useSWRApi<GsDeviceResponse>(`${DEVICE_END_POINT}/${deviceId}`, 'GET', { requireAuth: true });
};

export const useDeviceCategoriesSWR = () => {
  return useSWRApi<DeviceCategoryAllResponse>(DEVICE_CATEGORY_END_POINT, 'GET', { requireAuth: true });
};

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
