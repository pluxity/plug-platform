import { createFacilityService } from './facilityService';
import { StationResponse, StationFacility, StationUpdateRequest } from '../../types';
import { useGet, useSWRApi } from "@plug/api-hooks";

const stationService = createFacilityService<
  StationResponse,
  StationFacility,
  StationUpdateRequest
>('stations');

export const useStations = stationService.useList;
export const useStationDetail = stationService.useDetail;
export const useCreateStation = stationService.useCreate;
export const useUpdateStation = stationService.useUpdate;
export const useDeleteStation = stationService.useDelete;
export const useStationsSWR = stationService.useListSWR;
export const useStationDetailSWR = stationService.useDetailSWR;
export const useStationHistorySWR = stationService.useHistorySWR;

export const useStationFeatures = (stationsId: number) => {
  return useGet<StationResponse>(`stations/${stationsId}/features`, { requireAuth: true });
};

export const useStationFeaturesSWR = (stationsId: number) => {
  return useSWRApi<StationResponse>(`stations/${stationsId}/features`, 'GET', { requireAuth: true });
};

export { stationService };