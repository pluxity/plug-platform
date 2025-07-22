import React, { useState, useEffect } from 'react'
import { Viewer, Cesium3DTileset, useCesium, Entity } from 'resium'
import * as Cesium from 'cesium'
import { Button } from '@plug/ui'
import { useBuildingStore } from '@/app/store/buildingStore'
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
    height: 70.0, // 고도 70m 고정
    heading: 0,
    pitch: 0,
    roll: 0
  },
  "position_2": {
    longitude: 127.0276, // 송파구 잠실
    latitude: 37.5133,
    height: 70.0, // 고도 70m 고정
    heading: 45,
    pitch: 0,
    roll: 0
  },
  "position_3": {
    longitude: 126.9538, // 마포구 홍대
    latitude: 37.5563,
    height: 70.0, // 고도 70m 고정
    heading: 90,
    pitch: 0,
    roll: 0
  },
  "position_4": {
    longitude: 127.0286, // 성동구 성수
    latitude: 37.5445,
    height: 70.0, // 고도 70m 고정
    heading: 135,
    pitch: 0,
    roll: 0
  },
  "position_5": {
    longitude: 126.9270, // 영등포구 여의도
    latitude: 37.5219,
    height: 70.0, // 고도 70m 고정
    heading: 180,
    pitch: 0,
    roll: 0
  },
  "position_6": {
    longitude: 127.0495, // 광진구 건대
    latitude: 37.5403,
    height: 70.0, // 고도 70m 고정
    heading: 225,
    pitch: 0,
    roll: 0
  },
  "position_7": {
    longitude: 126.9895, // 용산구 이태원
    latitude: 37.5347,
    height: 70.0, // 고도 70m 고정
    heading: 270,
    pitch: 0,
    roll: 0
  },
  "position_8": {
    longitude: 127.0017, // 중구 명동
    latitude: 37.5636,
    height: 70.0, // 고도 70m 고정
    heading: 315,
    pitch: 0,
    roll: 0
  }
};

const OutdoorMap: React.FC<OutdoorMapProps> = ({ onBuildingClick }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [buildingEntitiesLoaded, setBuildingEntitiesLoaded] = useState<boolean>(false);
  const [tilesetLoaded, setTilesetLoaded] = useState<boolean>(false);
  const [cameraInitialized, setCameraInitialized] = useState<boolean>(false);
  
  // 메모리 관리를 위한 ref들
  const viewerRef = React.useRef<Cesium.Viewer | null>(null);
  const tilesetRef = React.useRef<Cesium.Cesium3DTileset | null>(null);
  const entitiesRef = React.useRef<Cesium.Entity[]>([]);

  const { buildings, setBuildings, buildingsFetched, setBuildingsFetched, setSelectedBuilding } = useBuildingStore()
  const { execute: fetchBuildings, data: buildingsData, isLoading: buildingsLoading, error: buildingsError } = useBuildings();

  useEffect(() => {
    if (!buildingsFetched && buildings.length === 0) {
      fetchBuildings();
      setBuildingsFetched(true);
    }
  }, [fetchBuildings, buildingsFetched, buildings.length, setBuildingsFetched]);

  useEffect(() => {
    if (buildingsData && buildingsData.length > 0) {
      setBuildings(buildingsData);
    }
  }, [buildingsData, setBuildings]);

  useEffect(() => {
    if (buildingsError) {
      console.error('Buildings error:', buildingsError);
    }
  }, [buildingsError]);

  useEffect(() => {
    if (viewerRef.current && buildings.length > 0) {
      const timer = setTimeout(() => {
        const currentEntities = viewerRef.current?.entities.values || [];
        entitiesRef.current = currentEntities.filter(entity => 
          buildings.some(building => building.facility.name === entity.name)
        );
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [buildings]);

  useEffect(() => {
    if (buildings.length > 0 && !buildingEntitiesLoaded) {
      const timer = setTimeout(() => {
        setBuildingEntitiesLoaded(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (buildings.length === 0 && buildingsFetched) {
      setBuildingEntitiesLoaded(true);
    }
  }, [buildings, buildingEntitiesLoaded, buildingsFetched]);

  // 모든 로딩이 완료되었는지 체크
  useEffect(() => {
    if (tilesetLoaded && cameraInitialized && buildingEntitiesLoaded) {
      setIsLoading(false);
    }
  }, [tilesetLoaded, cameraInitialized, buildingEntitiesLoaded]);

  useEffect(() => {
    return () => {
      if (entitiesRef.current.length > 0) {
        entitiesRef.current.forEach(entity => {
          if (viewerRef.current?.entities) {
            viewerRef.current.entities.remove(entity);
          }
        });
        entitiesRef.current = [];
      }
      
      if (tilesetRef.current && viewerRef.current?.scene.primitives) {
        viewerRef.current.scene.primitives.remove(tilesetRef.current);
        if (tilesetRef.current.destroy && typeof tilesetRef.current.destroy === 'function') {
          tilesetRef.current.destroy();
        }
        tilesetRef.current = null;
      }
      
      if (viewerRef.current) {
        if (viewerRef.current.canvas) {
          viewerRef.current.canvas.style.cursor = 'default';
        }
        
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            if (window.gc && typeof window.gc === 'function') {
              window.gc();
            }
          }, 100);
        }
        
        viewerRef.current = null;
      }
    };
  }, []);

  const getBuildingPosition = (buildingId: number) => {
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
        const cameraController = viewer.scene.screenSpaceCameraController;
        
        cameraController.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG]; // 좌클릭으로 회전
        cameraController.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG]; // 우클릭으로 패닝
        cameraController.zoomEventTypes = [
          Cesium.CameraEventType.WHEEL, // 마우스 휠로 줌
          Cesium.CameraEventType.PINCH  // 핀치로 줌
        ];
        cameraController.translateEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG]; // 휠클릭으로 틸트
        
        camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(126.990500, 37.532200, 500),
          duration: 2.0,
          complete: () => {
            setCameraInitialized(true); 
          }
        });
        
        setIsInitialized(true);
      }
    }, [viewer]);

    return null;
  };

  const BuildingInteractionHandler: React.FC = () => {
    const { viewer } = useCesium();

    React.useEffect(() => {
      if (!viewer) return;

      const canvas = viewer.canvas;
      const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(canvas);
      let highlightedEntity: Cesium.Entity | null = null;
      let mouseEventThrottle: NodeJS.Timeout | null = null;

      const MAX_VISIBLE_DISTANCE = 2000; // 2km 이상 거리의 빌딩은 숨김
      const HOVER_SILHOUETTE_SIZE = 3.0; // 호버 시 테두리 두께

      const calculateDistance = (entity: Cesium.Entity) => {
        if (!entity.position) return Infinity;
        const camera = viewer.scene.camera;
        const position = entity.position.getValue(viewer.clock.currentTime);
        if (!position) return Infinity;
        return Cesium.Cartesian3.distance(camera.position, position);
      };

      // 거리 기반 빌딩 가시성 업데이트 (성능 최적화)
      let distanceUpdateThrottle: NodeJS.Timeout | null = null;
      const updateBuildingVisibility = () => {
        if (distanceUpdateThrottle) return;
        
        distanceUpdateThrottle = setTimeout(() => {
          const entities = viewer.entities.values;
          for (const entity of entities) {
            const building = buildings.find(b => b.facility.name === entity.name);
            if (building && entity.model) {
              const distance = calculateDistance(entity);
              // 거리 기반 LOD - 멀리 있는 빌딩은 숨김
              entity.show = distance < MAX_VISIBLE_DISTANCE;
            }
          }
          distanceUpdateThrottle = null;
        }, 200); // 200ms 스로틀링
      };

      // 카메라 이동 이벤트 리스너 (거리 기반 가시성 업데이트)
      viewer.scene.camera.moveEnd.addEventListener(updateBuildingVisibility);

      // 마우스 이동 이벤트 (호버 감지) - 스로틀링 적용
      const onMouseMove = (event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        if (mouseEventThrottle) return; // 스로틀링
        
        mouseEventThrottle = setTimeout(() => {
          const pickedObject = viewer.scene.pick(event.endPosition);
          
          if (pickedObject && pickedObject.id) {
            const building = buildings.find(b => b.facility.name === pickedObject.id.name);
            
            if (building) {
              canvas.style.cursor = 'pointer';
              
              if (highlightedEntity !== pickedObject.id) {
                // 이전 하이라이트 제거 (테두리 완전 제거)
                if (highlightedEntity && highlightedEntity.model) {
                  highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(0);
                  highlightedEntity.model.silhouetteColor = undefined;
                }
                
                // 새로운 하이라이트 적용 (호버 시에만)
                highlightedEntity = pickedObject.id;
                if (highlightedEntity && highlightedEntity.model) {
                  highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(HOVER_SILHOUETTE_SIZE);
                  highlightedEntity.model.silhouetteColor = new Cesium.ConstantProperty(Cesium.Color.CYAN);
                }
              }
              mouseEventThrottle = null;
              return;
            }
          }
          
          // 빌딩 밖으로 마우스가 나갔을 때
          canvas.style.cursor = 'default';
          
          if (highlightedEntity && highlightedEntity.model) {
            // 테두리 완전 제거
            highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(0);
            highlightedEntity.model.silhouetteColor = undefined;
            highlightedEntity = null;
          }
          mouseEventThrottle = null;
        }, 50); // 50ms 스로틀링
      };

      // 더블클릭 이벤트 - 실내 지도 전환 로직 (단일 클릭과 구분)
      const onLeftClick = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedObject = viewer.scene.pick(event.position);
        if (pickedObject && pickedObject.id) {
          const building = buildings.find(b => b.facility.name === pickedObject.id.name);
          
          if (building) {
            const camera = viewer.scene.camera;
            const clickedPosition = viewer.scene.pickPosition(event.position);
            
            if (clickedPosition) {
              const cartographic = Cesium.Cartographic.fromCartesian(clickedPosition);
              const longitude = Cesium.Math.toDegrees(cartographic.longitude);
              const latitude = Cesium.Math.toDegrees(cartographic.latitude);
              const height = cartographic.height + 20;
              
              camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
                orientation: {
                  heading: camera.heading,
                  pitch: camera.pitch,
                  roll: camera.roll
                },
                duration: 3.0, // 3초로 더 느리게
                easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT, // 부드러운 곡선 이동
                complete: () => {
                  // 카메라 이동이 완료된 후 화면 전환
                  setSelectedBuilding(building);
                  if (onBuildingClick) {
                    onBuildingClick(building.facility.id, building.facility.name);
                  }
                }
              });
            } else {
              // pickPosition이 실패한 경우 기존 방식 사용 (곡선 이동)
              const currentPosition = camera.position;
              const direction = camera.direction;
              const moveDistance = 800.0;
              const forwardVector = Cesium.Cartesian3.multiplyByScalar(direction, moveDistance, new Cesium.Cartesian3());
              const newPosition = Cesium.Cartesian3.add(currentPosition, forwardVector, new Cesium.Cartesian3());
              
              camera.flyTo({
                destination: newPosition,
                orientation: {
                  direction: camera.direction,
                  up: camera.up
                },
                duration: 3.0,
                easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT, // 부드러운 곡선 이동
                complete: () => {
                  setSelectedBuilding(building);
                  if (onBuildingClick) {
                    onBuildingClick(building.facility.id, building.facility.name);
                  }
                }
              });
            }
          }
        }
      };

      // 이벤트 리스너 등록
      screenSpaceEventHandler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      screenSpaceEventHandler.setInputAction(onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 초기 가시성 업데이트
      if (buildings.length > 0) {
        setTimeout(updateBuildingVisibility, 100);
      }

      // 컴포넌트 언마운트 시 정리
      return () => {
        viewer.scene.camera.moveEnd.removeEventListener(updateBuildingVisibility);
        screenSpaceEventHandler.destroy();
        canvas.style.cursor = 'default';
        
        // 스로틀 타이머 정리
        if (mouseEventThrottle) {
          clearTimeout(mouseEventThrottle);
        }
        if (distanceUpdateThrottle) {
          clearTimeout(distanceUpdateThrottle);
        }
        
        if (highlightedEntity && highlightedEntity.model) {
          highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(0);
          highlightedEntity.model.silhouetteColor = undefined;
        }
      };
    }, [viewer]);

    return null;
  };

  // 선택된 빌딩으로 카메라 이동을 처리하는 컴포넌트 (검색 결과 선택 시)
  const CameraController: React.FC = () => {
    const { viewer } = useCesium();
    const searchSelectedBuilding = useBuildingStore(state => state.searchSelectedBuilding);

    React.useEffect(() => {
      if (!viewer || !searchSelectedBuilding) return;

      const building = searchSelectedBuilding;
      const buildingPosition = getBuildingPosition(building.facility.id);
      
      const camera = viewer.scene.camera;
      const cameraHeight = buildingPosition.height + 400;
      
      const offsetLongitude = 0.005;
      const offsetLatitude = 0.005;
      
      const cameraLongitude = buildingPosition.longitude + offsetLongitude;
      const cameraLatitude = buildingPosition.latitude + offsetLatitude;
      
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(cameraLongitude, cameraLatitude, cameraHeight),
        orientation: {
          heading: Cesium.Math.toRadians(225),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0.0
        },
        duration: 2.5 
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
              <p className="text-lg font-semibold mb-2">⏳ 3D 지도 로딩 중...</p>
            </div>
          </div>
        </div>
      )}
      <Viewer
        ref={(viewer) => {
          if (viewer?.cesiumElement) {
            viewerRef.current = viewer.cesiumElement;
          }
        }}
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
        // 성능 최적화 설정
        scene3DOnly={true} // 3D 모드만 사용
        orderIndependentTranslucency={false} // 반투명 렌더링 최적화
        requestRenderMode={true} // 필요할 때만 렌더링
        maximumRenderTimeChange={Infinity} // 렌더링 시간 제한 없음
      >
        <Cesium3DTileset
          url={Cesium.IonResource.fromAssetId(2275207)}
          maximumScreenSpaceError={2} // 메모리 사용량 조절
          cullWithChildrenBounds={false} // 성능 최적화
          dynamicScreenSpaceError={true} // 동적 스크린 스페이스 에러
          preloadWhenHidden={false} // 숨겨진 타일 미리 로드 안함
          onReady={(tileset) => {
            tilesetRef.current = tileset; 
            tileset.cullRequestsWhileMoving = true; // 이동 중 요청 제한
            tileset.cullRequestsWhileMovingMultiplier = 60.0; // 이동 중 멀티플라이어
            
            setTilesetLoaded(true);
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
        <BuildingInteractionHandler />
        <CameraController />
        <MapControls />
      </Viewer>      
    </div>
  )
}

export default OutdoorMap
