import { FileResponse } from './file';

export interface DeviceCategoryResponse {
  id: number;
  name: string;
  parentId?: number;
  children?: DeviceCategoryResponse[];
  thumbnailFile?: FileResponse;
  depth: number;
}

export interface DeviceCategoryRequest {
  name: string;
  parentId?: number | null;
  thumbnailFileId?: number;
}

// New: API now provides maxDepth via a separate endpoint
export interface DeviceCategoryDepthResponse {
  maxDepth: number;
}
