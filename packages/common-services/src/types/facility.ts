import { FileResponse } from "./file";
import { Floors } from "./floors";

export interface Facility {
  id: number;
  name: string;
  code: string;
  description: string;
  drawing: FileResponse;
  thumbnail: FileResponse;
  path: Path[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface FacilityBase {
  facility: {
    name: string;
    code: string;
    description: string;
    thumbnailFileId?: number;
    drawingFileId?: number;
  };
}

export interface FacilityWithFloors extends FacilityBase{
  floors: Floors[];
}

export interface Path {
  id: number;
  name: string;
  type: string;
  path: string;
}

export interface FacilityResponse {
  facility: Facility;
}

export interface FacilitiesAllResponse {
  buildings: Facility[];
  stations: Facility[];
}

export interface FacilityHistoryResponse {
  id: number;
  comment: string;
  createdAt: string;
  createdBy: string;
  file: FileResponse;
}

export interface FacilityCreateRequest {
  name: string;
  code: string;
  description?: string;
  drawingFileId?: number;
  thumbnailFileId?: number;
}

export interface FacilityUpdateRequest {
  facility?: {
    name?: string;
    description?: string;
    code?: string;
    thumbnailFileId?: number;
  }
}

export interface FacilityDrawingUpdateRequest {
  drawingFileId: number;
  comment: string;
}