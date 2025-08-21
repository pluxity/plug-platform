import React, { useState, useEffect, useCallback } from 'react'
import IndoorMap from './IndoorMap'
import OutdoorMap from './OutdoorMap'
import { MapMode } from '@/app/model/types/MapTypes'
import type { FacilityType } from '@plug/common-services'
import { useFacilityStore } from '@/app/store/facilityStore'

const MainMap: React.FC = () => {
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.OUTDOOR)
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null)
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityType | null>(null)
  const { facilitiesFetched, loadFacilities } = useFacilityStore()

  useEffect(() => {
    if (!facilitiesFetched) {
      loadFacilities()
    }
  }, [facilitiesFetched, loadFacilities])

  const goOutdoor = useCallback(() => {
    setMapMode(MapMode.OUTDOOR)
    setSelectedFacilityId(null)
    setSelectedFacilityType(null)
  }, [])

  useEffect(() => {
    const handler = () => {
      goOutdoor()
    }
    window.addEventListener('indoor:goOutdoor', handler)
    return () => window.removeEventListener('indoor:goOutdoor', handler)
  }, [goOutdoor])

  const handleFacilitySelect = (facilityId: number, facilityType: FacilityType) => {
    setSelectedFacilityId(facilityId)
    setSelectedFacilityType(facilityType)
    setMapMode(MapMode.INDOOR)
  }

  return (
    <>
      {mapMode === MapMode.OUTDOOR && (
        <OutdoorMap 
          onFacilitySelect={handleFacilitySelect} 
        />
      )}
      
      {mapMode === MapMode.INDOOR && selectedFacilityId && selectedFacilityType && (
        <IndoorMap 
          facilityId={selectedFacilityId}
          facilityType={selectedFacilityType}
          onGoOutdoor={goOutdoor}
        />
      )}
    </>
  )
}

export default MainMap
