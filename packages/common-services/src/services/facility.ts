import { api } from '@plug/api-hooks';
import { DataResponseBody } from '@plug/api-hooks';
import {
  FacilityResponse,
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

export const facilityService = {
  getAllFacilities: async (): Promise<DataResponseBody<FacilityResponse[]>> => {
    return api.get<FacilityResponse[]>('/facilities');
  },

  getFacilityHistory: async (facilityId: number): Promise<DataResponseBody<FacilityHistoryResponse[]>> => {
    return api.get<FacilityHistoryResponse[]>(`/facilities/${facilityId}/history`);
  },

  updateFacilityLocation: async (facilityId: number, data: FacilityLocationUpdateRequest): Promise<void> => {
    return api.put(`/facilities/${facilityId}/location`, data);
  },

  addFacilityPath: async (facilityId: number, data: FacilityPathSaveRequest): Promise<void> => {
    await api.post(`/facilities/${facilityId}/path`, data);
  },

  updateFacilityPath: async (facilityId: number, pathId: number, data: FacilityPathUpdateRequest): Promise<void> => {
    return api.patch(`/facilities/${facilityId}/path/${pathId}`, data);
  },

  deleteFacilityPath: async (facilityId: number, pathId: number): Promise<void> => {
    return api.delete(`/facilities/${facilityId}/path/${pathId}`);
  },

  updateFacilityFloors: async (facilityId: number, data: FacilityFloorUpdateRequest): Promise<void> => {
    return api.patch(`/facilities/${facilityId}/floors`, data);
  },

  updateFacilityDrawing: async (facilityId: number, data: FacilityDrawingUpdateRequest): Promise<void> => {
    return api.patch(`/facilities/${facilityId}/drawing`, data);
  },
};
