import { createImageryProvider } from '../lib/cesiumFactories';

import * as Cesium from 'cesium';
import React, { useMemo } from 'react';
import { Scene, ImageryLayer } from 'resium';

import { MapProvider } from '../constants';
import { BaseCesiumViewer } from './BaseCesiumViewer';
import InitialCameraSetup from './CameraSetup';
interface VWorldMapProps {
  className?: string;
  children?: React.ReactNode;
  mapProvider?: MapProvider;
  preventCameraReset?: boolean;
  onMapInitialized?: () => void;
  enableTerrain?: boolean;
}

const VWorldMap: React.FC<VWorldMapProps> = ({
  className = 'w-full h-full',
  children,
  mapProvider = 'vworld',
  preventCameraReset = false,
  onMapInitialized,
  enableTerrain = false,
}) => {
  const imageryProvider = useMemo(
    () => createImageryProvider(mapProvider),
    [mapProvider],
  );

  const viewerProps = useMemo(() => {
    const props: { terrainProvider?: Cesium.TerrainProvider | Promise<Cesium.TerrainProvider> } = {};
    if (enableTerrain) {
      // WorldTerrain을 사용하도록 설정
      props.terrainProvider = Cesium.createWorldTerrainAsync();
    } else {
      // 평면 지형 사용
      props.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    }
    return props;
  }, [enableTerrain]);

  return (
    <BaseCesiumViewer 
      className={className} 
      sceneMode={Cesium.SceneMode.SCENE3D}
      {...viewerProps}
    >
      <Scene />
      <InitialCameraSetup
        hasInitialized={preventCameraReset}
        onInitialSetupComplete={onMapInitialized}
      />
      <ImageryLayer imageryProvider={imageryProvider} />
      {children}
    </BaseCesiumViewer>
  );
};

export default VWorldMap;
