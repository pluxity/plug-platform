import React, { useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import { OSMBuildingsMap } from '@/global/components/outdoor-map';
import LocationPicker, { LocationData } from './LocationPicker';
import MapControls from './MapControls';
import { Button } from '@plug/ui';

interface MapLocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationConfirm: (location: LocationData) => void;
  initialLocation?: Partial<LocationData>;
  title?: string;
  description?: string;
}

const MapLocationSelector: React.FC<MapLocationSelectorProps> = ({
  isOpen,
  onClose,
  onLocationConfirm,
  initialLocation,
  title = "위치 선택",
  description = "지도에서 시설의 위치를 선택하고 고도를 설정하세요."
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleLocationSelect = useCallback((location: LocationData) => {
    setSelectedLocation(location);
  }, []);

  const handleLocationChange = useCallback((location: LocationData) => {
    setSelectedLocation(location);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedLocation) {
      onLocationConfirm(selectedLocation);
      onClose();
    }
  }, [selectedLocation, onLocationConfirm, onClose]);

  const handleCancel = useCallback(() => {
    setSelectedLocation(null);
    onClose();
  }, [onClose]);

  const handleInitialLoadComplete = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[90vw] h-[80vh] max-w-7xl bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          </div>
          <Button
            onClick={handleCancel}
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* 지도 영역 */}
        <div className="relative flex-1 h-[calc(80vh-140px)]">
          {!isMapLoaded && (
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  지도 로딩 중...
                </span>
              </div>
            </div>
          )}

          <OSMBuildingsMap className="w-full h-full">
            <MapControls onInitialLoadComplete={handleInitialLoadComplete} />
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              onLocationChange={handleLocationChange}
              initialLocation={initialLocation}
              enabled={isMapLoaded}
              showMarker={true}
              markerColor={Cesium.Color.ORANGE}
            />
          </OSMBuildingsMap>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex-1">
            {selectedLocation && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">선택된 위치:</span>{' '}
                위도 {selectedLocation.latitude.toFixed(6)}, 
                경도 {selectedLocation.longitude.toFixed(6)}, 
                고도 {selectedLocation.altitude.toFixed(1)}m
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="px-6"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="px-6"
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocationSelector;
