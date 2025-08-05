import React, { useState, useEffect } from 'react'
import IndoorMap from './IndoorMap'
import OutdoorMap from './OutdoorMap'
import { MapMode } from '@/app/model/types/MapTypes'
import type { FacilityType } from '@plug/common-services'
import { useFacilityStore } from '@/app/store/facilityStore'

const MainMap: React.FC = () => {
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.OUTDOOR)
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null)
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityType | null>(null)
  
  // MainMap에서 한 번만 데이터 페칭
  const { facilitiesFetched, loadFacilities } = useFacilityStore()

  useEffect(() => {
    if (!facilitiesFetched) {
      loadFacilities()
    }
  }, [facilitiesFetched, loadFacilities])

  const handleFacilitySelect = (facilityId: number, facilityType: FacilityType) => {
    setSelectedFacilityId(facilityId)
    setSelectedFacilityType(facilityType)
    setMapMode(MapMode.INDOOR)
  }

  const toggleMapMode = () => {
    if (mapMode === MapMode.INDOOR) {
      setMapMode(MapMode.OUTDOOR)
      setSelectedFacilityId(null)
      setSelectedFacilityType(null)
    }
  }

  return (
    <div className="w-full h-full relative">
      {mapMode === MapMode.OUTDOOR && (
        <OutdoorMap 
          onFacilitySelect={handleFacilitySelect} 
        />
      )}
      
      {mapMode === MapMode.INDOOR && selectedFacilityId && selectedFacilityType && (
        <IndoorMap 
          facilityId={selectedFacilityId}
          facilityType={selectedFacilityType}
          onOutdoorButtonClick={toggleMapMode}
        />
      )}
    </div>
  )
}

export default MainMap
