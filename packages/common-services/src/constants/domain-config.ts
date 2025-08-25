import { 
  FacilityCreateRequest,
  FacilityUpdateRequest, 
  FacilityResponse,
  FloorRequest,
  FloorResponse,
  StationInfoResponse,
  StationInfoRequest,
  StationInfoCreateRequest
} from '../types/facility';

export interface DataComponentTypes {
  facility: {
    createRequest: { facility: FacilityCreateRequest; };
    updateRequest: { facility: FacilityUpdateRequest; };
    response: { facility: FacilityResponse; };
  };
  floors: {
    createRequest: { floors?: FloorRequest[]; };
    updateRequest: { floors: FloorRequest[]; };
    response: { floors: FloorResponse[]; };
  };
  stationInfo: {
    createRequest: { stationInfo?: StationInfoCreateRequest; };
    updateRequest: { stationInfo: StationInfoRequest; };
    response: { stationInfo: StationInfoResponse; };
  };
  boundary: {
    createRequest: { boundary?: string; };
    updateRequest: { boundary: string; };
    response: { boundary: string; };
  };
}

export const DOMAINS = {
  building: {
    displayName: '건물',
    endpoint: 'facilities/buildings',
    components: ['facility', 'floors'] as const
  },
  
  station: {
    displayName: '역사',
    endpoint: 'facilities/stations',
    components: ['facility', 'floors', 'stationInfo'] as const
  },
  
  park: {
    displayName: '공원',
    endpoint: 'facilities/parks',
    components: ['facility', 'boundary'] as const
  },

} as const;

type ComponentName = keyof DataComponentTypes;

type ComposeCreateRequest<T extends readonly ComponentName[]> = 
  T extends readonly [infer First, ...infer Rest]
    ? First extends ComponentName
      ? Rest extends readonly ComponentName[]
        ? DataComponentTypes[First]['createRequest'] & ComposeCreateRequest<Rest>
        : DataComponentTypes[First]['createRequest']
      : {}
    : {};

type ComposeUpdateRequest<T extends readonly ComponentName[]> = 
  T extends readonly [infer First, ...infer Rest]
    ? First extends ComponentName
      ? Rest extends readonly ComponentName[]
        ? DataComponentTypes[First]['updateRequest'] & ComposeUpdateRequest<Rest>
        : DataComponentTypes[First]['updateRequest']
      : {}
    : {};

type ComposeResponse<T extends readonly ComponentName[]> = 
  T extends readonly [infer First, ...infer Rest]
    ? First extends ComponentName
      ? Rest extends readonly ComponentName[]
        ? DataComponentTypes[First]['response'] & ComposeResponse<Rest>
        : DataComponentTypes[First]['response']
      : {}
    : {};

export type FacilityKey = keyof typeof DOMAINS;
export type FacilityType = Uppercase<FacilityKey>;

type FacilityMap = {
  [K in FacilityKey as Uppercase<K>]: typeof DOMAINS[K]
};

export type DomainCreateRequest<T extends FacilityType> = ComposeCreateRequest<FacilityMap[T]['components']>;
export type DomainUpdateRequest<T extends FacilityType> = ComposeUpdateRequest<FacilityMap[T]['components']>;
export type DomainResponse<T extends FacilityType> = ComposeResponse<FacilityMap[T]['components']>;

export const domainUtils = {
  getConfig(domain: FacilityType | FacilityKey) {
  const domainKey = String(domain).toLowerCase() as FacilityKey;
  return DOMAINS[domainKey];
  },

  getAllDomains(): FacilityType[] {
    return (Object.keys(DOMAINS) as FacilityKey[]).map(k => k.toUpperCase() as FacilityType);
  },

  isValidDomain(domain: string): domain is FacilityType | FacilityKey {
    return String(domain).toLowerCase() in DOMAINS;
  },

  hasComponent(domain: FacilityType | FacilityKey, componentName: ComponentName): boolean {
  const config = this.getConfig(domain as FacilityType);
  return (config.components as readonly ComponentName[]).includes(componentName);
  }
};
