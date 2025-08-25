
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

type ComponentName = 'facility' | 'floors' | 'stationInfo' | 'boundary'

export type FacilityKey = keyof typeof DOMAINS;
export type FacilityType = Uppercase<FacilityKey>;

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
