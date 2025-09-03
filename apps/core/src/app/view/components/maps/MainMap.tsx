import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import IndoorMap from './IndoorMap'
import OutdoorMap from './OutdoorMap'
import type { FacilityType } from '@plug/common-services'
import { useEnsureFacilities } from '@/app/hooks/useEnsureFacilities'

enum MapMode {
  OUTDOOR = 'outdoor',
  INDOOR = 'indoor'
}

const MainMap: React.FC = () => {
  const location = useLocation()
  const navState = location.state as { facilityId?: number; facilityType?: FacilityType; mode?: string } | null

  // 초기 렌더에서 바로 실내 진입 요청이 들어온 경우(뒤로가기 등) OutdoorMap → IndoorMap 빠른 unmount race를 방지
  const initialIsIndoor = !!(navState?.mode === 'indoor' && navState.facilityId && navState.facilityType)
  const [mapMode, setMapMode] = useState<MapMode>(initialIsIndoor ? MapMode.INDOOR : MapMode.OUTDOOR)
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(initialIsIndoor ? navState?.facilityId ?? null : null)
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityType | null>(initialIsIndoor ? navState?.facilityType ?? null : null)
  useEnsureFacilities({ revalidateIfStale: true })
  const navigate = useNavigate()

  // Facilities ensured via hook above.

  // location.state 를 초기화(히스토리 정리) - 첫 렌더에서 이미 반영했다면 한 번만 replace
  useEffect(() => {
    if (initialIsIndoor && location.state) {
      navigate(location.pathname, { replace: true })
    }
    // initialIsIndoor, location.pathname, navigate 만 의존 (location.state 사용 시 무한 루프 가능)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIsIndoor, location.pathname, navigate])

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
