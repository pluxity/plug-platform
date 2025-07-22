import { useEffect, useRef } from 'react';
import { Camera, Engine3D, Loader } from '@plug/engine/src';
import type { BuildingResponse } from '@plug/common-services'

// Props 인터페이스 정의
interface IndoorMapProps {
  buildingId?: number | null;
  buildingData?: BuildingResponse | null;
}

const IndoorMap: React.FC<IndoorMapProps> = ({ buildingId, buildingData }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
      if (containerRef.current) {
          new Engine3D(containerRef.current);
          
          if (buildingData && buildingData.facility.drawing?.url) {
            Loader.LoadGltf(buildingData.facility.drawing.url, 
              () => {
                Camera.ExtendView(1);
              });
          } else {
            Loader.LoadGltf('http://192.168.4.8/files/plug-platform/temp/971c9ce1-ea4d-4538-a1d7-dccbe1e02c5d/80c3c2d6.glb', 
              () => {
                Camera.ExtendView(1);
              });
          }
      }
  }, [buildingId, buildingData]);

  return (
    <div className="w-full h-full relative">
      {/* 빌딩 정보 표시 */}
      {buildingData && (
        <div className="absolute top-4 right-4 z-10 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <h3 className="font-bold text-lg">{buildingData.facility.name}</h3>
          <p className="text-sm text-gray-600">빌딩 ID: {buildingData.facility.id}</p>
          {buildingData.facility.drawing?.url && (
            <p className="text-xs text-green-600 mt-1">✓ 실내 지도 로드됨</p>
          )}
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}

export default IndoorMap
