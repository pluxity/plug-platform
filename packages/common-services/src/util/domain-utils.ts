import { DOMAINS, FacilityType, domainUtils } from '../constants/domain-config';

export const mapEndpointToFacilityType = (endpoint: string): FacilityType => {
  const match = Object.entries(DOMAINS).find(([, config]) => config.endpoint === endpoint);
  return match ? (match[0].toUpperCase() as FacilityType) : 'BUILDING';
};

export const mapFacilityTypeToEndpoint = (facilityType: FacilityType): string => {
  return domainUtils.getConfig(facilityType).endpoint || 'buildings';
};

export const getAllFacilityTypes = (): FacilityType[] => {
  return domainUtils.getAllDomains();
};

export const getFacilityTypeDisplayName = (facilityType: FacilityType): string => {
  return domainUtils.getConfig(facilityType)?.displayName || '시설';
};
