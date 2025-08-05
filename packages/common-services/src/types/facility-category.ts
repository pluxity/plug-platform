import { FileResponse } from "./file";

// Facility Category 관련 타입
export interface FacilityCategoryResponse {
  id: number;
  name: string;
  parentId?: number;
  children: FacilityCategoryResponse[];
  thumbnail?: FileResponse;
  createdAt: string;
  updatedAt: string;
  depth: number;
}

export interface FacilityCategoryAllResponse {
  maxDepth: number;
  list: FacilityCategoryResponse[];
}

export interface FacilityCategoryCreateRequest {
  name: string;
  parentId?: number;
}

export interface FacilityCategoryUpdateRequest {
  name?: string;
  parentId?: number;
}
