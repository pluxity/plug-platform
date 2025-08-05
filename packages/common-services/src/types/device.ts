export interface DeviceCategoryResponse {
  id: number;
  name: string;
  parentId?: number;
  children?: DeviceCategoryResponse[];
  thumbnailFile?: any; // FileResponse type can be imported if needed
  depth: number;
}

export interface DeviceCategoryRequest {
  name: string;
  parentId?: number;
  thumbnailFileId?: number;
}

export interface DeviceCategoryAllResponse {
  maxDepth: number;
  list: DeviceCategoryResponse[];
}

export interface GsDeviceCreateRequest {
  id: string;
  name?: string;
  featureId?: string;
  categoryId?: number;
}

export interface GsDeviceUpdateRequest {
  name?: string;
  featureId?: string;
  categoryId?: number;
}

export interface GsDeviceResponse {
  id: string;
  name?: string;
  feature?: any; // FeatureResponse type can be imported if needed
  deviceCategory?: DeviceCategoryResponse;
}
