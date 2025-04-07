import { FileResponse } from "./file";
  
export interface BuildingResponse {
  id: number;
  name: string;
  description?: string;
  file: FileResponse;
  thumbnail: FileResponse;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuildingRequest {
  name: string;
  description?: string;
  fileId?: File;
  thumbnailId?: File;
}

// 건물 수정 요청 타입
export interface UpdateBuildingRequest {
  name: string;
  description?: string;
  fileId?: File;
  thumbnailId?: File;
}