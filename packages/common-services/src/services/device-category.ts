import { useGet, usePost, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type {
  DeviceCategoryResponse,
  DeviceCategoryRequest,
  DeviceCategoryAllResponse,
} from '../types/device';

const DEVICE_CATEGORY_END_POINT = `device-categories`;

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
