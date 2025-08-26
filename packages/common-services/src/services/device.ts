import { useGet, usePost, usePatch, useDelete, useSWRApi, usePut } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type {
  GsDeviceResponse,
  GsDeviceCreateRequest,
  GsDeviceUpdateRequest,
  GsDeviceCctvUpdateRequest,
  DeviceResponse
} from '../types/device';
const DEVICES_ROOT = 'devices';
const GS_DEVICES_ENDPOINT = `${DEVICES_ROOT}/gs-devices`;
const DEVICE_TYPES_ENDPOINT = `${DEVICES_ROOT}/types`;
export const getAllDevices = async (): Promise<DeviceResponse[]> => {
  const resp = await api.get<DeviceResponse[]>(DEVICES_ROOT, { requireAuth: true });
  return (resp as any)?.data ?? (resp as any);
};

export const getDevices = getAllDevices;

export const useAllDevices = () => useGet<DeviceResponse[]>(DEVICES_ROOT, { requireAuth: true });

export const useAllDevicesSWR = () => useSWRApi<DeviceResponse[]>(DEVICES_ROOT, 'GET', { requireAuth: true });
export const getGsDevices = async (): Promise<GsDeviceResponse[]> => {
  const resp = await api.get<GsDeviceResponse[]>(GS_DEVICES_ENDPOINT, { requireAuth: true });
  return (resp as any)?.data ?? (resp as any);
};

export const useGsDevices = () => {
  return useGet<GsDeviceResponse[]>(GS_DEVICES_ENDPOINT, { requireAuth: true });
};

export const useGsDevicesSWR = () => {
  return useSWRApi<GsDeviceResponse[]>(GS_DEVICES_ENDPOINT, 'GET', { requireAuth: true });
};

export const useGsDeviceDetail = (deviceId: string | undefined) => {
  const url = deviceId ? `${GS_DEVICES_ENDPOINT}/${deviceId}` : '';
  return useSWRApi<GsDeviceResponse>(url, 'GET', { requireAuth: true }, { isPaused: () => !deviceId });
};

export const useCreateGsDevice = () => {
  return usePost<GsDeviceCreateRequest>(GS_DEVICES_ENDPOINT, { requireAuth: true });
};

export const useUpdateGsDevice = (deviceId: string) => {
  return usePut<GsDeviceUpdateRequest>(`${GS_DEVICES_ENDPOINT}/${deviceId}`, { requireAuth: true });
};
export const deleteGsDevice = async (deviceId: string) => {
  return api.delete(`${GS_DEVICES_ENDPOINT}/${deviceId}`, { requireAuth: true });
};
export const useAssignGsDeviceCategory = (deviceId: string, categoryId: number) => {
  return usePatch<null>(`${GS_DEVICES_ENDPOINT}/${deviceId}/category/${categoryId}`, { requireAuth: true });
};
export const useRemoveGsDeviceCategory = (deviceId: string) => {
  return useDelete(`${GS_DEVICES_ENDPOINT}/${deviceId}/category`, { requireAuth: true });
};
export const assignCctvsToGsDevice = async (deviceId: string, data: GsDeviceCctvUpdateRequest) => {
  return api.put(`${GS_DEVICES_ENDPOINT}/${deviceId}/cctvs`, data, { requireAuth: true });
};
export const getCctvsOfGsDevice = async (deviceId: string) => {
  const resp = await api.get<any>(`${GS_DEVICES_ENDPOINT}/${deviceId}/cctvs`, { requireAuth: true });
  return (resp as any)?.data ?? (resp as any);
};
export const getDeviceTypes = async (): Promise<string[]> => {
  const resp = await api.get<string[]>(DEVICE_TYPES_ENDPOINT, { requireAuth: true });
  return (resp as any)?.data ?? (resp as any);
};

export const useDeviceTypes = () => {
  return useGet<string[]>(DEVICE_TYPES_ENDPOINT, { requireAuth: true });
};

export const useDeviceTypesSWR = () => {
  return useSWRApi<string[]>(DEVICE_TYPES_ENDPOINT, 'GET', { requireAuth: true });
};
export const useDevices = useAllDevices;
export const useDeviceDetail = (deviceId: string) => useGet<GsDeviceResponse>(`${GS_DEVICES_ENDPOINT}/${deviceId}`, { requireAuth: true });
export const useCreateDevice = useCreateGsDevice;
export const useUpdateDevice = useUpdateGsDevice;
export const deleteDevice = deleteGsDevice;
export const useAssignDeviceCategory = useAssignGsDeviceCategory;
export const useRemoveDeviceCategory = useRemoveGsDeviceCategory;
export const useDevicesSWR = useAllDevicesSWR;
export const useDeviceDetailSWR = useGsDeviceDetail;