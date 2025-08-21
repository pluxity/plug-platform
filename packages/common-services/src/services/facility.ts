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
import { 
  FacilityService,
  domainServices
} from './facility-generic';

export { 
  FacilityService,
  domainServices
};

const END_POINT = 'facilities';

export const useFacilities = () => {
  return useGet<FacilityResponse[]>(END_POINT, { requireAuth: true });
};

export const useFacilityDetail = (facilityId: number) => {
  return useGet<FacilityResponse>(`${END_POINT}/${facilityId}`, { requireAuth: true });
};

export const useCreateFacility = () => {
  return usePost<FacilityCreateRequest>(END_POINT, { requireAuth: true });
};

export const updateFacility = async (facilityId: number, data: FacilityUpdateRequest) => {
  return api.put(`${END_POINT}/${facilityId}`, data, { requireAuth: true });
};

export const deleteFacility = async (facilityId: number) => {
  return api.delete(`${END_POINT}/${facilityId}`, { requireAuth: true });
};

export const useFacilitiesSWR = () => {
  return useSWRApi<FacilityResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useFacilityDetailSWR = (facilityId: number) => {
  return useSWRApi<FacilityResponse>(`${END_POINT}/${facilityId}`, 'GET', { requireAuth: true });
};

export const useFacilityDetailSWRConditional = (facilityId?: number) => {
  const url = facilityId ? `${END_POINT}/${facilityId}` : '';
  return useSWRApi<FacilityResponse>(url, 'GET', { requireAuth: true }, {
    fallbackData: null,
    shouldRetryOnError: false,
    isPaused: () => !facilityId,
  });
};

export const facilityService = {
  getAllFacilities: async (): Promise<DataResponseBody<FacilityResponse[]>> => {
    return api.get<FacilityResponse[]>('facilities');
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
