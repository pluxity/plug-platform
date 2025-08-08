import { FileResponse } from "./file";

// === FACILITY CORE TYPES ===
export interface FacilityResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  drawing: FileResponse;
  thumbnail: FileResponse;
  paths: FacilityPathResponse[];
  lon: number;
  lat: number;
  locationMeta: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface FacilityCreateRequest {
  name: string;
  code: string;
  description?: string;
  thumbnailFileId?: number;
  lon?: number;
  lat?: number;
  locationMeta?: string;
}

export interface FacilityUpdateRequest {
  name: string;
  code: string;
  description: string;
  thumbnailFileId?: number;
  lon: number;
  lat: number;
  locationMeta: string;
}

export interface FacilityPathResponse {
  id: number;
  name: string;
  type: string;
  path: string;
}

export interface FacilityLocationUpdateRequest {
  lon: number;
  lat: number;
  locationMeta: string;
}

export interface FacilityPathSaveRequest {
  name: string;
  type: 'SUBWAY' | 'WAY' | 'PATROL';
  path: string;
}

export interface FacilityPathUpdateRequest {
  name?: string;
  type?: string;
  path?: string;
}

export interface FacilityFloorUpdateRequest {
  floors: FloorRequest[];
}

export interface FacilityDrawingUpdateRequest {
  drawingFileId: number;
  comment?: string;
}

export interface FacilityHistoryResponse {
  id: number;
  comment: string;
  createdAt: string;
  createdBy: string;
  file: FileResponse;
}

// === COMPONENT TYPES ===
export interface FloorRequest {
  name: string;
  floorId: string;
}

export interface FloorResponse {
  name: string;
  floorId: string;
}

export interface StationInfoResponse {
  lineIds: number[];
  stationCodes: string[];
}

export interface StationInfoRequest {
  lineIds: number[];
  stationCodes: string[];
}

export interface StationInfoCreateRequest {
  lineIds?: number[];
  stationCodes?: string[];
}

export interface AdjacentStationInfo {
  code: string;
  name: string;
}
