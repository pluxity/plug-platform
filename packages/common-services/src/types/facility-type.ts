// Uppercase facility types used across API and app
export type FacilityType = 'BUILDING' | 'STATION' | 'Park' extends never ? never : 'BUILDING' | 'STATION' | 'PARK';

// Note: Keep in sync with DOMAINS keys in constants/domain-config.ts
