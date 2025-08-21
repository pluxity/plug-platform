import { FileResponse } from './file';

export interface AssetCategoryCreateRequest {
  name: string;
  code: string;
  parentId: number | null;
  thumbnailFileId?: number;
}

export interface AssetCategoryUpdateRequest {
  name: string;
  code: string;
  parentId: number | null;
  thumbnailFileId?: number;
}

export interface AssetCategoryResponse {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  children: AssetCategoryResponse[];
  thumbnail?: FileResponse;
  assetIds: number[];
  createdAt: string;
  updatedAt: string;
  depth: number;
}

export interface AssetCategoryAllResponse {
  maxDepth: number;
  list: AssetCategoryResponse[];
}

// New: API now provides maxDepth via a separate endpoint
export interface AssetCategoryDepthResponse {
  maxDepth: number;
}
