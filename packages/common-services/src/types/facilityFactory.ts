import { FileResponse } from "./file";

// facility options
export interface Floor {
  floorId: number;
  name: string;
}
export interface StationInfo {
  lineIds: number[];
  stationCodes: string[];
}

//기본 facility res/req
export interface BaseFacilityResponse {
  id: number;
  name: string;
  code: string;
  description: string;
  drawing: FileResponse;
  thumbnail: FileResponse;
  path: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface BaseFacilityRequest {
  name: string;
  code: string;
  description: string;
  drawingFileId?: number;
  thumbnailFileId?: number;
  path?: string;
}

// 전체 확장 facility res/req -> 필요에 따라 Omit해 사용
export interface FacilityRequest {
  facility: BaseFacilityRequest;
  floors?: Floor[];
  stationInfo?: StationInfo;
}

export interface FacilityResponse {
  facility : BaseFacilityResponse;
  floors: Floor[];
  stationInfo: StationInfo;
}

// facility 유형, facility 확장 옵션
export type FacilityFactory = 'buildings' | 'stations';
export type FacilityOptions = 'floors' | 'stationInfo';

export interface FacilityTypeOptionsMap {
  buildings: 'floors';
  stations: 'floors' | 'stationInfo';
}

// facility 유형별 res/req
export interface FacilityInterfaces<CREQ, UREQ, RES> {
  CREATE_REQUEST: CREQ;
  UPDATE_REQUEST: UREQ;
  RESPONSE: RES;
}

type CreateRequest<T extends FacilityFactory> = Pick<FacilityRequest, 'facility' | FacilityTypeOptionsMap[T]>;
type UpdateRequest<T extends FacilityFactory> = Pick<FacilityRequest, 'facility' | FacilityTypeOptionsMap[T]>;
type Response<T extends FacilityFactory> = Pick<FacilityResponse, 'facility' | FacilityTypeOptionsMap[T]>;

export type FacilityTypeInterfaces<T extends FacilityFactory> = FacilityInterfaces<
  CreateRequest<T>,
  UpdateRequest<T>,
  Response<T>
>;

export type BuildingDtos = FacilityTypeInterfaces<'buildings'>;
export type StationDtos = FacilityTypeInterfaces<'stations'>;

export interface FacilitiesAllResponse {
  buildings?: BuildingDtos['RESPONSE']['facility'][];
  stations?: StationDtos['RESPONSE']['facility'][];
}
