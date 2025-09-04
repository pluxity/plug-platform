import { optimizeTileset, createTerrainProvider } from '../lib/cesiumFactories';

import * as Cesium from 'cesium';
import React, { useMemo } from 'react';
import { Scene, Cesium3DTileset } from 'resium';

import { CESIUM_ION_ACCESS_TOKEN, CESIUM_ION_ASSET_ID } from '../constants';
import { BaseCesiumViewer } from './BaseCesiumViewer';
import InitialCameraSetup from './CameraSetup';
Cesium.Ion.defaultAccessToken = CESIUM_ION_ACCESS_TOKEN;

interface OSMBuildingsMapProps {
  className?: string;
  children?: React.ReactNode;
}

const OSMBuildingsMap: React.FC<OSMBuildingsMapProps> = ({ className, children }) => {
  const tilesetUrl = useMemo(
    () => Cesium.IonResource.fromAssetId(CESIUM_ION_ASSET_ID),
    [],
  );
  const terrainProvider = useMemo(() => createTerrainProvider(), []);

  return (
    <BaseCesiumViewer
      className={`${className} w-full h-full`}
      sceneMode={Cesium.SceneMode.SCENE3D}
      terrainProvider={terrainProvider}
    >
      <Scene />
      <Cesium3DTileset url={tilesetUrl} onReady={optimizeTileset} />
      {children}
      <InitialCameraSetup />
    </BaseCesiumViewer>
  );
};

export default OSMBuildingsMap;
