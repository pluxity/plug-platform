import { FileResponse } from "./file";
import {BaseFacilityResponse} from "./facilityFactory";

export interface FacilitiesAllResponse {
  buildings?: BaseFacilityResponse[];
  stations?: BaseFacilityResponse[];
}

export interface FacilityHistoryResponse {
  id: number;
  comment: string;
  createdAt: string;
  createdBy: string;
  file: FileResponse;
}

export interface FacilityDrawingUpdateRequest {
  drawingFileId: number;
  comment: string;
}