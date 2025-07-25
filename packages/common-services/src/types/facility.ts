import { FileResponse } from "./file";

export interface Floor {
  id: number;
  name: string;
}
export interface StationInfo {
  lineIds: number[];
  stationCodes: string[];
}

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
  drawing?: FileResponse;
  thumbnail?: FileResponse;
  path?: string;
}

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
  
// 확장 가능한 FacilityType 정의
export type FacilityType = 'buildings' | 'stations';
export type FacilityOptions = 'floors' | 'stationInfo';

// FacilityType별로 사용 가능한 옵션을 매핑
export interface FacilityTypeOptionsMap {
  buildings: 'floors';
  stations: 'floors' | 'stationInfo';
}

// 제네릭 인터페이스
export interface FacilityInterfaces<CREQ, UREQ, RES> {
  CREATE_REQUEST: CREQ;
  UPDATE_REQUEST: UREQ;
  RESPONSE: RES;
}

// 유틸리티 타입: 특정 FacilityType에 대한 옵션들을 기반으로 Request/Response 타입 생성
type CreateRequest<T extends FacilityType> = Pick<FacilityRequest, 'facility' | FacilityTypeOptionsMap[T]>;
type UpdateRequest<T extends FacilityType> = Pick<FacilityRequest, 'facility' | FacilityTypeOptionsMap[T]>;
type Response<T extends FacilityType> = Pick<FacilityResponse, 'facility' | FacilityTypeOptionsMap[T]>;

// 타입별 인터페이스를 자동으로 생성하는 유틸리티 타입
export type FacilityTypeInterfaces<T extends FacilityType> = FacilityInterfaces<
  CreateRequest<T>,
  UpdateRequest<T>,
  Response<T>
>;

// 기존 타입들을 새로운 시스템으로 정의
export type BuildingDtos = FacilityTypeInterfaces<'buildings'>;
export type StationDtos = FacilityTypeInterfaces<'stations'>;