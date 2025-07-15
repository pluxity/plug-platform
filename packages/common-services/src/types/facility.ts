import { FileResponse } from "./file";

export interface FacilitiesAllResponse {
  building: FacilityResponse[];
  station: FacilityResponse[];
  panorama: FacilityResponse[];
}

export interface FacilityResponse {
  id: number;
  name: string;
  code: string;
  description: string;
  drawing: FileResponse;
  thumbnail: FileResponse;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface FacilityCreateRequest {
  name: string;
  code: string;
  description?: string;
  drawingFileId?: number;
  thumbnailFileId?: number;
}

export interface FacilityUpdateRequest {
    name: string;
    description?: string;
    drawingFieldId?: number;
    thumbnailFieldId?: number;
}