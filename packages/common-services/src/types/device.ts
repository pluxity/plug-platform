import type { DeviceCategoryResponse } from './device-category';
export type {
  DeviceCategoryResponse,
  DeviceCategoryRequest,
} from './device-category';
import { FeatureResponse } from './feature'

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
  feature?: FeatureResponse;
  deviceCategory?: DeviceCategoryResponse;
}
