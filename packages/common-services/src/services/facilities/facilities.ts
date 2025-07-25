import { useGet, usePost, useDelete, useSWRApi, usePut } from "@plug/api-hooks";
import {
  BaseFacilityUpdateRequest,
  BuildingResponse,
  FacilityHistoryResponse,
  FacilityWithFloorsCreateRequest,
  StationFacility,
  StationResponse,
  StationUpdateRequest
} from "../../types";

function createFacilityService<
  TResponse,
  TCreateRequest,
  TUpdateRequest
>(endPoint: string) {
  return {
    useList: () =>
      useGet<TResponse[]>(endPoint, { requireAuth: true }),

    useDetail: (id: number) =>
      useGet<TResponse>(`${endPoint}/${id}`, { requireAuth: true }),

    useCreate: () =>
      usePost<TCreateRequest>(endPoint, { requireAuth: true }),

    useUpdate: (id: number) =>
      usePut<TUpdateRequest>(`${endPoint}/${id}`, { requireAuth: true }),

    useDelete: (id: number) =>
      useDelete(`${endPoint}/${id}`, { requireAuth: true }),

    useListSWR: () =>
      useSWRApi<TResponse[]>(endPoint, 'GET', { requireAuth: true }),

    useDetailSWR: (id: number) =>
      useSWRApi<TResponse>(`${endPoint}/${id}`, 'GET', { requireAuth: true }),

    useHistorySWR: (id: number) =>
      useSWRApi<FacilityHistoryResponse[]>(
        `${endPoint}/${id}/history`,
        'GET',
        { requireAuth: true }
      ),
  };
}

export const facilityServices = {
  buildings: createFacilityService<
    BuildingResponse,
    FacilityWithFloorsCreateRequest,
    BaseFacilityUpdateRequest
  >('buildings'),

  stations: createFacilityService<
    StationResponse,
    StationFacility,
    StationUpdateRequest
  >('stations')

  // TODO: 새로운 시설은 여기에 추가하기만 하면 됨
};

export type FacilityType = keyof typeof facilityServices;