import { Spatial } from './feature';

export interface Label3DCreateRequest {
  id?: string;
  displayText?: string;
  facilityId?: number;
  floorId?: string;
  position?: Spatial;
  rotation?: Spatial;
  scale?: Spatial;
}

export interface Label3DUpdateRequest {
  position?: Spatial;
  rotation?: Spatial;
  scale?: Spatial;
}

export interface Label3DResponse {
  id: string;
  displayText?: string;
  floorId?: string;
  position?: Spatial;
  rotation?: Spatial;
  scale?: Spatial;
}
