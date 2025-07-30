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
      // 실내→실외는 별도 로딩 없이 실외 지도의 로딩화면 사용
      
      // 현재 선택된 시설의 좌표 저장
      if (selectedFacility && selectedFacility.lon !== undefined && selectedFacility.lat !== undefined) {
        setFacilityCoords({ lon: selectedFacility.lon, lat: selectedFacility.lat })
      }
      
      setMapMode(MapMode.OUTDOOR)
      setSelectedFacilityId(null)
      setSelectedFacility(null) // selectedFacility도 초기화
    } 
  }

  // 실외 지도로 전환된 후 facilityCoords 초기화
  React.useEffect(() => {
    if (mapMode === MapMode.OUTDOOR && facilityCoords) {
      const timer = setTimeout(() => {
        setFacilityCoords(null)
      }, 2500) // 카메라 이동 완료 후 초기화
      
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
