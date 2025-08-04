import { FeatureResponse } from './feature';
import { Label3DResponse } from './label3d';

export interface AdjacentStationInfo {
  code: string;
  name: string;
}

export interface StationResponseWithFeature {
  facility: any; // FacilityResponse
  floors: any[]; // FloorResponse[]
  lineIds: number[];
  features: FeatureResponse[];
  label3Ds: Label3DResponse[];
  stationCodes: string[];
  precedingStation?: AdjacentStationInfo;
  followingStation?: AdjacentStationInfo;
}
