import { FileResponse } from "./file";
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

export interface GsDeviceCreateRequest {
  id?: string;
  name?: string;
  categoryId?: number;
}

export interface GsDeviceUpdateRequest {
  name?: string;
  categoryId?: number;
}

export interface GsDeviceResponse {
  id: string;
  name?: string;
  feature?: any; // FeatureResponse type can be imported if needed
  deviceCategory?: DeviceCategoryResponse;
}
