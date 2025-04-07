import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import type { BuildingResponse, CreateBuildingRequest, UpdateBuildingRequest } from '@plug/common-services';

const BUILDINGS_API = `/buildings`;

export const useBuildings = () => {
  return useGet<BuildingResponse[]>(BUILDINGS_API);
};

export const useBuildingDetail = (buildingId: number) => {
  return useGet<BuildingResponse>(`${BUILDINGS_API}/${buildingId}`);
};

export const useCreateBuilding = () => {
  return usePost<CreatedResponseBody, CreateBuildingRequest>(BUILDINGS_API);
};

export const useUpdateBuilding = (buildingId: number) => {
  return usePut<BaseResponseBody, UpdateBuildingRequest>(`${BUILDINGS_API}/${buildingId}`);
};

export const useDeleteBuilding = (buildingId: number) => {
  return useDelete(`${BUILDINGS_API}/${buildingId}`);
};

// SWR 기반 훅
export const useBuildingsSWR = () => {
  return useSWRApi<BuildingResponse[]>(BUILDINGS_API);
};

export const useBuildingDetailSWR = (buildingId: number) => {
  return useSWRApi<BuildingResponse>(`${BUILDINGS_API}/${buildingId}`);
};