import { useEffect, useRef, useState } from 'react';
import { Engine3D, Loader } from '@plug/engine/src';
import { useDetailSWR, FacilityFactory } from '@plug/common-services';
import { FloorControl } from './FloorControl';

interface IndoorMapViewerProps {
  facilityId: number;
  facilityType: FacilityFactory;
  showFloorControl?: boolean;
  floorControlPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  onEngineReady?: (engine: Engine3D) => void;
}

export const IndoorMapViewer: React.FC<IndoorMapViewerProps> = ({ 
  facilityId,
  facilityType,
  showFloorControl = true,
  floorControlPosition = 'bottom-right',
  className = "w-full h-full", 
  onEngineReady 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engine3DRef = useRef<Engine3D | null>(null);
  const loadedModelUrlRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: facilityData, error, isLoading: isDataLoading } = useDetailSWR(facilityType, facilityId, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 60000 * 10,
  });

  const modelUrl = facilityData?.facility.drawing.url;

  useEffect(() => {
    const currentContainer = containerRef.current;
    
    if (!modelUrl) {
      setIsLoading(false);
      return;
    }
    
    if (loadedModelUrlRef.current === modelUrl && engine3DRef.current) {
      setIsLoading(false);
      if (onEngineReady && engine3DRef.current) {
        onEngineReady(engine3DRef.current);
      }
      return;
    }
    
    if (engine3DRef.current && loadedModelUrlRef.current !== modelUrl) {
      try {
        engine3DRef.current.Renderer.dispose();
        while(engine3DRef.current.RootScene.children.length > 0) {
          const child = engine3DRef.current.RootScene.children[0];
          engine3DRef.current.RootScene.remove(child);
          
          const mesh = child as unknown as {
            geometry?: { dispose: () => void };
            material?: { dispose: () => void } | Array<{ dispose: () => void }>;
          };
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat) => mat.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
        
        if (engine3DRef.current.Renderer.domElement.parentNode === currentContainer) {
          currentContainer?.removeChild(engine3DRef.current.Renderer.domElement);
        }
      } catch (error) {
        console.warn('Engine3D cleanup error:', error);
      }
      engine3DRef.current = null;
      loadedModelUrlRef.current = null;
    }
    
    if (currentContainer && modelUrl && !engine3DRef.current) {
      setIsLoading(true);
      const engine = new Engine3D(currentContainer);
      engine3DRef.current = engine;
      
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 10000);
      
      Loader.LoadGltf(modelUrl, () => {
        clearTimeout(timeoutId);
        setIsLoading(false);
        loadedModelUrlRef.current = modelUrl;
        if (onEngineReady) {
          onEngineReady(engine);
        }
      });
    }

    return () => {
      if (engine3DRef.current) {
        try {
          engine3DRef.current.Renderer.dispose();
          while(engine3DRef.current.RootScene.children.length > 0) {
            const child = engine3DRef.current.RootScene.children[0];
            engine3DRef.current.RootScene.remove(child);
          }
          if (engine3DRef.current.Renderer.domElement.parentNode === currentContainer) {
            currentContainer?.removeChild(engine3DRef.current.Renderer.domElement);
          }
        } catch (error) {
          console.warn('Engine3D cleanup error:', error);
        }
        engine3DRef.current = null;
        loadedModelUrlRef.current = null;
      }
    };
  }, [modelUrl, onEngineReady]);

  // 에러 처리
  if (error) {
    return (
      <div className={`${className} relative bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center`}>
        <div className="bg-white border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-lg max-w-md mx-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">오류가 발생했습니다</h3>
              <p className="text-sm mt-1">시설 정보를 불러오는데 실패했습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3D 도면이 없는 경우
  if (facilityData && !facilityData.facility.drawing.url) {
    return (
      <div className={`${className} relative bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center`}>
        <div className="bg-white border border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl shadow-lg max-w-md mx-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">3D 도면이 없습니다</h3>
              <p className="text-sm mt-1">이 시설에는 3D 도면이 등록되지 않았습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasFloors = facilityData?.floors && facilityData.floors.length > 0;
  const positionClasses = {
    'top-left': 'absolute top-4 left-4',
    'top-right': 'absolute top-4 right-4',
    'bottom-left': 'absolute bottom-6 left-6',
    'bottom-right': 'absolute bottom-6 right-6',
  };

  return (
    <div className={`${className} relative`}>
      <div ref={containerRef} className="w-full h-full" />
      
      {(isDataLoading || isLoading) && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm border border-blue-200 px-8 py-6 rounded-2xl shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {isDataLoading ? '시설 정보 불러오는 중' : '실내로 들어가는 중...'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isDataLoading ? '잠시만 기다려주세요...' : '3D 모델을 로딩하고 있습니다...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showFloorControl && hasFloors && (
        <div className={`${positionClasses[floorControlPosition]} z-20 max-w-xs`}>
          <FloorControl floors={facilityData.floors} />
        </div>
      )}
    </div>
  );
};
