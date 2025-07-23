import React, { useEffect } from 'react';
import * as Cesium from 'cesium';
import { Viewer as ResiumViewer, Scene, Cesium3DTileset, useCesium } from 'resium';

// 지도 설정
export const VWORLD_MAP_URL = 'https://api.vworld.kr/req/wmts/1.0.0/';
export const VWORLD_API_KEY = '39AE0FB0-78CC-3751-B102-8A8F21CF0FF3';

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyBn49Az8XCIk2zTj42aogqbf47y5D-E1ak';

// Cesium Ion Token (Terrain 용)
export const CESIUM_ION_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNWY3MDk5My1jOGMxLTQ2ZGItYjY3ZC0zY2QyMDQ5MWI3ZWUiLCJpZCI6MzI0MDQ5LCJpYXQiOjE3NTMyMzMyODZ9.rsPTO0h1sxIpMx_QTOww9khmpjyQo9PW2n_9ij4jAes';

Cesium.Ion.defaultAccessToken = CESIUM_ION_ACCESS_TOKEN;

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
      <ResiumViewer 
        className="cesium-container w-full h-full"
        full
        sceneMode={Cesium.SceneMode.SCENE3D}
        terrainProvider={new Cesium.EllipsoidTerrainProvider()}
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
      >
        <Scene />
        
        {/* VWorld 위성 이미지 베이스 레이어 - 제거됨 */}
        
        {/* Google Maps Photorealistic 3D Tiles */}
        <Cesium3DTileset
          url={googleTilesUrl}
          onReady={(tileset) => {
            console.log('Google 3D Tiles 로드 완료');
            // 3D Tiles 성능 최적화 설정
            tileset.maximumScreenSpaceError = 16;
            tileset.skipLevelOfDetail = true;
            tileset.baseScreenSpaceError = 1024;
            tileset.skipScreenSpaceErrorFactor = 16;
            tileset.skipLevels = 1;
            tileset.immediatelyLoadDesiredLevelOfDetail = false;
            tileset.loadSiblings = false;
          }}
          onAllTilesLoad={() => {
            console.log('모든 Google 3D Tiles 로드 완료');
          }}
        />
        
        {children}
        
        <InitialCameraSetup />
      </ResiumViewer>
    </div>
  );
}
