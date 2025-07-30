import { useEffect, useRef, useState } from 'react';
import { Engine3D, Loader } from '@plug/engine/src';
import { FacilityResponse } from '@plug/common-services';

// Props 인터페이스 정의
interface IndoorMapProps {
  facilityData?: FacilityResponse | null;
}

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityData }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (containerRef.current && facilityData?.facility.drawing.url) {
        new Engine3D(containerRef.current);
        Loader.LoadGltf(facilityData.facility.drawing.url, 
          () => { setIsLoading(false); }); // 로딩 완료
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* 실내 지도 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-lg font-medium">실내 지도 로딩 중...</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}

export default IndoorMap
