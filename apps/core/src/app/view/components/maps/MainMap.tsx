import React, { useState } from 'react'
import IndoorMap from './IndoorMap'
import OutdoorMap from './OutdoorMap'
import { MapMode } from '@/app/model/types/MapTypes'
import { Button } from '@plug/ui'
import { useFacilityStore } from '@/app/store/facilityStore'
import { FacilityResponse } from '@plug/common-services'

const MainMap: React.FC = () => {

  const [mapMode, setMapMode] = useState<MapMode>(MapMode.OUTDOOR)
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null)
  const [facilityCoords, setFacilityCoords] = useState<{ lon: number; lat: number } | null>(null)

  const { selectedFacility, setSelectedFacility } = useFacilityStore();

  const toggleMapMode = () => {
    if (mapMode === MapMode.INDOOR) {
      if (selectedFacility && selectedFacility.lon !== undefined && selectedFacility.lat !== undefined) {
        setFacilityCoords({ lon: selectedFacility.lon, lat: selectedFacility.lat })
      }
      
      setMapMode(MapMode.OUTDOOR)
      setSelectedFacilityId(null)
      setSelectedFacility(null)
    } 
  }

  React.useEffect(() => {
    if (mapMode === MapMode.OUTDOOR && facilityCoords) {
      const timer = setTimeout(() => {
        setFacilityCoords(null)
      }, 2500)
      
      return () => clearTimeout(timer)
    }
  }, [mapMode, facilityCoords])

  return (
    <div className="w-full h-full relative">
      {mapMode === MapMode.INDOOR ? (
        <Button
          onClick={toggleMapMode}
          variant="outline"
          className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm"
        >
          실외 지도로 전환
        </Button>
      ) : null}

      {mapMode === MapMode.OUTDOOR && (
        <div className="w-full h-full">
          <OutdoorMap 
            key={facilityCoords ? `${facilityCoords.lon}-${facilityCoords.lat}` : 'outdoor-map'}
          />
        </div>
      )}
      
      {mapMode === MapMode.INDOOR && selectedFacilityId && (
        <div className="w-full h-full">
          <IndoorMap 
            key="indoor-map"
            facilityData={selectedFacility ? { facility: selectedFacility } as FacilityResponse : null} 
          />
        </div>
      )}
    </div>
  )
}

export default MainMap
