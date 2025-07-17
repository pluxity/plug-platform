import { useGet, usePost, useSWRApi } from "@plug/api-hooks";
import { FacilityHistoryResponse, StationCreateRequest, StationResponse, StationUpdateRequest } from "../types";

const STATIONS_API = `stations`;

export const useStations = () => {
  return useGet<StationResponse[]>(STATIONS_API, { requireAuth: true });
};

export const useStationDetail = (stationsId: number) => {
  return useGet<StationResponse>(`${STATIONS_API}/${stationsId}`, { requireAuth: true });
};

export const useCreateStation = () => {
  return usePost<StationCreateRequest>(STATIONS_API, { requireAuth: true });
}

export const useUpdateStation = (stationsId: number) => {
  return usePost<StationUpdateRequest>(`${STATIONS_API}/${stationsId}`, { requireAuth: true });
}

export const useDeleteStation = (stationsId: number) => {
  return usePost(`${STATIONS_API}/${stationsId}`, { requireAuth: true });
}

export const useStationHistory = (stationsId: number) => {
  return useGet<StationResponse>(`${STATIONS_API}/${stationsId}/history`, { requireAuth: true });
}

export const useStationFeatures = (stationsId: number) => {
  return useGet<StationResponse>(`${STATIONS_API}/${stationsId}/features`, { requireAuth: true });
}

export const useCreateStationLines = (stationsId: number, lineId: number) => {
  return usePost<StationResponse>(`${STATIONS_API}/${stationsId}/lines/${lineId}`, { requireAuth: true });
}

export const useDeleteStationLines = (stationsId: number, lineId: number) => {
  return usePost(`${STATIONS_API}/${stationsId}/lines/${lineId}`, { requireAuth: true });
}

// swr 기반 훅
export const useStationsSWR = () => {
  return useSWRApi<StationResponse[]>(STATIONS_API, 'GET', { requireAuth: true });
};

export const useStationDetailSWR = (stationsId: number) => {
  return useSWRApi<StationResponse>(`${STATIONS_API}/${stationsId}`, 'GET', { requireAuth: true });
};

export const useStationHistorySWR = (stationsId: number) => {
  return useSWRApi<FacilityHistoryResponse[]>(`${STATIONS_API}/${stationsId}/history`, 'GET', { requireAuth: true });
};

export const useStationFeaturesSWR = (stationsId: number) => {
  return useSWRApi<StationResponse>(`${STATIONS_API}/${stationsId}/features`, 'GET', { requireAuth: true });
};