import React, { useState } from 'react'
import IndoorMap from './IndoorMap'
import OutdoorMap from './OutdoorMap'
import { MapMode } from '@/app/model/types/MapTypes'
import { FacilityFactory } from '@plug/common-services'

const MainMap: React.FC = () => {
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.OUTDOOR)
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null)
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityFactory | null>(null)

  const handleFacilitySelect = (facilityId: number, facilityType: FacilityFactory) => {
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
