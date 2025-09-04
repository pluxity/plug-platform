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
}

const VWorldMap: React.FC<VWorldMapProps> = ({
  className = 'w-full h-full',
  children,
  mapProvider = 'vworld',
  preventCameraReset = false,
  onMapInitialized,
}) => {
  const imageryProvider = useMemo(
    () => createImageryProvider(mapProvider),
    [mapProvider],
  );

  return (
    <BaseCesiumViewer className={className} sceneMode={Cesium.SceneMode.SCENE3D}>
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
