import React, { useState, useEffect } from 'react'
import OutdoorMap from './OutdoorMap'
import IndoorMap from './IndoorMap'
import { MapMode } from '@/app/model/types/MapTypes'
import { Button } from '@plug/ui'
import { useBuildingStore } from '../../../store/buildingStore'

const MainMap: React.FC = () => {
  // 초기 실외 지도 상태
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.OUTDOOR)
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null)
  
  // 스토어에서 선택된 빌딩 정보 가져오기 (각각 따로 호출)
  const selectedBuilding = useBuildingStore(state => state.selectedBuilding)
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding)
  const setSearchSelectedBuilding = useBuildingStore(state => state.setSearchSelectedBuilding)

  // 빌딩 선택 시 실내 지도로 전환 (Entity 클릭만)
  useEffect(() => {
    if (selectedBuilding) {
      console.log('Building Entity clicked, switching to indoor map:', selectedBuilding.facility.name)
      setSelectedBuildingId(selectedBuilding.facility.id)
      setMapMode(MapMode.INDOOR)
    }
  }, [selectedBuilding])

  // 빌딩 클릭 핸들러 (OutdoorMap에서 호출) - 이제 사용하지 않음 (selectedBuilding으로 처리)
  const handleBuildingClick = (buildingId: number, buildingName: string) => {
    console.log(`Building clicked: ${buildingName} (ID: ${buildingId})`)
    setSelectedBuildingId(buildingId)
    setMapMode(MapMode.INDOOR)
  }

  const toggleMapMode = () => {
    if (mapMode === MapMode.INDOOR) {
      // 실내 지도에서 실외 지도로 전환 시 선택된 빌딩 초기화
      setSelectedBuildingId(null)
      setSelectedBuilding(null) // Entity 클릭으로 선택된 빌딩 초기화
      setSearchSelectedBuilding(null) // 검색으로 선택된 빌딩도 초기화
    }
    setMapMode(prev => prev === MapMode.OUTDOOR ? MapMode.INDOOR : MapMode.OUTDOOR)
  }

  return (
    <div className="w-full h-full relative">
      {/* 지도 모드 토글 버튼 */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          onClick={toggleMapMode}
          variant="outline"
          className="bg-white/90 backdrop-blur-sm"
        >
          {mapMode === MapMode.OUTDOOR ? '실내 지도로 전환' : '실외 지도로 전환'}
        </Button>
        
        {/* 선택된 빌딩 정보 표시 */}
        {selectedBuilding && mapMode === MapMode.INDOOR && (
          <div className="mt-2 p-2 bg-white/90 backdrop-blur-sm rounded text-sm">
            선택된 빌딩: <strong>{selectedBuilding.facility.name}</strong>
          </div>
        )}
      </div>

      {mapMode === MapMode.OUTDOOR ? (
        <OutdoorMap onBuildingClick={handleBuildingClick} />
      ) : (
        <IndoorMap 
          buildingId={selectedBuildingId} 
          buildingData={selectedBuilding}
        />
      )}
    </div>
  )
}

export default MainMap
