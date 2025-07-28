import { BaseFacilityResponse, BuildingDtos, StationDtos } from "@plug/common-services";

export type FacilityData = BaseFacilityResponse |
    BuildingDtos['RESPONSE'] |
    StationDtos['RESPONSE'];

export const isBuildingFacility = (data: unknown): data is BuildingDtos['RESPONSE'] => {
    return data !== null &&
        typeof data === 'object' &&
        'floors' in data &&
        Array.isArray((data as any).floors);
};

export const isStationFacility = (data: unknown): data is StationDtos['RESPONSE'] => {
    return data !== null &&
        typeof data === 'object' &&
        'stationInfo' in data &&
        typeof (data as any).stationInfo === 'object' &&
        'lineIds' in (data as any).stationInfo &&
        'stationCodes' in (data as any).stationInfo;
};
