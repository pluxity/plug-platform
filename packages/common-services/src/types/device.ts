import type { DeviceCategoryResponse } from './device-category';
import { FeatureResponse } from './feature'

export interface DeviceCreateRequest {
  id: string;
  name: string;
  categoryId?: number;
  companyType: string;
  deviceType: string;
}

export interface DeviceUpdateRequest {
  name: string;
  categoryId?: number;
  deviceType: string;
  companyType: string;
}

export interface DeviceResponse {
  id: string;
  name: string;
  deviceType: string;
  companyType: string;
  feature?: FeatureResponse;
  deviceCategory?: DeviceCategoryResponse;
}

export interface DeviceTypeResponse {
  key: string;
  label: string;
}

export interface DeviceCompanyTypeResponse{
  key: string;
  label: string;
}