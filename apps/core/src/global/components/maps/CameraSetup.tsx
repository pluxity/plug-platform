import React, { useEffect } from 'react';
import * as Cesium from 'cesium';
import { useCesium } from 'resium';

interface CameraSetupProps {
  initialPosition?: {
    longitude: number
    latitude: number
    altitude: number
  }
  onInitialSetupComplete?: () => void
  hasInitialized?: boolean
}

const InitialCameraSetup: React.FC<CameraSetupProps> = ({
  initialPosition = {
    longitude: 127.023556,
    latitude: 37.459722,
    altitude: 1000
  },
  onInitialSetupComplete,
  hasInitialized = false
}) => {
  const { viewer } = useCesium();

  useEffect(() => {
    if (viewer) {
      const cameraController = viewer.scene.screenSpaceCameraController;
      
      cameraController.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG];
      cameraController.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];
      cameraController.zoomEventTypes = [
          Cesium.CameraEventType.WHEEL,
          Cesium.CameraEventType.PINCH
      ];
      cameraController.translateEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG];

      if (!hasInitialized) {
        const camera = viewer.scene.camera;
        camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            initialPosition.longitude,
            initialPosition.latitude,
            initialPosition.altitude
          ),
          duration: 0,
          complete: () => {
            onInitialSetupComplete?.();
          }
        });
      }
    }
  }, [viewer, initialPosition, hasInitialized, onInitialSetupComplete]);

  return null;
};

export default InitialCameraSetup;
