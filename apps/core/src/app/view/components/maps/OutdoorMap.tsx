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

        // Cesium 시계 활성화 및 애니메이션 시작
        viewer.clock.shouldAnimate = true
        viewer.clock.multiplier = 1

        allFacilities.forEach((facility) => {
          if (facility.lat && facility.lon) {
            const position = Cesium.Cartesian3.fromDegrees(
              facility.lon,
              facility.lat,
              0 // 지면 높이
            )

            // 회전 애니메이션을 위한 CallbackProperty
            const rotationCallback = new Cesium.CallbackProperty(() => {
              const time = Date.now() / 1000; // 현재 시간을 초 단위로
              // 15초에 한 바퀴 회전 (더 천천히)
              const angle = (time * Math.PI * 2) / 15;
              return Cesium.Transforms.headingPitchRollQuaternion(
                position,
                new Cesium.HeadingPitchRoll(angle, 0, 0)
              );
            }, false);

            // 거리 기반 스케일 CallbackProperty
            const scaleCallback = new Cesium.CallbackProperty(() => {
              const cameraPosition = viewer.camera.position
              const distance = Cesium.Cartesian3.distance(cameraPosition, position)
              
              // 거리에 따른 스케일 조정
              // 가까이: 10.0, 멀리: 최대 25.0
              const baseScale = 10.0
              const maxScale = 25.0
              const scaleDistance = 5000 // 5km 거리를 기준
              
              const scaleFactor = Math.min(distance / scaleDistance, 2.5)
              return baseScale + (scaleFactor * (maxScale - baseScale) / 2.5)
            }, false)

            viewer.entities.add({
              id: `facility-${facility.id}`,
              name: facility.name,
              position: position,
              orientation: rotationCallback,
              model: {
                uri: resource,
                scale: scaleCallback, // 동적 스케일 적용
                color: Cesium.Color.WHITE, // 기본 색상
                silhouetteColor: Cesium.Color.YELLOW, // 실루엣 색상
                silhouetteSize: new Cesium.ConstantProperty(0), // 기본적으로는 실루엣 없음
              },
              properties: {
                facilityId: facility.id,
                facilityData: facility
              }
            })
          }
        })

        // POI 생성 후 마우스 이벤트 핸들러 설정
        console.log('Setting up mouse events...') // 디버깅 로그
        let hoveredEntity: Cesium.Entity | null = null

        // 더 간단한 마우스 이벤트 테스트
        viewer.canvas.addEventListener('mousemove', (event: MouseEvent) => {
          console.log('Canvas mouse move detected!', event) // 기본 이벤트 감지
          
          const canvasPosition = new Cesium.Cartesian2(event.clientX, event.clientY)
          
          try {
            const pickedObject = viewer.scene.pick(canvasPosition)
            console.log('Canvas pick result:', pickedObject) // pick 결과 확인
            
            // 이전에 호버된 entity의 실루엣 제거
            if (hoveredEntity?.model) {
              hoveredEntity.model.silhouetteSize = new Cesium.ConstantProperty(0)
            }

            if (pickedObject && pickedObject.id) {
              console.log('Canvas picked object ID:', pickedObject.id.id) // 디버깅 로그
              
              // facility POI인지 확인
              if (pickedObject.id.id && pickedObject.id.id.startsWith('facility-')) {
                console.log('Canvas Facility POI detected!', pickedObject.id.id) // 디버깅 로그
                
                // 새로운 entity에 실루엣 추가
                hoveredEntity = pickedObject.id
                if (hoveredEntity?.model) {
                  hoveredEntity.model.silhouetteSize = new Cesium.ConstantProperty(3.0)
                }
                // 커서를 포인터로 변경
                viewer.canvas.style.cursor = 'pointer'
              } else {
                hoveredEntity = null
                viewer.canvas.style.cursor = 'default'
              }
            } else {
              hoveredEntity = null
              // 커서를 기본값으로 변경
              viewer.canvas.style.cursor = 'default'
            }
          } catch (error) {
            console.warn('Canvas mouse move event error:', error)
          }
        })

        // 추가로 Cesium의 기본 이벤트도 시도
        viewer.screenSpaceEventHandler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
          console.log('Cesium mouse movement detected!', movement) // 기본 마우스 움직임 감지 테스트
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
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
