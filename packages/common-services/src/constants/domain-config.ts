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
  // airportInfo: {
  //   createRequest: { terminalCount?: number; runwayCount?: number; };
  //   updateRequest: { terminalCount: number; runwayCount: number; };
  //   response: { airportInfo: { terminalCount: number; runwayCount: number; } };
  // };
}

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

export const DOMAINS = {
  building: {
    displayName: '건물',
    endpoint: '/buildings',
    components: ['facility', 'floors'] as const
  },
  
  station: {
    displayName: '역사',
    endpoint: '/stations',
    components: ['facility', 'floors', 'stationInfo'] as const
  },
  
  park: {
    displayName: '공원',
    endpoint: '/parks',
    components: ['facility', 'boundary'] as const
  },

  // airport: {
  //   displayName: '공항',
  //   endpoint: '/airports',
  //   components: ['facility', 'floors', 'airportInfo'] as const
  // }

} as const;

export type DomainKey = keyof typeof DOMAINS;
export type DomainCreateRequest<T extends DomainKey> = ComposeCreateRequest<typeof DOMAINS[T]['components']>;
export type DomainUpdateRequest<T extends DomainKey> = ComposeUpdateRequest<typeof DOMAINS[T]['components']>;
export type DomainResponse<T extends DomainKey> = ComposeResponse<typeof DOMAINS[T]['components']>;
export type FacilityType = DomainKey;

export const domainUtils = {
  getConfig<T extends DomainKey>(domain: T): typeof DOMAINS[T] {
    return DOMAINS[domain];
  },

  getAllDomains(): DomainKey[] {
    return Object.keys(DOMAINS) as DomainKey[];
  },

  isValidDomain(domain: string): domain is DomainKey {
    return domain in DOMAINS;
  },

  hasComponent<T extends DomainKey>(domain: T, componentName: ComponentName): boolean {
    const config = this.getConfig(domain);
    return (config.components as readonly ComponentName[]).includes(componentName);
  }
};
