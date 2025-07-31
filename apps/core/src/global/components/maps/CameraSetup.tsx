import React, { useEffect } from 'react';
import * as Cesium from 'cesium';
import { useCesium } from 'resium';

interface CameraSetupProps {
  // 초기 카메라 위치 설정용
  initialPosition?: {
    longitude: number
    latitude: number
    altitude: number
  }
  // 초기화 완료 콜백
  onInitialSetupComplete?: () => void
  // 초기화 여부 플래그
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
      
      // 카메라 컨트롤 이벤트 설정
      cameraController.tiltEventTypes = [Cesium.CameraEventType.LEFT_DRAG]; // 좌클릭으로 틸트
      cameraController.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG]; // 우클릭으로 회전
      cameraController.zoomEventTypes = [
          Cesium.CameraEventType.WHEEL, // 마우스 휠로 줌
          Cesium.CameraEventType.PINCH  // 핀치로 줌
      ];
      cameraController.translateEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG]; // 휠클릭으로 패닝

      // 초기 카메라 위치 설정 (아직 초기화되지 않은 경우만)
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
