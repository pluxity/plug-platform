import React, { useState } from 'react'
import IndoorMap from './IndoorMap'
import OutdoorMap from './OutdoorMap'
import MapLoadingOverlay from '@/global/components/maps/MapLoadingOverlay'
import { MapMode } from '@/app/model/types/MapTypes'
import { Button } from '@plug/ui'
import { useMapLoadingStore } from '@/app/store/mapLoadingStore'
import { useFacilityStore } from '@/app/store/facilityStore'
import { FacilityResponse } from '@plug/common-services'

const MainMap: React.FC = () => {

  const [mapMode, setMapMode] = useState<MapMode>(MapMode.OUTDOOR)
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null)

  const { startTransition } = useMapLoadingStore();
  const { selectedFacility } = useFacilityStore();

  const toggleMapMode = () => {
    if (mapMode === MapMode.INDOOR) {
      startTransition('indoor', 'outdoor');
      setMapMode(MapMode.OUTDOOR)
      setSelectedFacilityId(null)
    } 
  }

  const handleFacilityClick = (facilityId: number) => {
    setSelectedFacilityId(facilityId)
    setMapMode(MapMode.INDOOR)
  }

  // selectedFacility가 변경되면 실내 지도로 전환
  React.useEffect(() => {
    if (selectedFacility && mapMode === MapMode.OUTDOOR) {
      setSelectedFacilityId(selectedFacility.id)
      setMapMode(MapMode.INDOOR)
    }
  }, [selectedFacility, mapMode])

  return (
    <div className="w-full h-full relative">
      {/* 로딩 오버레이 */}
      <MapLoadingOverlay />
      
      {mapMode === MapMode.INDOOR ? (
        <Button
          onClick={toggleMapMode}
          variant="outline"
          className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm"
        >
          실외 지도로 전환
        </Button>
      ) : null}

      <div className={`w-full h-full ${mapMode === MapMode.OUTDOOR ? 'block' : 'hidden'}`}>
        <OutdoorMap onFacilityClick={handleFacilityClick} />
      </div>
      
      {mapMode === MapMode.INDOOR && (
        <div className="w-full h-full">
          <IndoorMap 
            key="indoor-map" 
            facilityId={selectedFacilityId} 
            facilityData={selectedFacility ? { facility: selectedFacility } as FacilityResponse : null} 
          />
        </div>
      )}
    </div>
  )
}

export default MainMap
