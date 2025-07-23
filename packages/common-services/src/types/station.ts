import { FacilityCreateRequest, FacilityResponse, FacilityUpdateRequest } from "./facility";
import { Floors } from "./floors";

export interface StationResponse extends FacilityResponse {
  floors: Floors[];
  lineIds: number[];
  stationCodes: string[];
}

export interface StationCreateRequest {
  facility: FacilityCreateRequest;
  floors: Floors[];
  lineIds: number[];
  stationCodes: string[];
}

export interface StationUpdateRequest extends FacilityUpdateRequest{
  lineIds: number[];
  stationCodes: string[];
}