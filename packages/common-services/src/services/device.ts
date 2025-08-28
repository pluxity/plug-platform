import { useGet, usePost, useSWRApi, usePut, usePatch } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type {
  DeviceResponse,
  DeviceTypeResponse,
  DeviceCompanyTypeResponse,
  DeviceCreateRequest,
  DeviceUpdateRequest,
} from '../types/device';
const DEVICES_ROOT = 'devices';
const DEVICE_TYPES_ENDPOINT = `${DEVICES_ROOT}/types`;
const COMPANY_TYPES_ENDPOINT = `${DEVICES_ROOT}/company-types`;

export const getDevices = async (): Promise<DeviceResponse[]> => {
  const resp = await api.get<DeviceResponse[]>(DEVICES_ROOT, { requireAuth: true });
  return (resp as any)?.data ?? (resp as any) ?? [];
};

export const useDevices = () => {
  return useGet<DeviceResponse[]>(DEVICES_ROOT, { requireAuth: true });
};

export const useDeviceDetail = (deviceId: string) => {
  return useGet<DeviceResponse>(`${DEVICES_ROOT}/${deviceId}`, { requireAuth: true });
};

export const useCreateDevice = () => {
  return usePost<DeviceCreateRequest>(DEVICES_ROOT, { requireAuth: true });
};

export const useUpdateDevice = (deviceId: string) => {
  return usePut<DeviceUpdateRequest>(`${DEVICES_ROOT}/${deviceId}`, { requireAuth: true });
};

export const useAssignDeviceCategory = (deviceId: string, categoryId: number) => {
  return usePatch<null>(`${DEVICES_ROOT}/${deviceId}/category/${categoryId}`, { requireAuth: true });
};

export const deleteDevice = async (deviceId: string) => {
  return api.delete(`${DEVICES_ROOT}/${deviceId}`, { requireAuth: true });
};

export const useDeviceTypes = () => {
  return useGet<DeviceTypeResponse[]>(DEVICE_TYPES_ENDPOINT, { requireAuth: true });
};

export const useCompanyTypes = () => {
  return useGet<DeviceCompanyTypeResponse[]>(COMPANY_TYPES_ENDPOINT, { requireAuth: true });
};

export const useDevicesSWR = () => {
  return useSWRApi<DeviceResponse[]>(DEVICES_ROOT, 'GET', { requireAuth: true });
};

export const useDeviceCompanyTypesSWR = () => {
  return useSWRApi<DeviceCompanyTypeResponse[]>(COMPANY_TYPES_ENDPOINT, 'GET', { requireAuth: true });
};

export const useDeviceTypesSWR = () => {
  return useSWRApi<DeviceTypeResponse[]>(DEVICE_TYPES_ENDPOINT, 'GET', { requireAuth: true });
};

export const useDeviceDetailSWR = (deviceId: string) => {
  const url = deviceId ? `${DEVICES_ROOT}/${deviceId}` : '';
  return useSWRApi<DeviceResponse>(url, 'GET', { requireAuth: true }, {
    isPaused: () => !deviceId,
  });
};