import { MapState, MapMarker, SystemStatus } from './types/MapTypes'

export class MapModel {
  private state: MapState
  private listeners: (() => void)[] = []

  constructor() {
    this.state = {
      center: { lat: 37.5665, lng: 126.9780 }, // Seoul
      zoom: 10,
      markers: [],
      activePoints: 42,
      systemHealth: 98,
      connectedUsers: 1200,
      dataStreamStatus: 'live'
    }

    // 초기 샘플 마커 추가
    this.addInitialMarkers()
  }

  private addInitialMarkers(): void {
    const sampleMarkers: Omit<MapMarker, 'id'>[] = [
      {
        position: { lat: 37.5665, lng: 126.9780 },
        title: 'Seoul Station',
        type: 'station',
        status: 'active'
      },
      {
        position: { lat: 37.5575, lng: 126.9764 },
        title: 'Myeongdong',
        type: 'poi',
        status: 'active'
      },
      {
        position: { lat: 37.5796, lng: 126.9770 },
        title: 'Gyeongbokgung',
        type: 'checkpoint',
        status: 'warning'
      }
    ]

    sampleMarkers.forEach(marker => {
      this.state.markers.push({
        ...marker,
        id: Date.now().toString() + Math.random()
      })
    })
  }

  getState(): MapState {
    return { ...this.state }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify(): void {
    this.listeners.forEach(listener => listener())
  }

  updateCenter(center: { lat: number; lng: number }): void {
    this.state.center = center
    this.notify()
  }

  updateZoom(zoom: number): void {
    this.state.zoom = Math.max(1, Math.min(20, zoom))
    this.notify()
  }

  addMarker(marker: Omit<MapMarker, 'id'>): string {
    const newMarker: MapMarker = {
      ...marker,
      id: Date.now().toString()
    }
    this.state.markers.push(newMarker)
    this.state.activePoints = this.state.markers.filter(m => m.status === 'active').length
    this.notify()
    return newMarker.id
  }

  removeMarker(id: string): boolean {
    const initialLength = this.state.markers.length
    this.state.markers = this.state.markers.filter(m => m.id !== id)
    this.state.activePoints = this.state.markers.filter(m => m.status === 'active').length
    
    if (this.state.markers.length !== initialLength) {
      this.notify()
      return true
    }
    return false
  }

  updateMarkerStatus(id: string, status: MapMarker['status']): boolean {
    const marker = this.state.markers.find(m => m.id === id)
    if (marker) {
      marker.status = status
      this.state.activePoints = this.state.markers.filter(m => m.status === 'active').length
      this.notify()
      return true
    }
    return false
  }

  updateSystemStatus(status: Partial<SystemStatus>): void {
    if (status.activePoints !== undefined) this.state.activePoints = status.activePoints
    if (status.systemHealth !== undefined) this.state.systemHealth = status.systemHealth
    if (status.connectedUsers !== undefined) this.state.connectedUsers = status.connectedUsers
    if (status.dataStreamStatus !== undefined) this.state.dataStreamStatus = status.dataStreamStatus
    this.notify()
  }

  getSystemStatus(): SystemStatus {
    return {
      activePoints: this.state.activePoints,
      systemHealth: this.state.systemHealth,
      connectedUsers: this.state.connectedUsers,
      dataStreamStatus: this.state.dataStreamStatus,
      lastUpdate: new Date()
    }
  }

  // 실시간 데이터 시뮬레이션
  startRealTimeUpdates(): () => void {
    const interval = setInterval(() => {
      this.state.systemHealth = Math.max(85, Math.min(100, this.state.systemHealth + (Math.random() - 0.5) * 2))
      this.state.connectedUsers = Math.max(1000, Math.min(2000, this.state.connectedUsers + Math.floor((Math.random() - 0.5) * 50)))
      this.notify()
    }, 3000)

    return () => clearInterval(interval)
  }
}
