import React, { useState } from 'react'
import { Viewer, Cesium3DTileset, useCesium } from 'resium'
import * as Cesium from 'cesium'
import { Button } from '@plug/ui'

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
      
      // 서울시청 좌표 (위도: 37.5666805, 경도: 126.9784147)
      // 높이를 더 낮춰서 지면에 가깝게 설정
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(126.9784147, 37.5666805, 500),
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
        title="서울시청으로"
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

const OutdoorMap: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-700">Photorealistic 3D 지도 로딩 중...</span>
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
            setIsLoading(false)
          }}
        />
        
        <Cesium3DTileset
          url={Cesium.IonResource.fromAssetId(96188)}
          onReady={(tileset) => {
            setIsLoading(false);
            const heightOffset = -10;
            const translation = new Cesium.Cartesian3(0, 0, heightOffset);
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
          }}
        />
        
        <MapControls />
      </Viewer>
    </div>
  )
}

export default OutdoorMap
