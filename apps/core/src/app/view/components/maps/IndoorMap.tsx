import React, { useEffect, useState, useCallback, useRef } from 'react';
import { IndoorMapViewer } from '@/global/components';
import { FloorControl } from '@/global/components/indoor-map/FloorControl';
import { FacilityType, FacilityService, FeatureResponse, DomainResponse } from '@plug/common-services';
import { getFeaturesByFacility } from '@plug/common-services';
import { useFacilityStore } from '@/app/store/facilityStore';
import { useAssets } from '@/global/store/assetStore';
import { convertFloors } from '@/global/utils/floorUtils';
import DeviceSearchForm from './DeviceSearchForm';
import DeviceCategoryChips from './DeviceCategoryChips';
import type { Floor } from '@/global/types';
import { Camera, Poi, Interfaces } from '@plug/engine/src';

interface IndoorMapProps {
  facilityId: number;
  facilityType: FacilityType;
}

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityId, facilityType }) => {
  const requestOutdoor = useCallback(() => {
    window.dispatchEvent(new CustomEvent('indoor:goOutdoor'));
  }, []);
  const [has3DDrawing, setHas3DDrawing] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [facilityData, setFacilityData] = useState<DomainResponse<typeof facilityType> | null>(null);
  const [featuresData, setFeaturesData] = useState<FeatureResponse[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [floors, setFloors] = useState<Floor[]>([]);
  const importedRef = useRef(false);
  const engineReadyRef = useRef(false);
  
  // Facilities fetched flag from store
  const facilitiesFetched = useFacilityStore((s) => s.facilitiesFetched);
  const { assets } = useAssets();

  // Features 로드를 위한 함수(단발성 호출)
  const loadFeaturesByFacility = useCallback(async (facilityId: number): Promise<FeatureResponse[]> => {
    try {
      const list = await getFeaturesByFacility(facilityId);
      return list || [];
    } catch (error) {
      console.error('Failed to load features:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    let timer: number | undefined

    const loadFacilityData = async () => {
      try {
        setIsDataLoading(true);
        const response = await FacilityService.getById(facilityType, facilityId);
        setFacilityData(response.data);
        
        // 3D 도면 존재 여부 확인
        const hasDrawing = !!(response.data?.facility?.drawing?.url && response.data.facility.drawing.url.trim() !== '');
        setHas3DDrawing(hasDrawing);
        
        // 층 정보 변환
        if (response.data && 'floors' in response.data && response.data.floors) {
          const convertedFloors = convertFloors(response.data.floors);
          setFloors(convertedFloors);
        }
        
        // 3D 도면이 없으면 카운트다운 시작
        if (!hasDrawing) {
          timer = window.setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                if (timer) {
                  window.clearInterval(timer);
                }
                requestOutdoor();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to load facility data:', error);
        setHas3DDrawing(false);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadFacilityData();

    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [facilityType, facilityId, requestOutdoor]); 

  useEffect(() => {
    const loadFeatures = async () => {
      if (!facilityId) return;
      
      try {
        const features = await loadFeaturesByFacility(facilityId);
        setFeaturesData(features);
      } catch (error) {
        console.error('Failed to load features for facility:', facilityId, error);
        setFeaturesData([]);
      }
    };

    loadFeatures();
  }, [facilityId, loadFeaturesByFacility]);

  // 시설 변경 시 POI 임포트 상태 초기화
  useEffect(() => {
    importedRef.current = false;
  }, [facilityId]);

  // 엔진이 준비되면 POI 생성
  const tryImportPois = useCallback(() => {
    if (importedRef.current) return;
    if (!engineReadyRef.current) return;
    if (!featuresData || featuresData.length === 0 || !assets || assets.length === 0) return;

    const assetById = new Map(assets.map(a => [a.id, a]));
    const poiData: Interfaces.PoiImportOption[] = featuresData.map((f) => {
      const asset = assetById.get(f.assetId);
      const modelUrl = asset?.file?.url || '';
      const position: Interfaces.Vector3 = {
        x: f.position?.x ?? 0,
        y: f.position?.y ?? 0,
        z: f.position?.z ?? 0,
      };
      const rotation: Interfaces.Vector3 = {
        x: f.rotation?.x ?? 0,
        y: f.rotation?.y ?? 0,
        z: f.rotation?.z ?? 0,
      };
      const scale: Interfaces.Vector3 = {
        x: f.scale?.x ?? 1,
        y: f.scale?.y ?? 1,
        z: f.scale?.z ?? 1,
      };

      return {
        id: f.id,
        iconUrl: '',
        modelUrl,
        displayText: f.id,
        floorId: f.floorId,
        property: {
          assetId: f.assetId,
          deviceId: f.deviceId ?? null,
        },
        position,
        rotation,
        scale,
      };
    });

    try {
      Poi.Import(poiData);
      importedRef.current = true;
    } catch (e) {
      console.error('Poi.Import failed', e);
    }
  }, [featuresData, assets]);

  const handleLoadComplete = useCallback(() => {
    Camera.ExtendView(1);
    engineReadyRef.current = true;
    tryImportPois();
  }, [tryImportPois]);

  useEffect(() => {
    tryImportPois();
  }, [tryImportPois]);

  const handleOutdoorClick = useCallback(() => {
    requestOutdoor();
  }, [requestOutdoor]);

  // Unmount 시에도 한 번 더 야외 요청 이벤트 디스패치 (중복 호출은 상위에서 가드)
  useEffect(() => {
    return () => {
      requestOutdoor();
    };
  }, [requestOutdoor]);

  // 시설 데이터 로딩 중이거나 3D 도면 확인 중인 경우
  if (!facilitiesFetched || isDataLoading || has3DDrawing === null) {
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">
            {!facilitiesFetched || isDataLoading ? '시설 정보를 불러오는 중...' : '3D 도면을 확인하는 중...'}
          </p>
        </div>
      </div>
    );
  }

  // 3D 도면이 없는 경우
  if (!has3DDrawing) {
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="mb-6">
            <svg 
              className="w-16 h-16 mx-auto mb-4 text-yellow-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">3D 도면이 없습니다</h2>
            <p className="text-lg mb-6">잠시 뒤에 실외로 전환됩니다...</p>
            <div className="text-4xl font-bold text-yellow-400 mb-4">{countdown}</div>
          </div>
          
          <button
            onClick={handleOutdoorClick}
            title="실외 지도로 나가기"
            className="relative px-6 py-3 bg-blue-600 text-white rounded-xl font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-blue-900/20 pointer-events-auto"
            style={{ zIndex: 60 }}
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>지금 실외로 나가기</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  // 3D 도면이 있는 경우
  return (
    <div className="w-full h-full relative">
      <IndoorMapViewer 
        modelUrl={facilityData?.facility?.drawing?.url || ''}
        onLoadComplete={handleLoadComplete}
        onDispose={(engine) => (engine as unknown as { clear?: () => void })?.clear?.()}
      />

      {/* Device Search + Category chips - 좌측 상단 (한 줄 배치) */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-3 pr-4 max-w-[80vw]">
        <DeviceSearchForm features={featuresData} />
        <div className="min-w-0">
          <DeviceCategoryChips />
        </div>
      </div>

      {/* Floor Control - 우측 하단 */}
      {floors.length > 0 && (
        <div className="absolute bottom-6 right-6 z-20 max-w-xs">
          <FloorControl floors={floors} />
        </div>
      )}

      <button
        onClick={handleOutdoorClick}
        className="absolute top-4 right-4 rounded-xl px-4 py-3 text-white cursor-pointer select-none bg-gradient-to-r from-sky-600 to-cyan-600 shadow-lg shadow-cyan-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-300/70 pointer-events-auto"
        title="실외 지도로 나가기"
        aria-label="실외 지도로 나가기"
        role="button"
        style={{ zIndex: 60 }}
      >
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-base font-medium">실외로 나가기</span>
        </div>
      </button>
    </div>
  );
};

export default IndoorMap;
