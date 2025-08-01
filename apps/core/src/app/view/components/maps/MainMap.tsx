import React, { useState } from 'react'
import IndoorMap from './IndoorMap'
import OutdoorMap from './OutdoorMap'
import { MapMode } from '@/app/model/types/MapTypes'
import { Button } from '@plug/ui'
import { FacilityFactory } from '@plug/common-services'

const MainMap: React.FC = () => {
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.OUTDOOR)
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null)
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityFactory | null>(null)
  const [outdoorMapKey, setOutdoorMapKey] = useState(0) // OutdoorMap 강제 리마운트용

  const handleFacilitySelect = (facilityId: number, facilityType: FacilityFactory) => {
    // 실내 진입 시 OutdoorMap의 entities 정리
    setSelectedFacilityId(facilityId)
    setSelectedFacilityType(facilityType)
    setMapMode(MapMode.INDOOR)
    
    // OutdoorMap 컴포넌트가 언마운트되기 전에 entities 정리를 위해 key 변경
    setOutdoorMapKey(prev => prev + 1)
  }

  const toggleMapMode = () => {
    if (mapMode === MapMode.INDOOR) {
      setMapMode(MapMode.OUTDOOR)
      setSelectedFacilityId(null)
      setSelectedFacilityType(null)
      // OutdoorMap 강제 리마운트로 entity 중복 방지
      setOutdoorMapKey(prev => prev + 1)
    }
  }

  return (
    <div className="w-full h-full relative">
      {mapMode === MapMode.INDOOR && (
        <Button
          onClick={toggleMapMode}
          variant="outline"
          className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm"
        >
          실외 지도로 전환
        </Button>
      )}

      {mapMode === MapMode.OUTDOOR && (
        <OutdoorMap 
          key={outdoorMapKey} 
          onFacilitySelect={handleFacilitySelect} 
        />
      )}
      
      {mapMode === MapMode.INDOOR && selectedFacilityId && selectedFacilityType && (
        <IndoorMap 
          facilityId={selectedFacilityId}
          facilityType={selectedFacilityType}
        />
      )}
    </div>
  )
}

export default MainMap
