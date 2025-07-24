import {  useEffect, useRef } from 'react';
import { useMapLoadingStore } from '@/app/store/mapLoadingStore';
import { Engine3D, Loader } from '@plug/engine/src';

// Props 인터페이스 정의
interface IndoorMapProps {
  facilityId?: number;
}

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityId}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // 로딩을 끝내줘
  const { endTransition } = useMapLoadingStore();
  useEffect(() => {
    if (containerRef.current) {
        new Engine3D(containerRef.current);
        Loader.LoadGltf(facilityData?.facility.drawing.url ?? '', 
          () => { endTransition(); },);
    }
  }, [endTransition, facilityId, facilityData]);

  return (
    <div className="w-full h-full relative">      
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}

export default IndoorMap
