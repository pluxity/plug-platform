import { useGet, usePost, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type {
  DeviceCategoryResponse,
  DeviceCategoryRequest,
} from '../types/device-category';
import type { DeviceCategoryDepthResponse } from '../types/device-category';
import type { GsDeviceResponse } from '../types/device';

const DEVICE_CATEGORY_END_POINT = `device-categories`;
const DEVICE_CATEGORY_DEPTH_END_POINT = `${DEVICE_CATEGORY_END_POINT}/max-depth`;

export const useDeviceCategories = () => {
  return useGet<DeviceCategoryResponse[]>(DEVICE_CATEGORY_END_POINT, { requireAuth: true });
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
  return useSWRApi<DeviceCategoryResponse[]>(DEVICE_CATEGORY_END_POINT, 'GET', { requireAuth: true });
};

export const useDeviceCategoryMaxDepthSWR = () => {
  return useSWRApi<DeviceCategoryDepthResponse>(DEVICE_CATEGORY_DEPTH_END_POINT, 'GET', { requireAuth: true });
};

export const useDeviceCategoryTree = () => {
  const { data: list, error: listError, isLoading: listLoading, mutate: mutateList } = useDeviceCategoriesSWR();
  const { data: depthData, error: depthError, isLoading: depthLoading, mutate: mutateDepth } = useDeviceCategoryMaxDepthSWR();
  const error = listError || depthError;
  const isLoading = listLoading || depthLoading;
  return {
    categories: list ?? [],
    maxDepth: depthData?.maxDepth ?? 0,
    error,
    isLoading,
    mutate: async () => { await Promise.all([mutateList(), mutateDepth()]); },
    refresh: async () => { await Promise.all([mutateList(), mutateDepth()]); },
  };
};

export const getDevicesByCategory = async (
  categoryId: number,
  facilityId: number
): Promise<GsDeviceResponse[]> => {
  const qs = `?facilityId=${facilityId}`;
  try {
    const resp = await api.get<GsDeviceResponse[]>(`${DEVICE_CATEGORY_END_POINT}/${categoryId}/devices${qs}`, { requireAuth: true });
    return (resp as any)?.data ?? (resp as any) ?? [];
  } catch (_) {
    return [];
  }
};

export const getAllDeviceCategories = async (): Promise<DeviceCategoryResponse[]> => {
  const resp = await api.get<DeviceCategoryResponse[]>(DEVICE_CATEGORY_END_POINT, { requireAuth: true });
  return ((resp as any)?.data ?? (resp as any)) as DeviceCategoryResponse[];
};

export const getDeviceCategoryMaxDepth = async (): Promise<number> => {
  const resp = await api.get<DeviceCategoryDepthResponse>(DEVICE_CATEGORY_DEPTH_END_POINT, { requireAuth: true });
  const data = (resp as any)?.data ?? (resp as any);
  return (data?.maxDepth ?? 0) as number;
};
