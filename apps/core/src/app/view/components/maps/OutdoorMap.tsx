import React, { useEffect, useState } from 'react'
import { useCesium } from 'resium'
import * as Cesium from 'cesium'
import VWorldMap from '@/global/components/maps/VWorldMap'
import MapControls from '@/global/components/maps/MapControls'

const OutdoorMap: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  
  const DEFAULT_COORDS = {
    latitude: 37.459722, 
    longitude: 127.023556,
    altitude: 1000
  };

  // 초기 카메라 위치 설정
  const InitialCameraSetup: React.FC = () => {
    const { viewer } = useCesium();

    useEffect(() => {
      if (!viewer) return;

      const camera = viewer.scene.camera;
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          DEFAULT_COORDS.longitude, 
          DEFAULT_COORDS.latitude, 
          DEFAULT_COORDS.altitude
        ),
        duration: 0,
        complete: () => {
          setIsLoading(false) // 카메라 이동 완료 후 로딩 종료
        }
      });
    }, [viewer]);

    return null;
  };

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
          <InitialCameraSetup />
        </VWorldMap>
      </div>
      
      <MapControls />
    </>
  )
}

export default OutdoorMap
