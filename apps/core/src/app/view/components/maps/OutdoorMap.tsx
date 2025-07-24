import React, { useEffect } from 'react'
import { Entity, useCesium } from 'resium'
import * as Cesium from 'cesium'
import { Button, SearchForm } from '@plug/ui'
import { useMapLoadingStore } from '@/app/store/mapLoadingStore'
import { useFacilityStore, useFacilities } from '@/app/store/facilityStore'
import type { Facility, LocationMeta } from '@plug/common-services'
import GoogleMap from '@/global/components/maps/GoogleMap'

// 지도 컨트롤 컴포넌트
const MapControls: React.FC = () => {
  const { viewer } = useCesium()

  const fnZoomIn = () => {
    if (viewer?.scene?.camera) {
      const camera = viewer.scene.camera;
      const direction = camera.direction;
      const moveDistance = camera.positionCartographic.height * 0.1;
      
      camera.move(direction, moveDistance);
    }
  };

  const fnZoomOut = () => {
    if (viewer?.scene?.camera) {
      const camera = viewer.scene.camera;
      const direction = camera.direction;
      const moveDistance = camera.positionCartographic.height * -0.1;
      
      camera.move(direction, moveDistance);
    }
  };

  const fnFlyToHome = () => {
    if (viewer?.scene?.camera) {
      const camera = viewer.scene.camera;
      
      // 용산구청 좌표 (위도: 37.532200, 경도: 126.990500)
      // 높이를 더 낮춰서 지면에 가깝게 설정
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(126.990500, 37.532200, 500),
        duration: 2.0
      });
    }
  };

  const btnClassName = 'hover:bg-transparent text-gray-100 hover:text-gray-800 cursor-pointer w-9 h-9 hover:scale-150 transition-transform duration-200 rounded-full flex items-center justify-center';

  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-1.5 z-10 p-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
      <Button
        onClick={fnZoomIn}
        variant="ghost"
        size="icon"
        title="확대"
        className={btnClassName}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Button>
      <Button
        onClick={fnZoomOut}
        variant="ghost"
        size="icon"
        title="축소"
        className={btnClassName}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </Button>
      <Button
        onClick={fnFlyToHome}
        variant="ghost"
        size="icon"
        title="홈 화면"
        className={btnClassName}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      </Button>
    </div>
  )
}

interface OutdoorMapProps {
  onFacilityClick?: (facilityId: number) => void;
}

const OutdoorMap: React.FC<OutdoorMapProps> = ({ onFacilityClick }) => {
  const { startTransition, endTransition } = useMapLoadingStore();
  
  // Facility store에서 검색 상태와 액션들 가져오기
  const { 
    facilitiesFetched,
    searchQuery,
    searchResults,
    setFacilities,
    setFacilitiesFetched,
    performSearch,
    selectSearchResult,
    setSelectedFacility,
    setSearchQuery,
    getAllFacilities
  } = useFacilityStore()
  
  const { execute: fetchFacilities, data: facilitiesData, isLoading: facilitiesLoading } = useFacilities()

  useEffect(() => {
    if (!facilitiesFetched) {
      fetchFacilities()
    }
  }, [facilitiesFetched, fetchFacilities])

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
    setSearchQuery(query);
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
            
            setSelectedFacility(facility);
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
    <div className="w-full h-full relative">
      <GoogleMap className="w-full h-full">
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
        
      </GoogleMap>
      
      {/* Search Form - 좌측 상단에 플로팅 */}
      <div className="absolute top-4 left-4 w-80">
        <SearchForm
          value={searchQuery}
          onChange={handleSearchChange}
          onSelect={handleSearchSelect}
          searchResult={searchResults.map(facility => facility.name)}
          placeholder="시설 검색..."
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        />
      </div>
      
      <MapControls />
    </div>
  )
}

export default OutdoorMap
