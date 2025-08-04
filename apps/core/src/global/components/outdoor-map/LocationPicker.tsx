import React, { useEffect, useState, useCallback } from 'react';
import { useCesium } from 'resium';
import * as Cesium from 'cesium';
import { Button } from '@plug/ui';

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number;
  cartographicHeight: number; // 지형 높이
}

interface LocationPickerProps {
  onLocationSelect?: (location: LocationData) => void;
  onLocationChange?: (location: LocationData) => void;
  initialLocation?: Partial<LocationData>;
  enabled?: boolean;
  showMarker?: boolean;
  markerColor?: Cesium.Color;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  onLocationChange,
  initialLocation,
  enabled = true,
  showMarker = true,
  markerColor = Cesium.Color.RED
}) => {
  const { viewer } = useCesium();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isPickingMode, setIsPickingMode] = useState(false);
  const [markerEntity, setMarkerEntity] = useState<Cesium.Entity | null>(null);
  const [terrainProvider, setTerrainProvider] = useState<Cesium.TerrainProvider | null>(null);

  // 지형 고도 정보를 위한 terrain provider 설정
  useEffect(() => {
    if (!viewer) return;

    const setupTerrain = async () => {
      try {
        // Cesium World Terrain 사용
        const terrain = await Cesium.createWorldTerrainAsync({
          requestWaterMask: true,
          requestVertexNormals: true
        });
        viewer.terrainProvider = terrain;
        setTerrainProvider(terrain);
      } catch (error) {
        console.warn('Failed to load world terrain, using default ellipsoid terrain:', error);
        const ellipsoidTerrain = new Cesium.EllipsoidTerrainProvider();
        viewer.terrainProvider = ellipsoidTerrain;
        setTerrainProvider(ellipsoidTerrain);
      }
    };

    setupTerrain();
  }, [viewer]);

  // 지형 높이를 가져오는 함수
  const getTerrainHeight = useCallback(async (longitude: number, latitude: number): Promise<number> => {
    if (!viewer || !terrainProvider) return 0;

    try {
      const positions = [Cesium.Cartographic.fromDegrees(longitude, latitude)];
      const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
      return updatedPositions[0].height || 0;
    } catch (error) {
      console.warn('Failed to sample terrain height:', error);
      return 0;
    }
  }, [viewer, terrainProvider]);

  // 마커 업데이트 함수
  const updateMarker = useCallback((location: LocationData) => {
    if (!viewer || !showMarker) return;

    // 기존 마커 제거
    if (markerEntity) {
      viewer.entities.remove(markerEntity);
    }

    // 새 마커 생성
    const position = Cesium.Cartesian3.fromDegrees(
      location.longitude,
      location.latitude,
      location.altitude
    );

    const entity = viewer.entities.add({
      id: 'location-picker-marker',
      position: position,
      billboard: {
        image: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.2 0 0 7.2 0 16c0 16 16 24 16 24s16-8 16-24c0-8.8-7.2-16-16-16z" 
                  fill="${markerColor.toCssColorString()}" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
          </svg>
        `),
        scale: 1.0,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      },
      label: {
        text: `위도: ${location.latitude.toFixed(6)}\n경도: ${location.longitude.toFixed(6)}\n고도: ${location.altitude.toFixed(1)}m`,
        font: '12px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -60),
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
        backgroundPadding: new Cesium.Cartesian2(8, 4)
      }
    });

    setMarkerEntity(entity);
  }, [viewer, showMarker, markerEntity, markerColor]);

  // 초기 위치 설정
  useEffect(() => {
    if (initialLocation && viewer) {
      const location: LocationData = {
        latitude: initialLocation.latitude || 37.459722,
        longitude: initialLocation.longitude || 127.023556,
        altitude: initialLocation.altitude || 100,
        cartographicHeight: initialLocation.cartographicHeight || 0
      };
      setSelectedLocation(location);
      updateMarker(location);
    }
  }, [initialLocation, viewer, updateMarker]);

  // 클릭 이벤트 처리
  useEffect(() => {
    if (!viewer || !enabled) return;

    let clickHandler: ((event: MouseEvent) => void) | null = null;

    if (isPickingMode) {
      clickHandler = async (event: MouseEvent) => {
        const canvasPosition = new Cesium.Cartesian2(event.clientX, event.clientY);
        
        // 지형과의 교차점 찾기
        const ray = viewer.camera.getPickRay(canvasPosition);
        if (!ray) return;

        const intersection = viewer.scene.globe.pick(ray, viewer.scene);
        if (!intersection) return;

        const cartographic = Cesium.Cartographic.fromCartesian(intersection);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        
        // 지형 높이 가져오기
        const terrainHeight = await getTerrainHeight(longitude, latitude);
        
        const location: LocationData = {
          latitude,
          longitude,
          altitude: terrainHeight + 100, // 지형 위 100m
          cartographicHeight: terrainHeight
        };

        setSelectedLocation(location);
        updateMarker(location);
        setIsPickingMode(false);
        
        onLocationSelect?.(location);
      };

      viewer.canvas.addEventListener('click', clickHandler);
      viewer.canvas.style.cursor = 'crosshair';
    }

    return () => {
      if (clickHandler) {
        viewer.canvas.removeEventListener('click', clickHandler);
        viewer.canvas.style.cursor = 'default';
      }
    };
  }, [viewer, enabled, isPickingMode, getTerrainHeight, updateMarker, onLocationSelect]);

  // 고도 변경 함수
  const changeAltitude = useCallback((delta: number) => {
    if (!selectedLocation) return;

    const newLocation: LocationData = {
      ...selectedLocation,
      altitude: Math.max(selectedLocation.cartographicHeight, selectedLocation.altitude + delta)
    };

    setSelectedLocation(newLocation);
    updateMarker(newLocation);
    onLocationChange?.(newLocation);
  }, [selectedLocation, updateMarker, onLocationChange]);

  // 선택된 위치로 카메라 이동
  const flyToLocation = useCallback(() => {
    if (!viewer || !selectedLocation) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        selectedLocation.longitude,
        selectedLocation.latitude,
        selectedLocation.altitude + 500
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0
      },
      duration: 2.0
    });
  }, [viewer, selectedLocation]);

  const buttonClassName = "px-3 py-1.5 text-sm font-medium rounded-md transition-colors";
  const iconButtonClassName = "p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <div className="absolute bottom-4 left-4 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[280px]">
      <div className="space-y-3">
        {/* 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          위치 선택기
        </h3>

        {/* 위치 선택 버튼 */}
        <div className="flex gap-2">
          <Button
            onClick={() => setIsPickingMode(!isPickingMode)}
            variant={isPickingMode ? "default" : "outline"}
            className={`${buttonClassName} flex-1`}
            disabled={!enabled}
          >
            {isPickingMode ? '선택 취소' : '위치 선택'}
          </Button>
          
          {selectedLocation && (
            <Button
              onClick={flyToLocation}
              variant="outline"
              size="icon"
              className={iconButtonClassName}
              title="선택된 위치로 이동"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Button>
          )}
        </div>

        {/* 선택된 위치 정보 */}
        {selectedLocation && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <div>위도: {selectedLocation.latitude.toFixed(6)}</div>
              <div>경도: {selectedLocation.longitude.toFixed(6)}</div>
              <div>지형 고도: {selectedLocation.cartographicHeight.toFixed(1)}m</div>
            </div>

            {/* 고도 조절 */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                설정 고도: {selectedLocation.altitude.toFixed(1)}m
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => changeAltitude(-10)}
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs"
                >
                  -10m
                </Button>
                <Button
                  onClick={() => changeAltitude(-1)}
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs"
                >
                  -1m
                </Button>
                <Button
                  onClick={() => changeAltitude(1)}
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs"
                >
                  +1m
                </Button>
                <Button
                  onClick={() => changeAltitude(10)}
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs"
                >
                  +10m
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 도움말 */}
        <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-2">
          {isPickingMode ? (
            <span className="text-blue-600 dark:text-blue-400">
              🎯 지도를 클릭하여 위치를 선택하세요
            </span>
          ) : (
            <span>
              위치 선택 버튼을 눌러 지도에서 원하는 위치를 선택하세요
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
