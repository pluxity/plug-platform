import { FileResponse } from "@plug/common-services";

export interface PathInfo {
  id: number;
  name: string;
  type: string;
  path: string;
}

export interface Facility {
  id: number;
  name: string;
  code: string;
  description?: string;
  drawing: FileResponse;
  thumbnail: FileResponse;
  paths?: PathInfo[];
  lon: number;
  lat: number;
  locationMeta: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FacilityResponse {
  [key: string]: Facility[]
}
