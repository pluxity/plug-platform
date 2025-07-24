import { createFacilityService } from './baseFacilityService';
import { StationResponse, FacilityWithFloors, FacilityUpdateRequest } from '../../types';

export const stationService = createFacilityService<
  StationResponse,
  FacilityWithFloors,
  FacilityUpdateRequest
>('stations');

export const {
  useList: useStations,
  useDetail: useStationDetail,
  useCreate: useCreateStation,
  useUpdate: useUpdateStation,
  useDelete: useDeleteStation,
  useListSWR: useStationsSWR,
  useDetailSWR: useStationDetailSWR,
  useHistorySWR: useStationHistory
} = stationService;