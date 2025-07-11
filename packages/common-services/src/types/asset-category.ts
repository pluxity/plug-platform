export interface AssetCategoryCreateRequest {
  name: string;
  code: string;
  parentId?: number;
  thumbnailFileId?: number;
}

export interface AssetCategoryUpdateRequest {
  name?: string;
  code?: string;
  parentId?: number;
  thumbnailFileId?: number;
}

export interface AssetCategoryResponse {
  id: number;
  name: string;
  code: string;
  parentId?: number;
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

interface FileResponse {
  id: number;
  url: string;
  originalFileName: string;
  contentType: string;
  fileStatus: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
