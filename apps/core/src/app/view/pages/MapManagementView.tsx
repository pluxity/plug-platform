import React, { useState, useEffect } from 'react'
import { MapController } from '@/app/controller/MapController'
import { MapModel } from '@/app/model/MapModel'
import { MapComponent, ControlPanel, StatusPanel, MarkerList } from '@/app/view/components'
import { MapState, SystemStatus, MapMarker } from '@/app/model/types/MapTypes'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@plug/ui'

const MapManagementView: React.FC = () => {
  // MVC 인스턴스 생성
  const [mapModel] = useState(() => new MapModel())
  const [mapController] = useState(() => new MapController(mapModel))
  
  // 상태 관리
  const [mapState, setMapState] = useState<MapState>(() => mapModel.getState())
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(() => mapModel.getSystemStatus())
  const [showMarkerPanel, setShowMarkerPanel] = useState(false)

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

  // 기본 지도 컨트롤 메서드들
  const handleCenterMap = () => {
    mapController.handleCenterMap()
  }

  const handleZoomIn = () => {
    mapController.handleZoomIn()
  }

  const handleZoomOut = () => {
    mapController.handleZoomOut()
  }

  const handleSearchLocation = async (query: string) => {
    try {
      await mapController.handleSearchLocation(query)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  // 마커 관리 메서드들
  const handleAddMarker = (type: MapMarker['type'] = 'poi') => {
    mapController.handleAddMarker(type)
  }

  const handleMarkerClick = (marker: MapMarker) => {
    // 마커 클릭시 해당 위치로 이동
    mapModel.updateCenter(marker.position)
    mapModel.updateZoom(15)
  }

  const handleMarkerStatusChange = (id: string, status: MapMarker['status']) => {
    mapController.handleUpdateMarkerStatus(id, status)
  }

  const handleRemoveMarker = (id: string) => {
    mapController.handleRemoveMarker(id)
  }

  // 기타 컨트롤 메서드들
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
        onAddMarker={() => handleAddMarker('poi')}
        onSearchLocation={handleSearchLocation}
      />
      
      <ControlPanel
        onCenterMap={handleCenterMap}
        onToggleMeasure={handleToggleMeasure}
        onToggleLayers={handleToggleLayers}
        onRefreshStatus={handleRefreshStatus}
      />
      
      <StatusPanel systemStatus={systemStatus} />

      {/* 마커 관리 패널 토글 버튼 */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          onClick={() => setShowMarkerPanel(!showMarkerPanel)}
          className="bg-white bg-opacity-90 backdrop-blur-sm"
        >
          {showMarkerPanel ? '📍 Hide Markers' : '📍 Show Markers'}
        </Button>
      </div>

      {/* 마커 관리 패널 */}
      {showMarkerPanel && (
        <div className="absolute top-16 left-4 w-80 max-h-[calc(100vh-8rem)] overflow-hidden">
          <div className="space-y-4">
            {/* 마커 추가 패널 */}
            <Card className="bg-white bg-opacity-90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Add Markers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleAddMarker('poi')}>
                    📍 POI
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddMarker('station')}>
                    🚇 Station
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddMarker('checkpoint')}>
                    🎯 Checkpoint
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddMarker('warning')}>
                    ⚠️ Warning
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 마커 목록 */}
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg">
              <MarkerList
                markers={mapState.markers}
                onMarkerClick={handleMarkerClick}
                onMarkerStatusChange={handleMarkerStatusChange}
                onRemoveMarker={handleRemoveMarker}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapManagementView
