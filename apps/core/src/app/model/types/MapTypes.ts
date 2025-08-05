export interface MapState {
  center: { lat: number; lng: number }
  zoom: number
  markers: MapMarker[]
  activePoints: number
  systemHealth: number
  connectedUsers: number
  dataStreamStatus: 'live' | 'offline' | 'pending'
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
}

export interface SystemStatus {
  activePoints: number
  systemHealth: number
  connectedUsers: number
  dataStreamStatus: 'live' | 'offline' | 'pending'
  lastUpdate: Date
}

export enum MapMode {
  OUTDOOR = 'outdoor',
  INDOOR = 'indoor'
}
