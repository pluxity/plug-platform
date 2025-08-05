import { DOMAINS, FacilityType } from '../constants/domain-config';

/**
 * API endpoint에서 FacilityType(도메인 키)로 매핑하는 유틸 함수
 * @param endpoint API endpoint (예: 'buildings', 'stations', 'parks')
 * @returns FacilityType 도메인 키
 */
export const mapEndpointToFacilityType = (endpoint: string): FacilityType => {
  const domainEntry = Object.entries(DOMAINS).find(([, config]) => config.endpoint === endpoint);
  return domainEntry ? domainEntry[0] as FacilityType : 'building';
};

/**
 * FacilityType(도메인 키)에서 API endpoint로 매핑하는 유틸 함수
 * @param facilityType FacilityType 도메인 키
 * @returns API endpoint
 */
export const mapFacilityTypeToEndpoint = (facilityType: FacilityType): string => {
  return DOMAINS[facilityType]?.endpoint || 'buildings';
};

/**
 * 사용 가능한 모든 FacilityType 목록을 반환
 * @returns FacilityType 배열
 */
export const getAllFacilityTypes = (): FacilityType[] => {
  return Object.keys(DOMAINS) as FacilityType[];
};

/**
 * FacilityType의 표시명을 반환
 * @param facilityType FacilityType 도메인 키
 * @returns 표시명 (한글)
 */
export const getFacilityTypeDisplayName = (facilityType: FacilityType): string => {
  return DOMAINS[facilityType]?.displayName || '시설';
};
