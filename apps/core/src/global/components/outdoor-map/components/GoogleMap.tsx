import { optimizeTileset } from '../lib/cesiumFactories';

import * as Cesium from 'cesium';
import React from 'react';
import { Scene, Cesium3DTileset } from 'resium';

import { GOOGLE_MAPS_API_KEY } from '../constants';
import { BaseCesiumViewer } from './BaseCesiumViewer';
import InitialCameraSetup from './CameraSetup';
interface GoogleMapProps {
  className?: string;
  children?: React.ReactNode;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ className, children }) => {
  const tilesUrl = `https://tile.googleapis.com/v1/3dtiles/root.json?key=${GOOGLE_MAPS_API_KEY}`;

  return (
    <BaseCesiumViewer
      className={`${className} w-full h-full`}
      sceneMode={Cesium.SceneMode.SCENE3D}
    >
      <Scene />
      <Cesium3DTileset url={tilesUrl} onReady={optimizeTileset} />
      {children}
      <InitialCameraSetup />
    </BaseCesiumViewer>
  );
};

export default GoogleMap;
