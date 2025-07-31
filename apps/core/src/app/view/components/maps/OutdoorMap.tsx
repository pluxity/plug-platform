import React, { useState, useEffect } from 'react'
import { useCesium } from 'resium'
import * as Cesium from 'cesium'
import VWorldMap from '@/global/components/maps/VWorldMap'
import MapControls from '@/global/components/maps/MapControls'
import { useFacilityStore } from '@/app/store/facilityStore'
import type { BaseFacilityResponse } from '@plug/common-services'

const OutdoorMap: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { facilities, facilitiesFetched, loadFacilities } = useFacilityStore()

  // facilities 데이터 로드
  useEffect(() => {
    if (!facilitiesFetched) {
      loadFacilities()
    }
  }, [facilitiesFetched, loadFacilities])

  const handleInitialLoadComplete = () => {
    setIsLoading(false)
  }

  // POI Entity 생성 컴포넌트
  const FacilityPOIs: React.FC = () => {
    const { viewer } = useCesium()

    useEffect(() => {
      if (!viewer || !facilitiesFetched) return

      const allFacilities = Object.values(facilities).flat().filter(Boolean) as BaseFacilityResponse[]
      
      // Cesium Ion 토큰 설정
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNWJmZWEzOS1jMTJjLTQ0ZTYtOTFkNC1jZDMxMDlmYTRjMWEiLCJpZCI6MjgzMTA2LCJpYXQiOjE3NDE2NjE3OTR9.dZID1nZdOJeEv18BhwGwWlAjJQtWAFUDipJw7M4r0-w'

      // POI 생성 함수
      const createPOIs = async () => {
        // 3D 모델 리소스 로드
        const resource = await Cesium.IonResource.fromAssetId(3589754)

        allFacilities.forEach((facility) => {
          if (facility.lat && facility.lon) {
            const position = Cesium.Cartesian3.fromDegrees(
              facility.lon,
              facility.lat,
              0 // 지면 높이
            )

            viewer.entities.add({
              id: `facility-${facility.id}`,
              name: facility.name,
              position: position,
              model: {
                uri: resource,
                scale: 5.0, // 기본 1.0에서 5.0으로 증가
              },
              properties: {
                facilityId: facility.id,
                facilityData: facility
              }
            })
          }
        })
      }

      // POI 생성 실행
      createPOIs().catch(error => {
        console.error('POI 생성 중 오류 발생:', error)
      })

      // 정리 함수
      return () => {
        // 컴포넌트 언마운트 시 POI entities 제거
        allFacilities.forEach((facility) => {
          const entity = viewer.entities.getById(`facility-${facility.id}`)
          if (entity) {
            viewer.entities.remove(entity)
          }
        })
      }
    }, [viewer])

    return null
  }

  return (
    <>
      {/* 실외 지도 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-lg font-medium">실외 지도 로딩 중...</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full h-full">
        <VWorldMap className="w-full h-full relative">
          <MapControls onInitialLoadComplete={handleInitialLoadComplete} />
          <FacilityPOIs />
        </VWorldMap>
      </div>
    </>
  )
}

export default OutdoorMap
