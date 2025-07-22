import { FileResponse } from "./file";
export interface Facility {
  id: number;
  name: string;
  description?: string;
  drawing: FileResponse;
  thumbnail: FileResponse;
  lon: number;
  lat: number;
  locationMeta: string;
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  floorId: number;
  name: string;
}
export interface BuildingResponse {
  facility: Facility;
  floors: Floor[];
}

export interface BuildingCreateRequest {
  name: string;
  description?: string;
  fileId?: File;
  thumbnailId?: File;
}

// 건물 수정 요청 타입
export interface BuildingUpdateRequest {
  name: string;
  description?: string;
  fileId?: File;
  thumbnailId?: File;
}