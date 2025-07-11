import React, { useState, useEffect } from 'react'
import { MapController } from '@/app/controller/MapController'
import { MapModel } from '@/app/model/MapModel'
import { MapComponent, ControlPanel, StatusPanel } from '@/app/view/components'
import { MapState, SystemStatus } from '@/app/model/types/MapTypes'

const MapView: React.FC = () => {
  // MVC 인스턴스 생성
  const [mapModel] = useState(() => new MapModel())
  const [mapController] = useState(() => new MapController(mapModel))
  
  // 상태 관리
  const [mapState, setMapState] = useState<MapState>(() => mapModel.getState())
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(() => mapModel.getSystemStatus())

  useEffect(() => {
    // Model의 상태 변경을 구독
    const unsubscribe = mapModel.subscribe(() => {
      setMapState(mapModel.getState())
      setSystemStatus(mapModel.getSystemStatus())
    })

    // 실시간 업데이트 시작
    const stopRealTimeUpdates = mapController.startRealTimeUpdates()

    return () => {
      unsubscribe()
      stopRealTimeUpdates()
    }
  }, [mapModel, mapController])

  // Controller 메서드들을 View에서 호출
  const handleCenterMap = () => {
    mapController.handleCenterMap()
  }

  const handleZoomIn = () => {
    mapController.handleZoomIn()
  }

  const handleZoomOut = () => {
    mapController.handleZoomOut()
  }

  const handleAddMarker = () => {
    mapController.handleAddMarker('poi')
  }

  const handleSearchLocation = async (query: string) => {
    try {
      await mapController.handleSearchLocation(query)
    } catch (error) {
      console.error('Search failed:', error)
      // 실제 앱에서는 toast 알림 등을 표시
    }
  }

  const handleToggleMeasure = () => {
    mapController.handleToggleMeasure()
  }

  const handleToggleLayers = () => {
    mapController.handleToggleLayers()
  }

  const handleRefreshStatus = () => {
    mapController.handleRefreshSystemStatus()
  }

  return (
    <div className="h-full relative">
      <MapComponent
        mapState={mapState}
        onCenterMap={handleCenterMap}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onAddMarker={handleAddMarker}
        onSearchLocation={handleSearchLocation}
      />
      
      <ControlPanel
        onCenterMap={handleCenterMap}
        onToggleMeasure={handleToggleMeasure}
        onToggleLayers={handleToggleLayers}
        onRefreshStatus={handleRefreshStatus}
      />
      
      <StatusPanel systemStatus={systemStatus} />
    </div>
  )
}

export default MapView
