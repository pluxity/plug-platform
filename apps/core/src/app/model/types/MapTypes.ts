export enum MapMode {
  OUTDOOR = 'outdoor',
  INDOOR = 'indoor'
}

export enum EntityType {
  BUILDING = 'building',
  POI = 'poi',
  MARKER = 'marker'
}

export interface BaseMapState {
  mode: MapMode
  center: { lat: number; lng: number }
  zoom: number
  markers: MapMarker[]
  activePoints: number
  systemHealth: number
  connectedUsers: number
  dataStreamStatus: 'live' | 'offline' | 'pending'
}

export interface OutdoorMapState extends BaseMapState {
  mode: MapMode.OUTDOOR
  selectedEntity?: string
  entities: OutdoorEntity[]
  buildings: BuildingEntity[]
}

export interface IndoorMapState extends BaseMapState {
  mode: MapMode.INDOOR
  buildingId: string
  floor: number
  camera: {
    position: [number, number, number]
    target: [number, number, number]
  }
  models: IndoorModel[]
  pois: IndoorPoi[]
}

export type MapState = OutdoorMapState | IndoorMapState

export interface OutdoorEntity {
  id: string
  name: string
  position: { lat: number; lng: number }
  buildingId?: string // 실내 지도와 연결되는 건물 ID
  type: EntityType
}

export interface BuildingEntity {
  id: string
  name: string
  description?: string
  position: { lat: number; lng: number }
  gltfUrl: string
  thumbnailUrl: string
  type: EntityType.BUILDING
}

export interface IndoorModel {
  id: string
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
}

export interface IndoorPoi {
  id: string
  name: string
  position: [number, number, number]
  type: string
  description?: string
}

export interface MapMarker {
  id: string
  position: { lat: number; lng: number }
  title: string
  type: 'poi' | 'station' | 'checkpoint' | 'warning'
  status: 'active' | 'inactive' | 'warning'
  metadata?: Record<string, unknown>
}

export interface MapActions {
  centerMap: () => void
  addMarker: (position: { lat: number; lng: number }, type: MapMarker['type']) => void
  removeMarker: (id: string) => void
  searchLocation: (query: string) => Promise<void>
  updateZoom: (zoom: number) => void
  toggleMeasure: () => void
  toggleLayers: () => void
  switchToIndoor: (buildingId: string) => void
  switchToOutdoor: () => void
  selectEntity: (entityId: string) => void
  onEntityClick: (entity: BuildingEntity | OutdoorEntity) => void
  onEntityDoubleClick: (entity: BuildingEntity | OutdoorEntity) => void
}

export interface EntityClickEvent {
  entity: BuildingEntity | OutdoorEntity
  position: { lat: number; lng: number }
  clickType: 'single' | 'double'
}

export interface MapEventHandlers {
  onEntityClick?: (event: EntityClickEvent) => void
  onEntityDoubleClick?: (event: EntityClickEvent) => void
  onEntityHover?: (entity: BuildingEntity | OutdoorEntity | null) => void
}