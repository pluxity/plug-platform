import { UseApiResponse, UseSWRApiReturn } from "@plug/api-hooks";
import { BuildingDtos, FileResponse, StationDtos } from "@plug/common-services";
import { BaseFacilityResponse, BaseFacilityRequest } from "@plug/common-services";

export type FacilityFormMode = 'create' | 'detail' | 'edit';

export type FacilityResponse = BuildingDtos['RESPONSE'] | StationDtos['RESPONSE'];
export type FacilityCreateRequest = BuildingDtos['CREATE_REQUEST'] | StationDtos['CREATE_REQUEST'];
export type FacilityUpdateRequest = BuildingDtos['UPDATE_REQUEST'] | StationDtos['UPDATE_REQUEST'];
export type FacilityData = FacilityResponse | FacilityCreateRequest | FacilityUpdateRequest;
export type FacilityFormData = FacilityData;

export const hasFacility = (data: unknown): data is { facility: Record<string, unknown> } => {
  return data !== null && typeof data === 'object' && 'facility' in data;
};

export const getFacilityBase = (data: FacilityData): BaseFacilityResponse | BaseFacilityRequest => {
  if (!hasFacility(data)) {
    return { name: '', code: '' } as BaseFacilityRequest;
  }
  return data.facility as BaseFacilityResponse | BaseFacilityRequest;
};

export const getThumbnail = (data: FacilityData): FileResponse | undefined => {
  if (!hasFacility(data)) {
    return undefined;
  }

  const facility = data.facility;
  return 'thumbnail' in facility ? facility.thumbnail as FileResponse : undefined;
};

export function getDrawingInfo(data: FacilityData): FileResponse | undefined {
  if (!hasFacility(data)) {
    return undefined;
  }

  const facility = data.facility;
  return 'drawing' in facility ? facility.drawing as FileResponse : undefined;
}


export const getFacilityId = (data: FacilityData): number | undefined => {
  if (!hasFacility(data)) {
    return undefined;
  }

  const facility = data.facility;
  return 'id' in facility ? (facility.id as number) : undefined;
};

export const getCreatedAt = (data: FacilityData): string | undefined => {
  if (!hasFacility(data)) {
    return undefined;
  }

  const facility = data.facility;
  return 'createdAt' in facility ? facility.createdAt as string : undefined;
};

export const getCreatedBy = (data: FacilityData): string | undefined => {
  if (!hasFacility(data)) {
    return undefined;
  }

  const facility = data.facility;
  return 'createdBy' in facility ? facility.createdBy as string : undefined;
};

export const getUpdatedAt = (data: FacilityData): string | undefined => {
  if (!hasFacility(data)) {
    return undefined;
  }

  const facility = data.facility;
  return 'updatedAt' in facility ? facility.updatedAt as string : undefined;
};

export const getUpdatedBy = (data: FacilityData): string | undefined => {
  if (!hasFacility(data)) {
    return undefined;
  }

  const facility = data.facility;
  return 'updatedBy' in facility ? facility.updatedBy as string : undefined;
};

export const updateFacilityField = (
  data: FacilityFormData, 
  path: string, 
  value: string | number | boolean
): FacilityFormData => {
  const result = { ...data };
  const parts = path.split('.');

  let current: Record<string, unknown> = result as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }
  
  current[parts[parts.length - 1]] = value;
  return result;
};

export const isBuildingResponse = (data: unknown): data is BuildingDtos['RESPONSE'] => {
  if (!hasFacility(data)) return false;
  return 'floors' in data && Array.isArray(data.floors);
};

export const isStationResponse = (data: unknown): data is StationDtos['RESPONSE'] => {
  if (!hasFacility(data)) return false;
  
  if (!('stationInfo' in data)) return false;
  const stationInfo = data.stationInfo;
  
  return (
    typeof stationInfo === 'object' && 
    stationInfo !== null && 
    'lineIds' in stationInfo && 
    'stationCodes' in stationInfo
  );
};

export const isBuildingCreateRequest = (data: unknown): data is BuildingDtos['CREATE_REQUEST'] => {
  if (!hasFacility(data)) return false;
  
  return 'floors' in data && Array.isArray(data.floors);
};

export const isStationCreateRequest = (data: unknown): data is StationDtos['CREATE_REQUEST'] => {
  if (!hasFacility(data)) return false;
  
  if (!('stationInfo' in data)) return false;
  const stationInfo = data.stationInfo;
  
  return (
    typeof stationInfo === 'object' && 
    stationInfo !== null && 
    'lineIds' in stationInfo && 
    'stationCodes' in stationInfo
  );
};

export const isBuildingFacility = (data: unknown): data is BuildingDtos['RESPONSE'] | BuildingDtos['CREATE_REQUEST'] => {
  return isBuildingResponse(data) || isBuildingCreateRequest(data);
};

export const isStationFacility = (data: unknown): data is StationDtos['RESPONSE'] | StationDtos['CREATE_REQUEST'] => {
  return isStationResponse(data) || isStationCreateRequest(data);
};

export function isApiHookResult<T = any, P = any>(result: any): result is UseApiResponse<T, P> {
  return result && typeof result.execute === 'function' && 'isSuccess' in result;
}
export function isSWRHookResult<T = any>(result: any): result is UseSWRApiReturn<T> {
  return result && typeof result.mutate === 'function' && !('isSuccess' in result);
}
