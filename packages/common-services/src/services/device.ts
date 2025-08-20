import { useGet, usePost, usePatch, useDelete, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type {
  GsDeviceResponse,
  GsDeviceCreateRequest,
  GsDeviceUpdateRequest
} from '../types/device';

const DEVICE_END_POINT = `devices`;

export const getDevices = async (): Promise<GsDeviceResponse[]> => {
    const response = await api.get<GsDeviceResponse[]>(DEVICE_END_POINT, { requireAuth: true });
    return response.data;
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

export const useDevicesSWR = () => {
  return useSWRApi<GsDeviceResponse[]>(DEVICE_END_POINT, 'GET', { requireAuth: true });
};

export const useDeviceDetailSWR = (deviceId: string) => {
  return useSWRApi<GsDeviceResponse>(`${DEVICE_END_POINT}/${deviceId}`, 'GET', { requireAuth: true });
};
