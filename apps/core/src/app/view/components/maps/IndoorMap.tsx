import React, { useEffect, useState, useCallback } from 'react';
import { IndoorMapViewer } from '@/global/components';
import { FloorControl } from '@/global/components/indoor-map/FloorControl';
import { FacilityType, FacilityService, FeatureResponse, DomainResponse } from '@plug/common-services';
import { useFacilityStore } from '@/app/store/facilityStore';
import { useAssets } from '@/global/store/assetStore';
import { api } from '@plug/api-hooks/core';
import { Poi } from '@plug/engine/src';
import { convertFloors } from '@/global/utils/floorUtils';
import type { Floor } from '@/global/types';

interface IndoorMapProps {
  facilityId: number;
  facilityType: FacilityType;
  onOutdoorButtonClick?: () => void;
}

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityId, facilityType, onOutdoorButtonClick }) => {
  const [has3DDrawing, setHas3DDrawing] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [facilityData, setFacilityData] = useState<DomainResponse<typeof facilityType> | null>(null);
  const [featuresData, setFeaturesData] = useState<FeatureResponse[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [floors, setFloors] = useState<Floor[]>([]);
  
  // Facilities fetched flag from store
  const facilitiesFetched = useFacilityStore((s) => s.facilitiesFetched);
  const { assets } = useAssets();

  // Features 로드를 위한 함수
  const loadFeaturesByFacility = useCallback(async (facilityId: number): Promise<FeatureResponse[]> => {
    try {
      const response = await api.get<FeatureResponse[]>(`features?facilityId=${facilityId}`, { requireAuth: true });
      return response.data || [];
    } catch (error) {
      console.error('Failed to load features:', error);
      return [];
    }
  }, []);

  // Asset을 ID로 찾는 함수 (assetStore 사용)
  const getAssetById = useCallback((id: number) => {
    return assets.find(asset => asset.id === id);
  }, [assets]);

  // 시설 데이터 로드
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
                onOutdoorButtonClick?.();
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
  }, [facilityType, facilityId, onOutdoorButtonClick]); 

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

  // 엔진이 준비되면 POI 생성
  const handleLoadComplete = useCallback(() => {
    if (!featuresData || featuresData.length === 0 || !assets || assets.length === 0) {
      return;
    }

    console.log('Model Loaded');

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
  }, [featuresData, facilityId, getAssetById, assets]);

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
          
          {onOutdoorButtonClick && (
            <button
              onClick={onOutdoorButtonClick}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              지금 실외로 나가기
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3D 도면이 있는 경우
  return (
    <>
      <IndoorMapViewer 
        modelUrl={facilityData?.facility?.drawing?.url || ''}
        onLoadComplete={handleLoadComplete}
      />
      
      {/* Floor Control - 우측 하단 */}
      {floors.length > 0 && (
        <div className="absolute bottom-6 right-6 z-20 max-w-xs">
          <FloorControl floors={floors} />
        </div>
      )}
      
      {onOutdoorButtonClick && (
        <button
          onClick={onOutdoorButtonClick}
          className="absolute top-4 right-4 z-30 group px-4 py-3 text-white hover:text-gray-200 transition-all duration-200 cursor-pointer select-none"
          title="실외 지도로 나가기"
        >
          <div className="flex items-center space-x-3">
            <svg 
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-base font-medium">실외로 나가기</span>
          </div>
        </button>
      )}
    </>
  );
};

export default IndoorMap;
