import React, { useEffect } from 'react';
import * as Cesium from 'cesium';
import { Viewer as ResiumViewer, Scene, Cesium3DTileset, useCesium } from 'resium';

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyBn49Az8XCIk2zTj42aogqbf47y5D-E1ak';
interface GoogleMapProps {
  className?: string;
  children?: React.ReactNode;
}

const InitialCameraSetup: React.FC = () => {
  const { viewer } = useCesium();

  useEffect(() => {
    if (viewer) {
      const camera = viewer.scene.camera;
      const cameraController = viewer.scene.screenSpaceCameraController;
      
      // 카메라 컨트롤 이벤트 설정
      cameraController.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG]; // 좌클릭으로 틸트
      cameraController.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG]; // 우클릭으로 회전
      cameraController.zoomEventTypes = [
          Cesium.CameraEventType.WHEEL, // 마우스 휠로 줌
          Cesium.CameraEventType.PINCH  // 핀치로 줌
      ];
      cameraController.translateEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG]; // 휠클릭으로 패닝
      
      // 초기 카메라 위치 설정 (서울)
      camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(126.990500, 37.532200, 1000),
          duration: 2.0,
      });
    }
  }, [viewer]);

  return null;
};

export default function GoogleMap({ className = "w-full h-full", children }: GoogleMapProps) {
  
  const googleTilesUrl = `https://tile.googleapis.com/v1/3dtiles/root.json?key=${GOOGLE_MAPS_API_KEY}`;

  return (
    <div className={`${className} relative`}>
      {/* Hidden credit container to suppress Cesium credits */}
      <div id="cesium-credit-container" style={{ display: 'none' }}></div>
      
      <ResiumViewer 
        className="cesium-container w-full h-full"
        full
        sceneMode={Cesium.SceneMode.SCENE3D}
        animation={false}
        timeline={false}
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
        creditContainer="cesium-credit-container"
      >
        <Scene />
        
        {/* VWorld 위성 이미지 베이스 레이어 - 제거됨 */}
        
        {/* Google Maps Photorealistic 3D Tiles */}
        <Cesium3DTileset
          url={googleTilesUrl}
          onReady={(tileset) => {
            tileset.maximumScreenSpaceError = 16;
            tileset.skipLevelOfDetail = true;
            tileset.baseScreenSpaceError = 1024;
            tileset.skipScreenSpaceErrorFactor = 16;
            tileset.skipLevels = 1;
            tileset.immediatelyLoadDesiredLevelOfDetail = false;
            tileset.loadSiblings = false;
          }}
        />
        
        {children}
        
        <InitialCameraSetup />
      </ResiumViewer>
    </div>
  );
}
