import { BaseFacilityResponse, BuildingDtos, StationDtos } from "@plug/common-services";

export type FacilityData = BaseFacilityResponse | BuildingDtos['RESPONSE'] | StationDtos['RESPONSE'];
export type FacilityCreateRequest = BuildingDtos['CREATE_REQUEST'] | StationDtos['CREATE_REQUEST'];
export type FacilityUpdateRequest = BuildingDtos['UPDATE_REQUEST'] | StationDtos['UPDATE_REQUEST'];

export const isBuildingResponse = (data: unknown): data is BuildingDtos['RESPONSE'] => {
  return data !== null &&
      typeof data === 'object' &&
      'facility' in data &&
      'floors' in data &&
      Array.isArray((data as any).floors);
};

export const isStationResponse = (data: unknown): data is StationDtos['RESPONSE'] => {
  return data !== null &&
      typeof data === 'object' &&
      'facility' in data &&
      'stationInfo' in data &&
      typeof (data as any).stationInfo === 'object' &&
      'lineIds' in (data as any).stationInfo &&
      'stationCodes' in (data as any).stationInfo;
};

export const isBuildingCreateRequest = (data: unknown): data is BuildingDtos['CREATE_REQUEST'] => {
  return data !== null &&
      typeof data === 'object' &&
      'facility' in data &&
      'floors' in data &&
      Array.isArray((data as any).floors);
};

export const isStationCreateRequest = (data: unknown): data is StationDtos['CREATE_REQUEST'] => {
  return data !== null &&
      typeof data === 'object' &&
      'facility' in data &&
      'stationInfo' in data &&
      typeof (data as any).stationInfo === 'object' &&
      'lineIds' in (data as any).stationInfo &&
      'stationCodes' in (data as any).stationInfo;
};

export const isBuildingFacility = (data: unknown): data is BuildingDtos['RESPONSE'] | BuildingDtos['CREATE_REQUEST'] => {
  return isBuildingResponse(data) || isBuildingCreateRequest(data);
};

export const isStationFacility = (data: unknown): data is StationDtos['RESPONSE'] | StationDtos['CREATE_REQUEST'] => {
  return isStationResponse(data) || isStationCreateRequest(data);
};