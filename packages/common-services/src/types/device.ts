import type { DeviceCategoryResponse } from './device-category';
export type {
  DeviceCategoryResponse,
  DeviceCategoryRequest,
  DeviceCategoryAllResponse,
} from './device-category';
import { FeatureResponse } from './feature'

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
  feature?: FeatureResponse;
  deviceCategory?: DeviceCategoryResponse;
}
