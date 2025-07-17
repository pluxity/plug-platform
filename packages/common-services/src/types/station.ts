import { FacilityCreateRequest, FacilityResponse } from "./facility";
import { Floors } from "./floors";

export interface StationResponse {
  facility: FacilityResponse;
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