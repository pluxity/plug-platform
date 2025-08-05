import { 
  useGet, 
  usePost, 
  useSWRApi
} from '@plug/api-hooks';
import { api } from '@plug/api-hooks';
import { DataResponseBody } from '@plug/api-hooks';
import {
  FacilityResponse,
  FacilityCreateRequest,
  FacilityUpdateRequest,
  FacilityHistoryResponse,
  FacilityLocationUpdateRequest,
  FacilityPathSaveRequest,
  FacilityPathUpdateRequest,
  FacilityFloorUpdateRequest,
  FacilityDrawingUpdateRequest
} from '../types/facility';
import { FacilityType } from '../constants/domain-config';
import { 
  FacilityService,
  domainServices
} from './facility-generic';

export { 
  FacilityService,
  domainServices
};

const END_POINT = 'facilities';

// 시설 목록 조회 (기본 API)
export const useFacilities = () => {
  return useGet<Record<FacilityType, FacilityResponse[]>>(END_POINT, { requireAuth: true });
};

// 시설 상세 조회
export const useFacilityDetail = (facilityId: number) => {
  return useGet<FacilityResponse>(`${END_POINT}/${facilityId}`, { requireAuth: true });
};

// 시설 생성
export const useCreateFacility = () => {
  return usePost<FacilityCreateRequest>(END_POINT, { requireAuth: true });
};

// 시설 수정 (일반적인 업데이트)
export const updateFacility = async (facilityId: number, data: FacilityUpdateRequest) => {
  return api.put(`${END_POINT}/${facilityId}`, data, { requireAuth: true });
};

// 시설 삭제
export const deleteFacility = async (facilityId: number) => {
  return api.delete(`${END_POINT}/${facilityId}`, { requireAuth: true });
};

// SWR 기반 훅들
export const useFacilitiesSWR = () => {
  return useSWRApi<Record<FacilityType, FacilityResponse[]>>(END_POINT, 'GET', { requireAuth: true });
};

export const useFacilityDetailSWR = (facilityId: number) => {
  return useSWRApi<FacilityResponse>(`${END_POINT}/${facilityId}`, 'GET', { requireAuth: true });
};

// 조건부 훅들
export const useFacilityDetailSWRConditional = (facilityId?: number) => {
  const url = facilityId ? `${END_POINT}/${facilityId}` : '';
  return useSWRApi<FacilityResponse>(url, 'GET', { requireAuth: true }, {
    fallbackData: null,
    shouldRetryOnError: false,
    isPaused: () => !facilityId,
  });
};

export const facilityService = {
  getAllFacilities: async (): Promise<DataResponseBody<Record<FacilityType, FacilityResponse[]>>> => {
    return api.get<Record<FacilityType, FacilityResponse[]>>('facilities');
  },

  getFacilityHistory: async (facilityId: number): Promise<DataResponseBody<FacilityHistoryResponse[]>> => {
    return api.get<FacilityHistoryResponse[]>(`facilities/${facilityId}/history`);
  },

  updateFacilityLocation: async (facilityId: number, data: FacilityLocationUpdateRequest): Promise<void> => {
    return api.put(`facilities/${facilityId}/location`, data);
  },

  addFacilityPath: async (facilityId: number, data: FacilityPathSaveRequest): Promise<void> => {
    await api.post(`facilities/${facilityId}/path`, data);
  },

  updateFacilityPath: async (facilityId: number, pathId: number, data: FacilityPathUpdateRequest): Promise<void> => {
    return api.patch(`facilities/${facilityId}/path/${pathId}`, data);
  },

  deleteFacilityPath: async (facilityId: number, pathId: number): Promise<void> => {
    return api.delete(`facilities/${facilityId}/path/${pathId}`);
  },

  updateFacilityFloors: async (facilityId: number, data: FacilityFloorUpdateRequest): Promise<void> => {
    return api.patch(`facilities/${facilityId}/floors`, data);
  },

  updateFacilityDrawing: async (facilityId: number, data: FacilityDrawingUpdateRequest): Promise<void> => {
    return api.patch(`facilities/${facilityId}/drawing`, data);
  },
};
