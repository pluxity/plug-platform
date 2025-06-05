import { api } from '@plug/api-hooks';
import { useGet, usePost, usePatch, useSWRApi, usePut } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import { DeviceResponse, DeviceCreateRequest, DeviceUpdateRequest } from '@plug/common-services';

const DEVICE_API = `devices`;

// 장비 목록 조회 
export const useDevices = () => {
    return useGet<DeviceResponse[]>(DEVICE_API, { requireAuth: true })
}

// 장비 상세 조회
export const useDeviceDetail = (deviceId: number) => {
    return useGet<DeviceResponse>(`${DEVICE_API}/${deviceId}`, { requireAuth: true });
}

// 장비 삭제 
export const deleteDevice = async (deviceId: number) => {
    return await api.delete(`${DEVICE_API}/${deviceId}`, { requireAuth: true });
}

// 장비 생성
export const useCreateDevice = () => {
    return usePost<CreatedResponseBody, DeviceCreateRequest>(DEVICE_API, { requireAuth: true });
}

// 장비 수정
export const useUpdateDevice = (deviceId: number) => {
    return usePatch<BaseResponseBody, DeviceUpdateRequest>(`${DEVICE_API}/${deviceId}`, { requireAuth: true });
}

// 장비 SWR 기반 목록 조회 
export const useDevicesSWR = () => {
    return useSWRApi<DeviceResponse[]>(DEVICE_API, 'GET', { requireAuth: true });
}

// 장비 SWR 기반 상세 조회 
export const useDeviceDetailSWR = (deviceId: number) => {
    const key = deviceId ? `${DEVICE_API}/${deviceId}` : '';
    return useSWRApi<DeviceResponse>(key, 'GET', { requireAuth: true });
}

// 장비에 피처 할당
export const useAssignDeviceFeature = (deviceId: number, featureId: number) => {
    return usePut<DeviceResponse>(`${DEVICE_API}/${deviceId}/feature/${featureId}`, { requireAuth: true });
};

// 장비에 분류 할당
export const useAssignDeviceCategory = (deviceId: number, categoryId: number) => {
    return usePut<DeviceResponse>(`${DEVICE_API}/${deviceId}/categories/${categoryId}`, { requireAuth: true });
};
