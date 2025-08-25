import React, { useState, useEffect, useRef } from 'react'
import * as Cesium from 'cesium'
import { useFacilityStore } from '@/app/store/facilityStore'
import type { FacilityType } from '@plug/common-services'
import { VWorldMap, MapControls } from '@/global/components/outdoor-map'
import FacilityPOIs from './FacilityPOIs'
import FacilitySearchForm from './FacilitySearchForm'

interface OutdoorMapProps {
  onFacilitySelect?: (facilityId: number, facilityType: FacilityType) => void;
}

const OutdoorMap: React.FC<OutdoorMapProps> = ({ onFacilitySelect }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [cesiumViewer, setCesiumViewer] = useState<Cesium.Viewer | null>(null)
  const initialCameraSetRef = useRef(false)

  const YONGSAN_GU_OFFICE_LAT = 37.5323
  const YONGSAN_GU_OFFICE_LON = 126.9903

  const facilitiesFetched = useFacilityStore(s => s.facilitiesFetched)
  const loadFacilities = useFacilityStore(s => s.loadFacilities)
  useEffect(() => {
    if (!facilitiesFetched) {
      loadFacilities()
    }
  }, [facilitiesFetched, loadFacilities])

  useEffect(() => {
    if (!cesiumViewer || initialCameraSetRef.current) return

    // 타겟(용산구청) 지점 (지표 고도 0 가정)
    const target = Cesium.Cartesian3.fromDegrees(
      YONGSAN_GU_OFFICE_LON,
      YONGSAN_GU_OFFICE_LAT,
      0
    )

    // 원하는 시야 각도 및 고도 느낌 설정
    const pitchDeg = -35
    const desiredAltitude = 2500 // 눈으로 보이는 고도 느낌
    // range = altitude / sin(|pitch|)
    const range = desiredAltitude / Math.sin(Math.abs(pitchDeg) * Math.PI / 180)

    const offset = new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(0), // 남쪽 위치 -> 북쪽(위쪽) 바라봄
      Cesium.Math.toRadians(pitchDeg),
      range
    )

    cesiumViewer.camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(target, 60),
      {
        offset,
        duration: 1.2,
        maximumHeight: 10000,
        complete: () => {
          initialCameraSetRef.current = true
        },
      }
    )
  }, [cesiumViewer])

  const handleInitialLoadComplete = () => {
    setIsLoading(false)
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium">실외 지도 로딩 중...</span>
          </div>
        </div>
      )}
      
      {facilitiesFetched && (
        <div className="absolute top-4 left-4 z-40">
          <FacilitySearchForm viewer={cesiumViewer} />
        </div>
      )}
      
        <VWorldMap className="w-full h-full">
          <MapControls onInitialLoadComplete={handleInitialLoadComplete} />
          {facilitiesFetched && (
            <FacilityPOIs onFacilitySelect={onFacilitySelect} onViewerReady={setCesiumViewer} />
          )}
      </VWorldMap>
    </div>
  )
}

export default OutdoorMap
