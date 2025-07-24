import { createFacilityService } from './baseFacilityService';
import { BuildingResponse, FacilityWithFloors, FacilityUpdateRequest } from '../../types';

export const buildingService = createFacilityService<
  BuildingResponse,
  FacilityWithFloors,
  FacilityUpdateRequest
>('buildings');

export const {
  useList: useBuildings,
  useDetail: useBuildingDetail,
  useCreate: useCreateBuilding,
  useUpdate: useUpdateBuilding,
  useDelete: useDeleteBuilding,
  useListSWR: useBuildingsSWR,
  useDetailSWR: useBuildingDetailSWR,
  useHistorySWR: useBuildingHistory
} = buildingService;