import { BaseFacilityResponse, BuildingDtos, StationDtos } from "@plug/common-services";

export type FacilityData = BaseFacilityResponse |
    BuildingDtos['CREATE_REQUEST'] |
    StationDtos['CREATE_REQUEST'];

export const isBuildingFacility = (data: unknown): data is BuildingDtos['CREATE_REQUEST'] | BuildingDtos['RESPONSE'] => {
  return data !== null &&
    typeof data === 'object' &&
    'floors' in data &&
    Array.isArray((data as any).floors);
};

export const isStationFacility = (data: unknown): data is StationDtos['CREATE_REQUEST'] | StationDtos['RESPONSE'] => {
  return data !== null &&
    typeof data === 'object' &&
    'stationInfo' in data &&
    typeof (data as any).stationInfo === 'object' &&
    'lineIds' in (data as any).stationInfo &&
    'stationCodes' in (data as any).stationInfo;
};