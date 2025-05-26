import { useGet, useSWRApi } from '@plug/api-hooks';
import type { Station, StationData } from '@plug/common-services/types';

const STATION_API = `stations`;

// 역할 목록 조회
export const useStations = () => {
  return useGet<Station[]>(STATION_API, { requireAuth: true });
};

// 역할 상세 조회
export const useStationDetail = (id: number) => {
  return useGet<StationData>(`${STATION_API}/${id}`, { requireAuth: true });
};

// export const useCreateStation = () => {
//   return usePost<CreatedResponseBody, StationCreateRequest>(STATION_API, { requireAuth: true });
// };

// export const useUpdateStation = (roleId: number) => {
//   return usePut<BaseResponseBody, StationUpdateRequest>(`${STATION_API}/${roleId}`, { requireAuth: true });
// };

// export const useDeleteStation = (roleId: number) => {
//   return useDelete(`${STATION_API}/${roleId}`, { requireAuth: true });
// };

// SWR 기반 역할 목록 조회
export const useStationsSWR = () => {
  return useSWRApi<Station[]>(STATION_API, 'GET', { requireAuth: true });
};

// SWR 기반 역할 상세 조회
export const useStationDetailSWR = (id: number) => {
  return useSWRApi<StationData>(`${STATION_API}/${id}`, 'GET', { requireAuth: true });
};