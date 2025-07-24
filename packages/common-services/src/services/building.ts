import { useGet, usePost, useDelete, useSWRApi, usePut } from "@plug/api-hooks";
import type { BuildingResponse, FacilityWithFloors } from '@plug/common-services';
import { FacilityHistoryResponse, FacilityUpdateRequest } from "../types";

const END_POINT = 'buildings';

export const useBuildings = () => {
  return useGet<BuildingResponse[]>(END_POINT, { requireAuth: true });
};

export const useBuildingDetail = (buildingId: number) => {
  return useGet<BuildingResponse>(`${END_POINT}/${buildingId}`, { requireAuth: true });
};

export const useCreateBuilding = () => {
  return usePost<FacilityWithFloors>(END_POINT, { requireAuth: true });
};

export const useUpdateBuilding = (buildingId: number) => {
  return usePut<FacilityUpdateRequest>(`${END_POINT}/${buildingId}`, { requireAuth: true });
};

export const useDeleteBuilding = (buildingId: number) => {
  return useDelete(`${END_POINT}/${buildingId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useBuildingsSWR = () => {
  return useSWRApi<BuildingResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useBuildingDetailSWR = (buildingId: number) => {
  return useSWRApi<BuildingResponse>(`${END_POINT}/${buildingId}`, 'GET', { requireAuth: true });
};

export const useBuildingHistory = (buildingId: number) => {
  return useSWRApi<FacilityHistoryResponse[]>(`${END_POINT}/${buildingId}/history`, 'GET', { requireAuth: true });
};