// 지도 API 상수들
export const VWORLD_MAP_URL = 'https://api.vworld.kr/req/wmts/1.0.0/';
export const VWORLD_API_KEY = import.meta.env.VITE_VWORLD_API_KEY;
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const CESIUM_ION_ACCESS_TOKEN = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN;
export const CESIUM_ION_ASSET_ID = Number(import.meta.env.VITE_CESIUM_ION_ASSET_ID) || 96188;

// 지도 제공자 타입 정의
export type MapProvider = 'vworld' | 'google' | 'osm';
