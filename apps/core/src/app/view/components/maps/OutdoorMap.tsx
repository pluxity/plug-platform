import React, { useEffect } from 'react'
import { Entity, useCesium } from 'resium'
import * as Cesium from 'cesium'
import { SearchForm } from '@plug/ui'
import { useMapLoadingStore } from '@/app/store/mapLoadingStore'
import { useFacilityStore, useFacilities } from '@/app/store/facilityStore'
import VWorldMap from '@/global/components/maps/VWorldMap'
import MapControls from '@/global/components/maps/MapControls'

// LocationMeta 타입 정의
interface LocationMeta {
  height?: number;
  heading?: number;
  pitch?: number;
  roll?: number;
}

interface OutdoorMapProps {
  onFacilityClick?: (facilityId: number) => void;
}

const OutdoorMap: React.FC<OutdoorMapProps> = ({ onFacilityClick }) => {
  const { startTransition, endTransition } = useMapLoadingStore();
  
  const { 
    facilitiesFetched,
    searchQuery,
    searchResults,
    setFacilities,
    setFacilitiesFetched,
    performSearch,
    selectSearchResult,
    getAllFacilities
  } = useFacilityStore()
  
  const { execute: fetchFacilities, data: facilitiesData, isLoading: facilitiesLoading } = useFacilities()

  useEffect(() => {
    if (!facilitiesFetched) {
      fetchFacilities()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilitiesFetched]) // fetchFacilities는 안정적이지 않으므로 의존성에서 제외

  useEffect(() => {
    if (facilitiesData && !facilitiesFetched) {
      // API 응답이 FacilityAllResponse 형태로 buildings와 stations를 포함
      setFacilities(facilitiesData)
      setFacilitiesFetched(true)
    }
  }, [facilitiesData, facilitiesFetched, setFacilities, setFacilitiesFetched])

  // 로딩 완료 처리
  useEffect(() => {
    if (!facilitiesLoading && getAllFacilities().length > 0) {
      const timer = setTimeout(() => {
        endTransition();
      }, 500); 
      
      return () => clearTimeout(timer);
    }
  }, [facilitiesLoading, getAllFacilities, endTransition]);

  const handleSearchChange = (query: string) => {
    // setSearchQuery(query);
    performSearch(query); 
  }

  const handleSearchSelect = (facilityName: string) => {
    const selectedFacility = searchResults.find(facility => facility.name === facilityName)
    if (selectedFacility) {
      selectSearchResult(selectedFacility)
    }
  }

  if (facilitiesLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">지도를 준비중입니다...</div>
      </div>
    );
  }

  // Camera movement for search selected facility
  const CameraController: React.FC = () => {
    const { viewer } = useCesium();
    const { searchSelectedFacility, setSearchSelectedFacility } = useFacilityStore();

    // 검색된 시설로 이동
    useEffect(() => {
      if (!viewer || !searchSelectedFacility) return;

      const longitude = Number(searchSelectedFacility.lon)
      const latitude = Number(searchSelectedFacility.lat)
      
      // 좌표 유효성 검사
      if (isNaN(longitude) || isNaN(latitude)) {
        setSearchSelectedFacility(null)
        return
      }

      const camera = viewer.scene.camera;
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 200),
        duration: 2.0,
        complete: () => {
          setSearchSelectedFacility(null);
        }
      });
    }, [viewer, searchSelectedFacility, setSearchSelectedFacility]);

    return null;
  };

  const FacilityInteractionHandler: React.FC = () => {
    const { viewer } = useCesium();

    React.useEffect(() => {
      if (!viewer) return;

      const canvas = viewer.canvas;
      const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(canvas);
      let highlightedEntity: Cesium.Entity | null = null;
      const facilitiesList = getAllFacilities();

      const onMouseMove = (event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        const pickedObject = viewer.scene.pick(event.endPosition);
        
        if (pickedObject && pickedObject.id) {
          const facility = facilitiesList.find(f => f.name === pickedObject.id.name);
          
          if (facility) {
            canvas.style.cursor = 'pointer';
            
            if (highlightedEntity !== pickedObject.id) {
              // 이전 하이라이트 제거
              if (highlightedEntity && highlightedEntity.model) {
                highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(0);
                highlightedEntity.model.silhouetteColor = undefined;
              }
              
              // 새로운 하이라이트 적용
              highlightedEntity = pickedObject.id;
              if (highlightedEntity && highlightedEntity.model) {
                highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(4.0);
                highlightedEntity.model.silhouetteColor = new Cesium.ConstantProperty(Cesium.Color.CYAN);
              }
            }
            return;
          }
        }
        
        // 시설 밖으로 마우스가 나갔을 때
        canvas.style.cursor = 'default';
        
        if (highlightedEntity && highlightedEntity.model) {
          highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(0);
          highlightedEntity.model.silhouetteColor = undefined;
          highlightedEntity = null;
        }
      };

      // 간단한 클릭 이벤트
      const onLeftClick = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedObject = viewer.scene.pick(event.position);
        if (pickedObject && pickedObject.id) {
          const facility = facilitiesList.find(f => f.name === pickedObject.id.name);
          
          if (facility) {
            startTransition('outdoor', 'indoor');
            
            // setSelectedFacility 호출 제거 - MainMap에서 처리
            if (onFacilityClick) {
              onFacilityClick(facility.id);
            }
          }
        }
      };

      // 이벤트 리스너 등록
      screenSpaceEventHandler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      screenSpaceEventHandler.setInputAction(onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 정리 함수
      return () => {
        if (highlightedEntity && highlightedEntity.model) {
          highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(0);
          highlightedEntity.model.silhouetteColor = undefined;
        }
        screenSpaceEventHandler.destroy();
      };

    }, [viewer]);

    return null;
  };

  return (
    <>
      <VWorldMap 
        className="w-full h-full relative"
      >
        {/* Search Form - 좌측 상단에 플로팅 */}
        <div className="absolute top-4 left-4 w-80 z-50">
          <SearchForm
            value={searchQuery}
            onChange={handleSearchChange}
            onSelect={handleSearchSelect}
            searchResult={searchResults.map(facility => facility.name)}
            placeholder="시설 검색..."
            className="bg-white/90 backdrop-blur-sm shadow-lg"
          />
        </div>
        
        <CameraController />
        <FacilityInteractionHandler />
        
        {/* Facility Entities */}
        {(() => {
          const allFacilities = getAllFacilities();
          if (allFacilities.length === 0) {
            return null;
          }
          
          const filteredFacilities = allFacilities.filter(facility => {
            // 필수 데이터 검증
            const hasDrawing = facility.drawing?.url;
            const hasLon = typeof facility.lon === 'number' && !isNaN(facility.lon);
            const hasLat = typeof facility.lat === 'number' && !isNaN(facility.lat);
            
            return hasDrawing && hasLon && hasLat;
          });
          
          return filteredFacilities.map((facility) => {
            const longitude = Number(facility.lon)
            const latitude = Number(facility.lat)
            
            // locationMeta JSON 파싱
            let locationMeta: LocationMeta = {};
            try {
              if (facility.locationMeta) {
                locationMeta = JSON.parse(facility.locationMeta) as LocationMeta;
              }
            } catch {
              // 파싱 실패 시 빈 객체 사용
            }
            
            // 고도값 설정 - locationMeta.height 사용
            const altitude = locationMeta.height || 0;
            const modelHeight = altitude;
            
            // 방향 정보 추출 - locationMeta에서만 가져옴
            const heading = locationMeta.heading || 0;
            const pitch = locationMeta.pitch || 0;
            const roll = locationMeta.roll || 0;
            
            return (
              <Entity
                key={facility.id}
                name={facility.name}
                position={Cesium.Cartesian3.fromDegrees(longitude, latitude, modelHeight)}
                orientation={Cesium.Transforms.headingPitchRollQuaternion(
                  Cesium.Cartesian3.fromDegrees(longitude, latitude, modelHeight),
                  Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, roll)
                )}
                model={{
                  uri: facility.drawing.url,
                  scale: 2.0,
                  heightReference: Cesium.HeightReference.NONE,
                  show: true
                  // minimumPixelSize와 maximumScale 제거하여 자연스러운 크기 변화 허용
                }}
              />
            );
          });
        })()}
      </VWorldMap>
      
      <MapControls />
    </>
  )
}

export default OutdoorMap
