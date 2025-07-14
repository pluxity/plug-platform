import { FacilityCreateRequest, FacilityResponse } from "./facility";
import { Floors } from "./floors";
  
export interface BuildingResponse {
  facility: FacilityResponse;
  floors: Floors[];
}

export interface BuildingCreateRequest {
  facility: FacilityCreateRequest;
  floors: Floors[];
}