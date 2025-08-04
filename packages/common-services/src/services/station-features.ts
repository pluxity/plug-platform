import { useGet, useSWRApi } from '@plug/api-hooks';
import type { StationResponseWithFeature } from '../types/station';

const STATION_END_POINT = `stations`;

// 스테이션의 피처 목록 조회
export const useStationFeatures = (stationId: number) => {
  return useGet<StationResponseWithFeature>(`${STATION_END_POINT}/${stationId}/features`, { requireAuth: true });
};

// SWR 기반 훅
export const useStationFeaturesSWR = (stationId: number) => {
  return useSWRApi<StationResponseWithFeature>(`${STATION_END_POINT}/${stationId}/features`, 'GET', { requireAuth: true });
};
