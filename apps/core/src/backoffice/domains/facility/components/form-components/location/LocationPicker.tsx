import React, { useCallback, useRef, useEffect } from 'react';
import * as Cesium from 'cesium';
import { Entity, useCesium } from 'resium';
import { LocationData } from '../../../types/form';

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  enabled: boolean;
  showMarker: boolean;
}

const LocationPickerComponent: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  enabled,
  showMarker,
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

      const pickedPosition = viewer.camera.pickEllipsoid(
        click.position,
        viewer.scene.globe.ellipsoid
      );

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
      billboard={{
        image: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="#ff0000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `),
        scale: 1.0,
        pixelOffset: new Cesium.Cartesian2(0, -16),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      }}
    />
  );
};

// React.memo로 감싸서 불필요한 리렌더링 방지
export const LocationPicker = React.memo(LocationPickerComponent);
