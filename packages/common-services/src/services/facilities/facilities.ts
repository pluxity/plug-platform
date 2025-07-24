import { createFacilityService } from "./facilityService";
import {
  BaseFacilityUpdateRequest,
  BuildingResponse,
  FacilityWithFloorsCreateRequest, StationFacility,
  StationResponse, StationUpdateRequest
} from "../../types";

export const facilityServices = {
  building: createFacilityService<
    BuildingResponse,
    FacilityWithFloorsCreateRequest,
    BaseFacilityUpdateRequest
  >('buildings'),

  station: createFacilityService<
    StationResponse,
    StationFacility,
    StationUpdateRequest
  >('stations')

  // TODO: 새로운 시설은 여기에 추가하기만 하면 됨
};

export type FacilityType = keyof typeof facilityServices;