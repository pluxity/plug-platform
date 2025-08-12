export interface Spatial {
  x: number;
  y: number;
  z: number;
}

export interface FeatureCreateRequest {
  id: string;
  position?: Spatial;
  rotation?: Spatial;
  scale?: Spatial;
  assetId: number;
  facilityId: number;
  floorId?: string;
}

export interface FeatureUpdateRequest {
  position?: Spatial;
  rotation?: Spatial;
  scale?: Spatial;
}

export interface FeatureAssignDto {
  id: string;
}

export interface FeatureResponse {
  id: string;
  position?: Spatial;
  rotation?: Spatial;
  scale?: Spatial;
  assetId: number;
  floorId: string;
  deviceId?: string;
}
