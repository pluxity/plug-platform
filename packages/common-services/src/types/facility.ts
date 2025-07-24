import { Floors } from "./floors";
import { FileResponse } from "./file";

export interface Path {
  id: number;
  name: string;
  type: string;
  path: string;
}

export interface BaseFacility {
  facility:{
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
}

export interface FacilityWithFloorsBase extends BaseFacility {
  floors: Floors[];
}

export interface BaseFacilityCreateRequest {
  facility: {
    name: string;
    code: string;
    description: string;
    thumbnailFileId?: number;
    drawingFileId?: number;
  };
}

export interface FacilityWithFloorsCreateRequest extends BaseFacilityCreateRequest {
  floors: Floors[];
}

export interface BaseFacilityUpdateRequest {
  facility?: {
    name?: string;
    description?: string;
    code?: string;
    thumbnailFileId?: number;
    drawingFileId?: number;
  }
}

export interface FacilitiesAllResponse {
  buildings: BaseFacility[];
  stations: BaseFacility[];
}

export interface FacilityHistoryResponse {
  id: number;
  comment: string;
  createdAt: string;
  createdBy: string;
  file: FileResponse;
}