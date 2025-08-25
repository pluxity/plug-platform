import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!facilitiesFetched) {
      loadFacilities()
    }
  }, [facilitiesFetched, loadFacilities])

  // location.state 통한 초기 실내 지도 진입 지원
  useEffect(() => {
    const state = location.state as { facilityId?: number; facilityType?: FacilityType; mode?: string } | null
    if (state?.mode === 'indoor' && state.facilityId && state.facilityType) {
      setSelectedFacilityId(state.facilityId)
      setSelectedFacilityType(state.facilityType)
      setMapMode(MapMode.INDOOR)
      // 일회성 처리를 위해 history state 제거 (URL / state 정리)
      navigate(location.pathname, { replace: true })
    }
  }, [location, navigate])

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
