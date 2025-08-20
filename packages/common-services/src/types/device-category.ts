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

export interface DeviceCategoryAllResponse {
  maxDepth: number;
  list: DeviceCategoryResponse[];
}
