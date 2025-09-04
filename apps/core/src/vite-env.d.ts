/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VWORLD_API_KEY: string
  readonly VITE_CESIUM_ION_ACCESS_TOKEN: string
  readonly VITE_CESIUM_ION_ASSET_ID: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
