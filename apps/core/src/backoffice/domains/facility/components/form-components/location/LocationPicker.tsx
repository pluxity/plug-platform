import { LocationData } from '../../../types/form';

import * as Cesium from 'cesium';
import React, { useCallback, useRef, useEffect } from 'react';
import { Entity, useCesium } from 'resium';
interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  enabled: boolean;
  showMarker: boolean;
  markerModelUrl?: string; // 마커 glb 파일 경로
}

const LocationPickerComponent: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  enabled,
  showMarker,
  markerModelUrl = '/models/marker.glb', // public/models/marker.glb 파일
}) => {
  const { viewer } = useCesium();
  const handlerRef = useRef<Cesium.ScreenSpaceEventHandler | null>(null);
  const [markerPosition, setMarkerPosition] = React.useState<Cesium.Cartesian3 | null>(
    initialLocation
      ? Cesium.Cartesian3.fromDegrees(
          initialLocation.longitude,
          initialLocation.latitude,
          initialLocation.altitude
        )
      : null
  );

  const handleClick = useCallback(
    (click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      if (!viewer || !enabled) return;

      // 먼저 3D 타일 표면을 시도
      let pickedPosition = viewer.scene.pickPosition(click.position);
      
      if (!pickedPosition) {
        // 3D 타일이 없는 경우 기본 지구 표면 사용
        const ellipsoidPosition = viewer.camera.pickEllipsoid(
          click.position,
          viewer.scene.globe.ellipsoid
        );
        if (ellipsoidPosition) {
          pickedPosition = ellipsoidPosition;
        }
      }

      if (pickedPosition) {
        const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const altitude = cartographic.height || 0;

        const location: LocationData = {
          latitude,
          longitude,
          altitude,
        };

        onLocationSelect(location);
        setMarkerPosition(pickedPosition);
      }
    },
    [viewer, enabled, onLocationSelect]
  );

  useEffect(() => {
    if (!viewer || !enabled) return;

    // 기존 핸들러 정리
    if (handlerRef.current) {
      handlerRef.current.destroy();
    }

    // 새 핸들러 생성
    handlerRef.current = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handlerRef.current.setInputAction(handleClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      if (handlerRef.current) {
        handlerRef.current.destroy();
        handlerRef.current = null;
      }
    };
  }, [viewer, enabled, handleClick]);

  // 마커 표시
  if (!showMarker || !markerPosition) {
    return null;
  }

  return (
    <Entity
      position={markerPosition}
      orientation={Cesium.Transforms.headingPitchRollQuaternion(
        markerPosition,
        new Cesium.HeadingPitchRoll(0, 0, 0) // 방향 설정
      )}
      model={{
        uri: markerModelUrl,
        scale: 10.0,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        color: Cesium.Color.WHITE, // 모델 색상 조정 가능
      }}
    />
  );
};

// React.memo로 감싸서 불필요한 리렌더링 방지
export const LocationPicker = React.memo(LocationPickerComponent);
