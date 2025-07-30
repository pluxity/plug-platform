import React, { useEffect } from 'react';
import * as Cesium from 'cesium';
import { useCesium } from 'resium';

const InitialCameraSetup: React.FC = () => {
  const { viewer } = useCesium();

  useEffect(() => {
    if (viewer) {
      const cameraController = viewer.scene.screenSpaceCameraController;
      
      // 카메라 컨트롤 이벤트 설정만 수행
      cameraController.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG]; // 좌클릭으로 틸트
      cameraController.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG]; // 우클릭으로 회전
      cameraController.zoomEventTypes = [
          Cesium.CameraEventType.WHEEL, // 마우스 휠로 줌
          Cesium.CameraEventType.PINCH  // 핀치로 줌
      ];
      cameraController.translateEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG]; // 휠클릭으로 패닝
    }
  }, [viewer]);

  return null;
};

export default InitialCameraSetup;
