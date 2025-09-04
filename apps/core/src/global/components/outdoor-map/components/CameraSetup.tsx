import { HOME_LOCATION, HOME_OVERVIEW } from '../lib/cameraSettings';

import * as Cesium from 'cesium';
import React, { useEffect, useRef } from 'react';
import { useCesium } from 'resium';
interface CameraSetupProps {
  onInitialSetupComplete?: () => void;
  hasInitialized?: boolean;
}

const InitialCameraSetup: React.FC<CameraSetupProps> = ({
  onInitialSetupComplete,
  hasInitialized = false,
}) => {
  const { viewer } = useCesium();
  const initRef = useRef(false);

  useEffect(() => {
    if (!viewer || initRef.current || hasInitialized) return;
    initRef.current = true;

    const controller = viewer.scene.screenSpaceCameraController;
    controller.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG];
    controller.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];
    controller.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
    controller.translateEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG];

    const target = Cesium.Cartesian3.fromDegrees(
      HOME_LOCATION.longitude,
      HOME_LOCATION.latitude,
      0,
    );
    const heading = Cesium.Math.toRadians(HOME_OVERVIEW.headingDeg);
    const pitch = Cesium.Math.toRadians(HOME_OVERVIEW.pitchDeg);
    const range = Math.max(500, HOME_OVERVIEW.range);

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 80), {
      offset: new Cesium.HeadingPitchRange(heading, pitch, range),
      duration: 0,
      complete: () => onInitialSetupComplete?.(),
    });
  }, [viewer, hasInitialized, onInitialSetupComplete]);

  return null;
};

export default InitialCameraSetup;
