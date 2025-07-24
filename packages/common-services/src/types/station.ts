import { FacilityResponse, FacilityUpdateRequest, FacilityWithFloors } from "./facility";
import { Floors } from "./floors";

export interface StationResponse extends FacilityResponse {
  floors: Floors[];
  lineIds: number[];
  stationCodes: string[];
}

export interface StationFacility extends FacilityWithFloors {
  lineIds: number[];
  stationCodes: string[];
}


export interface StationUpdateRequest extends FacilityUpdateRequest{
  lineIds: number[];
  stationCodes: string[];
}