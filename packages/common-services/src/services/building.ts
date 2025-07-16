import { useGet, usePost, useDelete, useSWRApi, usePatch } from "@plug/api-hooks";
import type { BaseResponseBody } from '@plug/api-hooks';
import type { BuildingResponse, BuildingCreateRequest, FacilityUpdateRequest } from '@plug/common-services';
import { FacilityHistoryResponse } from "../types";

const BUILDINGS_API = `buildings`;

export const useBuildings = () => {
  return useGet<BuildingResponse[]>(BUILDINGS_API, { requireAuth: true });
};

export const useBuildingDetail = (buildingId: number) => {
  return useGet<BuildingResponse>(`${BUILDINGS_API}/${buildingId}`, { requireAuth: true } );
};

export const useCreateBuilding = () => {
  return usePost<BaseResponseBody, BuildingCreateRequest>(BUILDINGS_API, { requireAuth: true });
};

export const useUpdateBuilding = (buildingId: number) => {
  return usePatch<BaseResponseBody, FacilityUpdateRequest>(`${BUILDINGS_API}/${buildingId}`, { requireAuth: true });
};

export const useDeleteBuilding = (buildingId: number) => {
  return useDelete(`${BUILDINGS_API}/${buildingId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useBuildingsSWR = () => {
  return useSWRApi<BuildingResponse[]>(BUILDINGS_API, 'GET', { requireAuth: true });
};

export const useBuildingDetailSWR = (buildingId: number) => {
  return useSWRApi<BuildingResponse>(`${BUILDINGS_API}/${buildingId}`, 'GET', { requireAuth: true });
};

export const useBuildingHistory = (buildingId: number) => {
  return useSWRApi<FacilityHistoryResponse[]>(`${BUILDINGS_API}/${buildingId}/history`, 'GET', { requireAuth: true });
};