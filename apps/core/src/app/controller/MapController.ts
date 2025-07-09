import { MapModel } from '@/app/model/MapModel'
import { MapMarker } from '@/app/model/types/MapTypes'

export class MapController {
  private model: MapModel

  constructor(model: MapModel) {
    this.model = model
  }

  // 지도 조작
  handleCenterMap = (): void => {
    // 서울역으로 중심 이동
    this.model.updateCenter({ lat: 37.5665, lng: 126.9780 })
  }

  handleZoomIn = (): void => {
    const currentState = this.model.getState()
    this.model.updateZoom(currentState.zoom + 1)
  }

  handleZoomOut = (): void => {
    const currentState = this.model.getState()
    this.model.updateZoom(currentState.zoom - 1)
  }

  // 마커 관리
  handleAddMarker = (type: MapMarker['type'] = 'poi'): string => {
    const currentState = this.model.getState()
    // 현재 중심점 근처에 랜덤한 위치 생성
    const randomOffset = () => (Math.random() - 0.5) * 0.01
    const position = {
      lat: currentState.center.lat + randomOffset(),
      lng: currentState.center.lng + randomOffset()
    }

    const titles = {
      poi: ['카페', '레스토랑', '상점', '공원'],
      station: ['지하철역', '버스정류장', '기차역'],
      checkpoint: ['검문소', '관제소', '모니터링포인트'],
      warning: ['주의구역', '위험지역', '경고지점']
    }

    const randomTitle = titles[type][Math.floor(Math.random() * titles[type].length)]

    return this.model.addMarker({
      position,
      title: randomTitle,
      type,
      status: 'active'
    })
  }

  handleRemoveMarker = (id: string): boolean => {
    return this.model.removeMarker(id)
  }

  handleUpdateMarkerStatus = (id: string, status: MapMarker['status']): boolean => {
    return this.model.updateMarkerStatus(id, status)
  }

  // 검색 기능
  handleSearchLocation = async (query: string): Promise<void> => {
    try {
      // 실제 구현에서는 지도 API를 호출
      const searchResults = await this.mockLocationSearch(query)
      if (searchResults.length > 0) {
        this.model.updateCenter(searchResults[0].position)
        this.model.updateZoom(15) // 검색 결과로 줌인
      }
    } catch (error) {
      console.error('Location search failed:', error)
      throw new Error('검색에 실패했습니다.')
    }
  }

  private mockLocationSearch = async (query: string): Promise<Array<{ title: string; position: { lat: number; lng: number } }>> => {
    // 모의 검색 결과
    const mockResults: Record<string, { lat: number; lng: number }> = {
      '서울': { lat: 37.5665, lng: 126.9780 },
      '부산': { lat: 35.1796, lng: 129.0756 },
      '인천': { lat: 37.4563, lng: 126.7052 },
      '대구': { lat: 35.8714, lng: 128.6014 },
      '대전': { lat: 36.3504, lng: 127.3845 },
      '광주': { lat: 35.1595, lng: 126.8526 },
      '울산': { lat: 35.5384, lng: 129.3114 },
      '세종': { lat: 36.4800, lng: 127.2890 }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const results = Object.entries(mockResults)
          .filter(([name]) => name.includes(query))
          .map(([title, position]) => ({ title, position }))
        resolve(results)
      }, 500) // 검색 지연 시뮬레이션
    })
  }

  // 시스템 제어
  handleRefreshSystemStatus = (): void => {
    // 시스템 상태 새로고침
    const randomHealth = Math.floor(Math.random() * 15) + 85 // 85-100
    const randomUsers = Math.floor(Math.random() * 1000) + 1000 // 1000-2000
    
    this.model.updateSystemStatus({
      systemHealth: randomHealth,
      connectedUsers: randomUsers,
      dataStreamStatus: randomHealth > 90 ? 'live' : randomHealth > 95 ? 'pending' : 'offline'
    })
  }

  // 측정 도구 (미래 구현을 위한 플레이스홀더)
  handleToggleMeasure = (): void => {
    console.log('Measure tool toggled')
    // 실제 구현에서는 측정 모드 토글
  }

  // 레이어 관리 (미래 구현을 위한 플레이스홀더)
  handleToggleLayers = (): void => {
    console.log('Layers panel toggled')
    // 실제 구현에서는 레이어 패널 토글
  }

  // 상태 조회
  getCurrentState = () => {
    return this.model.getState()
  }

  getSystemStatus = () => {
    return this.model.getSystemStatus()
  }

  // 실시간 업데이트 시작/중지
  startRealTimeUpdates = (): (() => void) => {
    return this.model.startRealTimeUpdates()
  }
}
