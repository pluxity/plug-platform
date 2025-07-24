import {FacilityBase, FacilityWithFloors, StationFacility} from "@plug/common-services";

export type FacilityData = | FacilityBase | FacilityWithFloors | StationFacility


export const hasFloors = (data: FacilityData): data is FacilityWithFloors => {
    return 'floors' in data && Array.isArray(data.floors);
};

export const isStationFacility = (data: FacilityData): data is StationFacility => {
    return hasFloors(data) && 'lineIds' in data && 'stationCodes' in data;
};

