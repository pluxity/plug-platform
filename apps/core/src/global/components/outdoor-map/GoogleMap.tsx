import React from 'react';
import * as Cesium from 'cesium';
import { Viewer as ResiumViewer, Scene, Cesium3DTileset } from 'resium';
import InitialCameraSetup from './CameraSetup';
import { GOOGLE_MAPS_API_KEY } from './constants';

interface GoogleMapProps {
  className?: string;
  children?: React.ReactNode;
}

export default function GoogleMap({ className, children}: GoogleMapProps) {
  
  const googleTilesUrl = `https://tile.googleapis.com/v1/3dtiles/root.json?key=${GOOGLE_MAPS_API_KEY}`;

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
      >
        <Scene />
        
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
        
        <InitialCameraSetup/>
      </ResiumViewer>
    </>
  );
}
