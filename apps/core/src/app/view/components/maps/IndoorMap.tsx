import {  useEffect, useRef } from 'react';
import { useMapLoadingStore } from '@/app/store/mapLoadingStore';
import { Engine3D, Loader } from '@plug/engine/src';
import { FacilityResponse } from '@plug/common-services';

// Props 인터페이스 정의
interface IndoorMapProps {
  facilityData?: FacilityResponse | null;
}

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityData }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // 로딩을 끝내줘
  const { endTransition } = useMapLoadingStore();
  useEffect(() => {
    if (containerRef.current && facilityData?.facility.drawing.url) {
        new Engine3D(containerRef.current);
        Loader.LoadGltf(facilityData.facility.drawing.url, 
          () => { endTransition(); });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full relative">      
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}

export default IndoorMap
