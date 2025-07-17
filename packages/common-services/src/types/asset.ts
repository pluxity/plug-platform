import { FileResponse } from './file'

export interface AssetCreateRequest {
  name: string;
  code: string;
  fileId?: number;
  thumbnailFileId?: number;
  categoryId?: number;
}

export interface AssetUpdateRequest {
  name: string;
  code: string;
  fileId?: number;
  thumbnailFileId?: number;
  categoryId?: number;
}

export interface AssetResponse {
  id: number;
  name: string;
  code: string;
  categoryId?: number;
  categoryName?: string;
  categoryCode?: string;
  file?: FileResponse;
  thumbnailFile?: FileResponse;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
