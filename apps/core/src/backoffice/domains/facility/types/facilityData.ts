import { BaseFacility, FacilityWithFloorsBase, StationFacility } from "@plug/common-services";

export type FacilityData = BaseFacility | FacilityWithFloorsBase | StationFacility


export const hasFloors = (data: FacilityData): data is FacilityWithFloorsBase => {
    return 'floors' in data && Array.isArray(data.floors);
};

export const isStationFacility = (data: FacilityData): data is StationFacility => {
    return 'lineIds' in data && 'stationCodes' in data;
};