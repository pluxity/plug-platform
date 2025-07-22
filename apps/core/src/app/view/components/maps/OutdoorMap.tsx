import React, { useState, useEffect } from 'react'
import { Viewer, Cesium3DTileset, useCesium, Entity } from 'resium'
import * as Cesium from 'cesium'
import { Button } from '@plug/ui'
import { useBuildingStore } from '@/app/store/buildingStore'
import { useBuildings } from '@plug/common-services'

export const CESIUM_ION_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNWJmZWEzOS1jMTJjLTQ0ZTYtOTFkNC1jZDMxMDlmYTRjMWEiLCJpZCI6MjgzMTA2LCJpYXQiOjE3NDE2NjE3OTR9.dZID1nZdOJeEv18BhwGwWlAjJQtWAFUDipJw7M4r0-w'

Cesium.Ion.defaultAccessToken = CESIUM_ION_ACCESS_TOKEN

// Building 위치 정보를 가져오는 함수
const getBuildingLocationData = (building: { facility: { lon: number; lat: number; locationMeta?: string } }) => {
  const facility = building.facility;
  
  // locationMeta JSON string을 파싱
  let locationMeta = {
    height: 0,
    heading: 0,
    pitch: 0,
    roll: 0
  };
  
  try {
    if (facility.locationMeta) {
      locationMeta = JSON.parse(facility.locationMeta);
    }
  } catch (error) {
    console.warn('Failed to parse locationMeta:', error);
  }
  
  return {
    longitude: facility.lon,
    latitude: facility.lat,
    height: locationMeta.height || 0,
    heading: locationMeta.heading || 0,
    pitch: locationMeta.pitch || 0,
    roll: locationMeta.roll || 0
  };
};

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

const OutdoorMap: React.FC<OutdoorMapProps> = ({ onBuildingClick }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [buildingEntitiesLoaded, setBuildingEntitiesLoaded] = useState<boolean>(false);
  const [tilesetLoaded, setTilesetLoaded] = useState<boolean>(false);
  const [cameraInitialized, setCameraInitialized] = useState<boolean>(false);
  
  const { buildings, setBuildings, buildingsFetched, setBuildingsFetched, setSelectedBuilding } = useBuildingStore()
  const { execute: fetchBuildings, data: buildingsData, error: buildingsError } = useBuildings();

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
    if (buildings.length > 0 && !buildingEntitiesLoaded) {
      setBuildingEntitiesLoaded(true);
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

      // 간단한 마우스 이벤트
      const onMouseMove = (event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        const pickedObject = viewer.scene.pick(event.endPosition);
        
        if (pickedObject && pickedObject.id) {
          const building = buildings.find(b => b.facility.name === pickedObject.id.name);
          
          if (building) {
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
                highlightedEntity.model.silhouetteSize = new Cesium.ConstantProperty(3.0);
                highlightedEntity.model.silhouetteColor = new Cesium.ConstantProperty(Cesium.Color.CYAN);
              }
            }
            return;
          }
        }
        
        // 빌딩 밖으로 마우스가 나갔을 때
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
          const building = buildings.find(b => b.facility.name === pickedObject.id.name);
          
          if (building) {
            setSelectedBuilding(building);
            if (onBuildingClick) {
              onBuildingClick(building.facility.id, building.facility.name);
            }
          }
        }
      };

      // 이벤트 리스너 등록
      screenSpaceEventHandler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      screenSpaceEventHandler.setInputAction(onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

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
      const buildingPosition = getBuildingLocationData(building);
      
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
          .slice(0, 5) // 처음 5개만 렌더링해서 테스트
          .map((building) => {
            const position = getBuildingLocationData(building);
            return (
              <Entity
                key={building.facility.id}
                name={building.facility.name}
                position={Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height)}
                model={{
                  uri: building.facility.drawing.url,
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
