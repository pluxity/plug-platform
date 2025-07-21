import { FacilityCreateRequest, FacilityResponse, FacilityUpdateRequest } from "./facility";
import { Floors } from "./floors";

export interface StationResponse extends FacilityResponse {
  floors: Floors[];
  lineIds: number[];
  featureIds: string[];
  route: string;
  subway: string;
}

export interface StationCreateRequest {
  facility: FacilityCreateRequest;
  floors: Floors[];
  lineIds: number[];
}

export interface StationUpdateRequest extends FacilityUpdateRequest{
  floors: Floors[];
  lineIds: number[];
}