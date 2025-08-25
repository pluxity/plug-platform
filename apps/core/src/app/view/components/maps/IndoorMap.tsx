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
import { Camera, Poi, Interfaces } from '@plug/engine';

interface IndoorMapProps {
  facilityId: number;
  facilityType: FacilityType;
  onGoOutdoor?: () => void; // optional parent-controlled transition callback
}

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityId, facilityType, onGoOutdoor }) => {
  const [has3DDrawing, setHas3DDrawing] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [facilityData, setFacilityData] = useState<DomainResponse<typeof facilityType> | null>(null);
  const [featuresData, setFeaturesData] = useState<FeatureResponse[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [floors, setFloors] = useState<Floor[]>([]);
  // Prevent duplicate POI imports (idempotency guard) across multiple triggers
  const importedRef = useRef(false);
  const engineReadyRef = useRef(false);
  
  const facilitiesFetched = useFacilityStore((s) => s.facilitiesFetched);
  const { assets } = useAssets();

  const loadFeaturesByFacility = useCallback(async (facilityId: number): Promise<FeatureResponse[]> => {
    try {
      const list = await getFeaturesByFacility(facilityId);
      return list || [];
    } catch {
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
        const hasDrawing = !!(response.data?.facility?.drawing?.url && response.data.facility.drawing.url.trim() !== '');
        setHas3DDrawing(hasDrawing);

        if (response.data && 'floors' in response.data && response.data.floors) {
          const convertedFloors = convertFloors(response.data.floors);
          setFloors(convertedFloors);
        }

        if (!hasDrawing) {
          timer = window.setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                if (timer) {
                  window.clearInterval(timer);
                }
                onGoOutdoor?.();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch {
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
  }, [facilityType, facilityId, onGoOutdoor]); 

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

  useEffect(() => {
    importedRef.current = false;
  }, [facilityId]);

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
    } catch {
      void 0;
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
    if (onGoOutdoor) {
      onGoOutdoor();
    } else {
      // Fallback for legacy listeners
      window.dispatchEvent(new Event('indoor:goOutdoor'));
    }
  }, [onGoOutdoor]);

  useEffect(() => {
    return () => {
      if (onGoOutdoor) {
        onGoOutdoor();
      } else {
        window.dispatchEvent(new Event('indoor:goOutdoor'));
      }
    };
  }, [onGoOutdoor]);

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

      <div className="absolute top-4 left-4 z-20 flex flex-row gap-3 items-start">
        <DeviceSearchForm className="pointer-events-auto" />
        <DeviceCategoryChips />
      </div>
      {floors.length > 0 && (
        <div className="absolute bottom-6 right-6 z-20 max-w-xs">
          <FloorControl floors={floors} />
        </div>
      )}

      <button
        onClick={handleOutdoorClick}
        className="absolute top-4 right-4 z-20 rounded-xl px-4 py-3 text-white cursor-pointer select-none bg-gradient-to-r from-sky-600 to-cyan-600 shadow-lg shadow-cyan-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-300/70 pointer-events-auto"
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
