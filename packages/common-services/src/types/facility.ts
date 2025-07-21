import { FileResponse } from "./file";

export interface FacilitiesAllResponse {
  building: FacilityResponse[];
  station: FacilityResponse[];
}

export interface FacilityHistoryResponse {
  id: number;
  comment: string;
  createdAt: string;
  createdBy: string;
  file: FileResponse;
}

export interface FacilityResponse {
  facility:{
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