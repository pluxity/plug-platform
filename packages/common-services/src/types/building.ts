import { FacilityResponse } from "./facility";
import { Floors } from "./floors";
  
export interface BuildingResponse extends FacilityResponse {
  floors: Floors[];
}