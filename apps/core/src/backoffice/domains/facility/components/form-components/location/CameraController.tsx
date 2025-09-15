import React, { useEffect, useRef } from 'react';
import { useCesium } from 'resium';
import { flyToLocation } from '@/global/components/outdoor-map/lib/cameraSettings';

interface CameraControllerProps {
  latitude?: number;
  longitude?: number;
  isOpen: boolean;
  onInitialSetupComplete?: () => void;
  cameraOptions?: {
    duration?: number;
    height?: number;
    range?: number;
    headingDeg?: number;
    pitchDeg?: number;
  };
}

export const CameraController: React.FC<CameraControllerProps> = ({
  latitude,
  longitude,
  isOpen,
  onInitialSetupComplete,
  cameraOptions = {},
}) => {
  const { viewer } = useCesium();
  const setupRef = useRef(false);

  useEffect(() => {
    if (!viewer || !isOpen || setupRef.current) return;
    
    setupRef.current = true;

    // Dialog가 열리고 viewer가 준비되면 잠시 후에 카메라 이동
    const timer = setTimeout(() => {
      if (latitude && longitude) {
        const {
          duration = 1.5,
          height = 20,
          range = 2000,
          headingDeg = 0,
          pitchDeg = -45,
        } = cameraOptions;

        flyToLocation(viewer, longitude, latitude, {
          duration,
          height,
          range,
          headingDeg,
          pitchDeg,
        });
        
        // 카메라 이동 완료 콜백
        if (onInitialSetupComplete) {
          setTimeout(onInitialSetupComplete, (duration * 1000) + 100);
        }
      } else if (onInitialSetupComplete) {
        // 초기 위치가 없어도 콜백 실행
        onInitialSetupComplete();
      }
    }, 100); // 지도가 완전히 로드된 후 실행

    return () => clearTimeout(timer);
  }, [viewer, latitude, longitude, isOpen, onInitialSetupComplete, cameraOptions]);

  // Dialog가 닫히면 초기화 상태 리셋
  useEffect(() => {
    if (!isOpen) {
      setupRef.current = false;
    }
  }, [isOpen]);

  return null;
};
