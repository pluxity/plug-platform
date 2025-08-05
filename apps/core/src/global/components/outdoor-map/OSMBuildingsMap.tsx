import React from 'react';
import * as Cesium from 'cesium';
import { Viewer as ResiumViewer, Scene, Cesium3DTileset } from 'resium';
import InitialCameraSetup from './CameraSetup';
import { CESIUM_ION_ASSET_ID, CESIUM_ION_ACCESS_TOKEN } from './constants';

interface OSMBuildingsMapProps {
  className?: string;
  children?: React.ReactNode;
}

export default function OSMBuildingsMap({ className, children }: OSMBuildingsMapProps) {
  
  // Cesium Ion 설정
  React.useEffect(() => {
    Cesium.Ion.defaultAccessToken = CESIUM_ION_ACCESS_TOKEN;
  }, []);

  const osmBuildingsTilesetUrl = React.useMemo(() => {
    return Cesium.IonResource.fromAssetId(CESIUM_ION_ASSET_ID);
  }, []);

  // Cesium World Terrain 사용 (고도 정보 포함)
  const terrainProvider = React.useMemo(() => {
    return Cesium.createWorldTerrainAsync({
      requestWaterMask: true, // 물 마스크 요청
      requestVertexNormals: true // 법선 벡터 요청 (조명 효과)
    });
  }, []);

  return (
    <>
      <div id="cesium-credit-container" style={{ display: 'none' }}></div>
      
      <ResiumViewer 
        className={`${className} cesium-container w-full h-full`}
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
        terrainProvider={terrainProvider}
      >
        <Scene />
        
        <Cesium3DTileset
          url={osmBuildingsTilesetUrl}
          onReady={(tileset) => {
            // 성능 최적화 설정
            tileset.maximumScreenSpaceError = 16;
            tileset.skipLevelOfDetail = true;
            tileset.baseScreenSpaceError = 1024;
            tileset.skipScreenSpaceErrorFactor = 16;
            tileset.skipLevels = 1;
            tileset.immediatelyLoadDesiredLevelOfDetail = false;
            tileset.loadSiblings = false;
            
            // 건물을 terrain에 맞게 조정
            // clampToHeight 옵션으로 건물이 지형을 따라가도록 설정
            tileset.style = new Cesium.Cesium3DTileStyle({
              heightOffset: '0' // 건물 높이 오프셋을 0으로 설정
            });
          }}
        />
        
        {children}
        
        <InitialCameraSetup/>
      </ResiumViewer>
    </>
  );
}
