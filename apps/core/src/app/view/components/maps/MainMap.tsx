import React, { useState, useEffect } from 'react'
import OutdoorMap from './OutdoorMap'
import IndoorMap from './IndoorMap'
import { MapMode } from '@/app/model/types/MapTypes'
import { Button } from '@plug/ui'
import { useBuildingStore } from '../../../store/buildingStore'

const MainMap: React.FC = () => {
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.OUTDOOR)
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null)
  const [outdoorMapMounted, setOutdoorMapMounted] = useState<boolean>(true)
  
  const selectedBuilding = useBuildingStore(state => state.selectedBuilding)
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding)
  const setSearchSelectedBuilding = useBuildingStore(state => state.setSearchSelectedBuilding)

  useEffect(() => {
    if (selectedBuilding) {
      setSelectedBuildingId(selectedBuilding.facility.id)
      setMapMode(MapMode.INDOOR)
    }
  }, [selectedBuilding])

  const handleBuildingClick = (buildingId: number) => {
    setSelectedBuildingId(buildingId)
    setMapMode(MapMode.INDOOR)
  }

  const toggleMapMode = () => {
    if (mapMode === MapMode.INDOOR) {
      // 실내 → 실외 전환
      setSelectedBuildingId(null)
      setSelectedBuilding(null) 
      setSearchSelectedBuilding(null)
      setMapMode(MapMode.OUTDOOR)
      // OutdoorMap을 다시 마운트하여 새로운 인스턴스 생성
      setOutdoorMapMounted(false)
      // 다음 렌더링 사이클에서 다시 마운트
      requestAnimationFrame(() => {
        setOutdoorMapMounted(true)
      })
    } else {
      // 실외 → 실내 전환 (빌딩이 선택된 경우에만)
      if (selectedBuildingId) {
        setMapMode(MapMode.INDOOR)
      }
    }
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-50">
        <Button
          onClick={toggleMapMode}
          variant="outline"
          className="bg-white/90 backdrop-blur-sm"
        >
          {mapMode === MapMode.OUTDOOR ? '실내 지도로 전환' : '실외 지도로 전환'}
        </Button>
      </div>

      {mapMode === MapMode.OUTDOOR ? (
        outdoorMapMounted && <OutdoorMap key="outdoor-map" onBuildingClick={handleBuildingClick} />
      ) : (
        <IndoorMap 
          key="indoor-map"
          buildingId={selectedBuildingId} 
          buildingData={selectedBuilding}
        />
      )}
    </div>
  )
}

export default MainMap
