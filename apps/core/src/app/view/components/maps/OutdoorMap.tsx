import React, { useState, useEffect } from 'react'
import { Viewer, Cesium3DTileset, useCesium, Entity } from 'resium'
import * as Cesium from 'cesium'
import { Button } from '@plug/ui'
import { useBuildingStore } from '../../../store/buildingStore'
import { useBuildings } from '@plug/common-services'

export const CESIUM_ION_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNWJmZWEzOS1jMTJjLTQ0ZTYtOTFkNC1jZDMxMDlmYTRjMWEiLCJpZCI6MjgzMTA2LCJpYXQiOjE3NDE2NjE3OTR9.dZID1nZdOJeEv18BhwGwWlAjJQtWAFUDipJw7M4r0-w'

Cesium.Ion.defaultAccessToken = CESIUM_ION_ACCESS_TOKEN

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
        title="용산구청으로"
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
  onBuildingClick?: (buildingId: number, buildingName: string) => void;
}

// 빌딩 위치 데이터 (서울 내 다양한 위치로 분산)
const buildingPositions: Record<string, { longitude: number; latitude: number; height: number; heading: number; pitch: number; roll: number }> = {
  "position_1": {
    longitude: 126.9780, // 강남구
    latitude: 37.5665,
    height: 60.5,
    heading: 0,
    pitch: 0,
    roll: 0
  },
  "position_2": {
    longitude: 127.0276, // 송파구 잠실
    latitude: 37.5133,
    height: 60.5,
    heading: 45,
    pitch: 0,
    roll: 0
  },
  "position_3": {
    longitude: 126.9538, // 마포구 홍대
    latitude: 37.5563,
    height: 60.5,
    heading: 90,
    pitch: 0,
    roll: 0
  },
  "position_4": {
    longitude: 127.0286, // 성동구 성수
    latitude: 37.5445,
    height: 60.5,
    heading: 135,
    pitch: 0,
    roll: 0
  },
  "position_5": {
    longitude: 126.9270, // 영등포구 여의도
    latitude: 37.5219,
    height: 60.5,
    heading: 180,
    pitch: 0,
    roll: 0
  },
  "position_6": {
    longitude: 127.0495, // 광진구 건대
    latitude: 37.5403,
    height: 60.5,
    heading: 225,
    pitch: 0,
    roll: 0
  },
  "position_7": {
    longitude: 126.9895, // 용산구 이태원
    latitude: 37.5347,
    height: 60.5,
    heading: 270,
    pitch: 0,
    roll: 0
  },
  "position_8": {
    longitude: 127.0017, // 중구 명동
    latitude: 37.5636,
    height: 60.5,
    heading: 315,
    pitch: 0,
    roll: 0
  }
};

const OutdoorMap: React.FC<OutdoorMapProps> = ({ onBuildingClick }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [buildingEntitiesLoaded, setBuildingEntitiesLoaded] = useState<boolean>(false);

  // Store에서 빌딩 데이터 가져오기
  const { buildings, setBuildings, buildingsFetched, setBuildingsFetched, setSelectedBuilding } = useBuildingStore()

  // Building API 훅 사용 (한 번만 호출하여 Store에 저장)
  const { execute: fetchBuildings, data: buildingsData, isLoading: buildingsLoading, error: buildingsError } = useBuildings();

  // 컴포넌트 마운트 시 빌딩 데이터 가져오기 (한 번만)
  useEffect(() => {
    if (!buildingsFetched && buildings.length === 0) {
      console.log('OutdoorMap: Fetching buildings...');
      fetchBuildings();
      setBuildingsFetched(true); // 페칭 완료 표시
    }
  }, [fetchBuildings, buildingsFetched, buildings.length, setBuildingsFetched]);

  // API 데이터가 로드되면 Store에 저장
  useEffect(() => {
    if (buildingsData && buildingsData.length > 0) {
      console.log('OutdoorMap: Setting buildings to store:', buildingsData);
      setBuildings(buildingsData);
    }
  }, [buildingsData, setBuildings]);

  // 빌딩 로딩 상태 로그
  useEffect(() => {
    if (buildingsLoading) {
      console.log('Buildings loading...');
    }
  }, [buildingsLoading]);

  // 빌딩 에러 상태 로그
  useEffect(() => {
    if (buildingsError) {
      console.error('Buildings error:', buildingsError);
    }
  }, [buildingsError]);

  // 빌딩 엔티티 로딩 완료 체크
  useEffect(() => {
    if (buildings.length > 0 && !buildingEntitiesLoaded) {
      // 모든 빌딩 엔티티가 로드될 때까지 약간의 지연 후 완료 처리
      const timer = setTimeout(() => {
        console.log('Building entities loaded');
        setBuildingEntitiesLoaded(true);
      }, 1000); // 1초 후 빌딩 엔티티 로딩 완료

      return () => clearTimeout(timer);
    }
  }, [buildings, buildingEntitiesLoaded]);

  // 빌딩 위치 정보 가져오기 (서울 내 임시 위치 사용)
  const getBuildingPosition = (buildingId: number) => {
    // 실제로는 빌딩 ID에 따라 다른 위치를 반환해야 하지만,
    // 현재는 API에 위치 정보가 없으므로 서울 내 다양한 임시 위치 사용
    const positions = Object.values(buildingPositions);
    const index = (buildingId - 1) % positions.length;
    return positions[index];
  };

  // 초기 카메라 이동을 처리하는 컴포넌트
  const InitialCameraSetup: React.FC = () => {
    const { viewer } = useCesium();

    React.useEffect(() => {
      if (viewer && !isInitialized) {
        const camera = viewer.scene.camera;
        
        // 용산구청으로 카메라 이동
        camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(126.990500, 37.532200, 500),
          duration: 2.0
        });
        
        setIsInitialized(true);
      }
    }, [viewer]);

    return null;
  };

  // 마우스 이벤트 처리 컴포넌트
  const MouseEventHandler: React.FC = () => {
    const { viewer } = useCesium();

    React.useEffect(() => {
      if (!viewer) return;

      const canvas = viewer.canvas;
      let highlightedEntity: Cesium.Entity | null = null;

      // 카메라와 첫 번째 빌딩 사이의 거리를 계산하는 함수 (기본값으로 사용)
      const calculateDistance = () => {
        const camera = viewer.scene.camera;
        const defaultPosition = Cesium.Cartesian3.fromDegrees(126.990500, 37.532200, 60.5);
        return Cesium.Cartesian3.distance(camera.position, defaultPosition);
      };

      // 거리에 따른 테두리 두께 계산 함수
      const calculateSilhouetteSize = (distance: number, isHovered: boolean = false) => {
        // 거리에 따라 테두리 두께 조정 (거리가 멀수록 얇게)
        const baseSize = Math.max(0.5, Math.min(2, 1000 / distance));
        return isHovered ? baseSize * 2 : baseSize;
      };

      // 모든 빌딩 엔티티에 기본 silhouette 설정
      const initializeBuildingEntities = () => {
        const entities = viewer.entities.values;
        for (const entity of entities) {
          // API에서 가져온 빌딩들인지 확인
          const building = buildings.find(b => b.facility.name === entity.name);
          if (building && entity.model) {
            const distance = calculateDistance();
            entity.model.silhouetteSize = new Cesium.ConstantProperty(calculateSilhouetteSize(distance));
            entity.model.silhouetteColor = new Cesium.ConstantProperty(Cesium.Color.WHITE);
          }
        }
      };

      // 카메라 이동 시 테두리 두께 업데이트
      const updateSilhouetteSize = () => {
        const entities = viewer.entities.values;
        for (const entity of entities) {
          const building = buildings.find(b => b.facility.name === entity.name);
          if (building && entity.model) {
            const distance = calculateDistance();
            const isHovered = highlightedEntity === entity;
            entity.model.silhouetteSize = new Cesium.ConstantProperty(calculateSilhouetteSize(distance, isHovered));
          }
        }
      };

      // 초기 설정 (빌딩 데이터가 로드된 후 실행)
      if (buildings.length > 0) {
        setTimeout(initializeBuildingEntities, 100);
      }

      // 카메라 이동 이벤트 리스너
      viewer.scene.camera.moveEnd.addEventListener(updateSilhouetteSize);

      // 마우스 이동 이벤트
      const onMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pickedObject = viewer.scene.pick(new Cesium.Cartesian2(x, y));
        
        if (pickedObject && pickedObject.id) {
          // API에서 가져온 빌딩인지 확인
          const building = buildings.find(b => b.facility.name === pickedObject.id.name);
          
          if (building) {
            // 빌딩에 호버 시
            canvas.style.cursor = 'pointer';
            
            if (highlightedEntity !== pickedObject.id) {
              // 이전 하이라이트 제거
              if (highlightedEntity && highlightedEntity.model) {
                const distance = calculateDistance();
                highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(calculateSilhouetteSize(distance, false));
                highlightedEntity.model.silhouetteColor = new Cesium.ConstantProperty(Cesium.Color.WHITE);
              }
              
              // 새로운 하이라이트 적용
              highlightedEntity = pickedObject.id;
              if (highlightedEntity && highlightedEntity.model) {
                const distance = calculateDistance();
                highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(calculateSilhouetteSize(distance, true));
                highlightedEntity.model.silhouetteColor = new Cesium.ConstantProperty(Cesium.Color.CYAN);
              }
            }
            return;
          }
        }
        
        // 빌딩 밖으로 마우스가 나갔을 때
        canvas.style.cursor = 'default';
        
        if (highlightedEntity && highlightedEntity.model) {
          const distance = calculateDistance();
          highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(calculateSilhouetteSize(distance, false));
          highlightedEntity.model.silhouetteColor = new Cesium.ConstantProperty(Cesium.Color.WHITE);
          highlightedEntity = null;
        }
      };

      // 클릭 이벤트 - 실내 지도 전환 로직
      const onClick = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedObject = viewer.scene.pick(event.position);
        if (pickedObject && pickedObject.id) {
          // API에서 가져온 빌딩인지 확인
          const building = buildings.find(b => b.facility.name === pickedObject.id.name);
          
          if (building) {
            console.log(`${building.facility.name} 빌딩이 클릭되었습니다! 실내 지도로 전환합니다.`);
            
            // 스토어에 선택된 빌딩 저장
            setSelectedBuilding(building);
            
            // 실내 지도로 전환하는 콜백 함수 호출
            if (onBuildingClick) {
              onBuildingClick(building.facility.id, building.facility.name);
            }
          }
        }
      };

      // 이벤트 리스너 등록
      canvas.addEventListener('mousemove', onMouseMove);
      viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(onClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 컴포넌트 언마운트 시 정리
      return () => {
        canvas.removeEventListener('mousemove', onMouseMove);
        viewer.scene.camera.moveEnd.removeEventListener(updateSilhouetteSize);
        canvas.style.cursor = 'default';
        if (highlightedEntity && highlightedEntity.model) {
          const distance = calculateDistance();
          highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(calculateSilhouetteSize(distance, false));
          highlightedEntity.model.silhouetteColor = new Cesium.ConstantProperty(Cesium.Color.WHITE);
        }
      };
    }, [viewer]); // buildings 의존성 제거

    return null;
  };

  // 선택된 빌딩으로 카메라 이동을 처리하는 컴포넌트 (검색 결과 선택 시)
  const CameraController: React.FC = () => {
    const { viewer } = useCesium();
    const searchSelectedBuilding = useBuildingStore(state => state.searchSelectedBuilding);

    React.useEffect(() => {
      if (!viewer || !searchSelectedBuilding) return;

      const building = searchSelectedBuilding;
      const position = getBuildingPosition(building.facility.id);
      
      console.log(`Moving camera to building: ${building.facility.name}`);
      
      // 카메라를 선택된 빌딩으로 이동 (약간 거리를 두고)
      const camera = viewer.scene.camera;
      
      // 빌딩 위치에서 약간 떨어진 위치로 카메라 이동
      const distance = 300; // 빌딩으로부터의 거리 (미터)
      const height = position.height + 150; // 빌딩보다 높은 위치
      
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          position.longitude, 
          position.latitude, 
          height + distance
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0), // 북쪽을 바라보도록
          pitch: Cesium.Math.toRadians(-45), // 45도 아래로 내려다보기
          roll: 0.0
        },
        duration: 2.0 // 2초 동안 부드럽게 이동
      });

    }, [viewer, searchSelectedBuilding]);

    return null;
  };

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-700">
              <p className="text-lg font-semibold mb-2">3D 지도 로딩 중...</p>
              <div className="text-sm space-y-1">
                <p className={"text-green-600"}>
                  ⏳ Photorealistic 3D 지도
                </p>
                <p className={buildingEntitiesLoaded ? "text-green-600" : "text-gray-500"}>
                  {buildingEntitiesLoaded ? "✓" : "⏳"} 빌딩 엔티티 ({buildings.length}개)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Viewer
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        fullscreenButton={false}
        vrButton={false}
        geocoder={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        navigationInstructionsInitiallyVisible={false}
        sceneMode={Cesium.SceneMode.SCENE3D}
        terrainProvider={new Cesium.EllipsoidTerrainProvider()}
      >
        <Cesium3DTileset
          url={Cesium.IonResource.fromAssetId(2275207)}
          onReady={() => {
            setIsLoading(false);
          }}
        />
        
        {/* <Cesium3DTileset
          url={Cesium.IonResource.fromAssetId(96188)}
          onReady={(tileset) => {
            const heightOffset = -10;
            const translation = new Cesium.Cartesian3(0, 0, heightOffset);
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
          }}
        /> */}
        
        {/* 동적으로 생성된 빌딩 Entity들 - drawing.url이 있는 것만 렌더링 */}
        {buildings
          .filter(building => building.facility.drawing?.url) // drawing.url이 있는 빌딩만 필터링
          .map((building) => {
            const position = getBuildingPosition(building.facility.id);
            return (
              <Entity
                key={building.facility.id}
                name={building.facility.name}
                position={Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height)}
                orientation={Cesium.Transforms.headingPitchRollQuaternion(
                  Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
                  new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(position.heading), 
                    Cesium.Math.toRadians(position.pitch), 
                    Cesium.Math.toRadians(position.roll)
                  )
                )}
                model={{
                  uri: building.facility.drawing.url, // drawing.url이 확실히 있으므로 직접 사용
                  scale: 1.0,
                  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                }}
              />
            );
          })}
        
        <InitialCameraSetup />
        <MouseEventHandler />
        <CameraController />
        <MapControls />
      </Viewer>      
    </div>
  )
}

export default OutdoorMap
