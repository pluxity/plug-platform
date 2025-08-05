import { useEffect, useRef, useState, useCallback } from 'react';
import { Engine3D, Loader, Poi } from '@plug/engine/src';
import { FacilityType, useFeaturesByFacilitySWR, useAssetsSWR, FacilityService, DomainResponse } from '@plug/common-services';
import { FloorControl } from './FloorControl';

interface IndoorMapViewerProps {
  facilityId: number;
  facilityType: FacilityType;
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
  const [facilityData, setFacilityData] = useState<DomainResponse<typeof facilityType> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Facility 데이터 한 번만 로드
  useEffect(() => {
    const loadFacilityData = async () => {
      try {
        setIsDataLoading(true);
        setError(null);
        const response = await FacilityService.getById(facilityType, facilityId);
        setFacilityData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load facility data'));
      } finally {
        setIsDataLoading(false);
      }
    };

    loadFacilityData();
  }, [facilityType, facilityId]);

  // Features 데이터 로드
  const { data: featuresData } = useFeaturesByFacilitySWR(facilityId);
  
  // Assets 데이터 직접 로드 (무한 루프 방지)
  const { data: assetsData } = useAssetsSWR();
  
  // Assets를 ID로 찾는 함수
  const getAssetById = useCallback((id: number) => {
    return assetsData?.find(asset => asset.id === id);
  }, [assetsData]);

  // FloorResponse를 Floor 타입으로 변환하는 함수
  const convertFloors = useCallback((floors: { floorId: string; name: string }[]) => {
    return floors?.map(floor => ({
      floorId: parseInt(floor.floorId) || 0,
      name: floor.name
    })) || [];
  }, []);

  const modelUrl = facilityData?.facility?.drawing?.url;

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

  // Features 데이터가 로드되고 engine이 준비되면 POI 생성
  useEffect(() => {
    if (!engine3DRef.current || !featuresData || featuresData.length === 0 || !assetsData) {
      return;
    }

    const createPOIsFromFeatures = async () => {
      try {
        Poi.Clear();

        let createdCount = 0;
        let skippedCount = 0;

        for (const feature of featuresData) {
          if (!feature.assetId || !feature.position) {
            console.warn('Feature missing assetId or position:', feature);
            skippedCount++;
            continue;
          }

          const asset = getAssetById(feature.assetId);
          if (!asset || !asset.file?.url) {
            console.warn('Asset not found or no file URL:', feature.assetId);
            skippedCount++;
            continue;
          }

          // 아이콘 URL 결정 로직
          let iconUrl = '';
          if (asset.thumbnailFile?.url) {
            // 썸네일이 있으면 썸네일을 아이콘으로 사용
            iconUrl = asset.thumbnailFile.url;
          } else if (asset.file?.url.toLowerCase().includes('.png') || asset.file?.url.toLowerCase().includes('.jpg') || asset.file?.url.toLowerCase().includes('.jpeg')) {
            // 메인 파일이 이미지면 아이콘으로 사용
            iconUrl = asset.file.url;
          } else {
            // 기본 POI 아이콘 사용 (실제 경로는 프로젝트에 맞게 수정)
            iconUrl = 'SamplePoiIcon.png';
          }

          // POI 생성 옵션 구성
          const poiCreateOption = {
            id: feature.id,
            iconUrl: iconUrl,
            modelUrl: asset.file?.url || '', // 메인 파일을 모델로 사용
            displayText: asset.name || feature.id,
            property: {
              assetId: asset.id,
              assetName: asset.name,
              assetCode: asset.code,
              facilityId: facilityId,
              floorId: feature.floorId,
              featureId: feature.id,
              categoryId: asset.categoryId,
              categoryName: asset.categoryName,
              position: {
                x: feature.position.x,
                y: feature.position.y,
                z: feature.position.z
              },
              rotation: feature.rotation ? {
                x: feature.rotation.x,
                y: feature.rotation.y,
                z: feature.rotation.z
              } : { x: 0, y: 0, z: 0 },
              scale: feature.scale ? {
                x: feature.scale.x,
                y: feature.scale.y,
                z: feature.scale.z
              } : { x: 1, y: 1, z: 1 }
            }
          };

          // POI Create를 사용하여 생성
          Poi.Create(poiCreateOption, (data: unknown) => {
            console.log('POI created for feature:', {
              featureId: feature.id,
              assetId: asset.id,
              assetName: asset.name,
              position: feature.position,
              iconUrl: iconUrl,
              modelUrl: asset.file?.url,
              callbackData: data
            });
          });
          createdCount++;
        }

        console.log(`POI creation completed. Created: ${createdCount}, Skipped: ${skippedCount}`);
      } catch (error) {
        console.error('Error creating POIs from features:', error);
      }
    };

    createPOIsFromFeatures();
  }, [featuresData, facilityId, getAssetById, assetsData]);

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
  if (facilityData && !facilityData.facility?.drawing?.url) {
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

  const hasFloors = facilityData && 'floors' in facilityData && facilityData.floors && facilityData.floors.length > 0;
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
          <FloorControl floors={facilityData && 'floors' in facilityData ? convertFloors(facilityData.floors) : []} />
        </div>
      )}
    </div>
  );
};
