import { createFacilityService } from './facilityService';
import { BuildingResponse, FacilityWithFloorsCreateRequest, BaseFacilityUpdateRequest } from '../../types';

const buildingService = createFacilityService<
  BuildingResponse,
  FacilityWithFloorsCreateRequest,
  BaseFacilityUpdateRequest
>('buildings');

export const useBuildings = buildingService.useList;
export const useBuildingDetail = buildingService.useDetail;
export const useCreateBuilding = buildingService.useCreate;
export const useUpdateBuilding = buildingService.useUpdate;
export const useDeleteBuilding = buildingService.useDelete;
export const useBuildingsSWR = buildingService.useListSWR;
export const useBuildingDetailSWR = buildingService.useDetailSWR;
export const useBuildingHistory = buildingService.useHistorySWR;

export { buildingService };