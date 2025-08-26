import React, { useState, useRef, useCallback } from 'react';
import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogFooter 
} from '@plug/ui';
import { VWorldMap } from '@/global/components/outdoor-map';
import { LocationData } from '../../../types/form';
import { LocationPicker } from './LocationPicker';

interface MapLocationSelectorProps {
  isOpen: boolean;
  initialLat?: number;
  initialLon?: number;
  onLocationSelect: (lat: number, lon: number) => void;
  onClose: () => void;
}

export const MapLocationSelector: React.FC<MapLocationSelectorProps> = ({
  isOpen,
  initialLat = 37.5665,
  initialLon = 126.9780,
  onLocationSelect,
  onClose,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLat && initialLon 
      ? {
          latitude: initialLat,
          longitude: initialLon,
          altitude: 0
        }
      : null
  );
  
  // 선택 모드 상태
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // 카메라 초기화를 한 번만 실행하기 위한 ref
  const isInitializedRef = useRef(false);

  const handleLocationSelect = useCallback((location: LocationData) => {
    setSelectedLocation(location);
    // 위치 선택 후 선택 모드 비활성화
    setIsSelectionMode(false);
  }, []);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
  };

  const handleSave = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.latitude, selectedLocation.longitude);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        title="지도에서 위치 선택" 
        className="max-w-[90vw] h-[90vh] w-[90vw]"
        dimmed
        disableBackground
      >
        <div className="flex flex-col h-[calc(100%-6rem)]">
          {/* 지도 영역 */}
          <div className="flex-1 relative">
            <div 
              className={`w-full h-[calc(100%-10rem)] ${isSelectionMode ? 'cursor-crosshair' : 'cursor-default'}`}
            >
              <VWorldMap 
                className="w-full "
                mapProvider="vworld"
                preventCameraReset={isInitializedRef.current}
                onMapInitialized={() => {
                  isInitializedRef.current = true;
                }}
              >
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={
                    initialLat && initialLon 
                      ? {
                          latitude: initialLat,
                          longitude: initialLon,
                          altitude: 100
                        }
                      : undefined
                  }
                  enabled={isSelectionMode}
                  showMarker={true}
                />
              </VWorldMap>
            </div>
            
            {/* 선택 모드 안내 오버레이 */}
            {isSelectionMode && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-md shadow-lg z-10">
                <div className="flex items-center gap-2">
                  <span className="animate-pulse">📍</span>
                  <span className="text-sm font-medium">지도를 클릭해서 위치를 선택하세요</span>
                </div>
              </div>
            )}
            
            {/* 비선택 모드 안내 오버레이 */}
            {!isSelectionMode && (
              <div className="absolute top-4 left-4 bg-gray-600 text-white px-3 py-2 rounded-md shadow-lg z-10">
                <div className="flex items-center gap-2">
                  <span>🗺️</span>
                  <span className="text-sm">선택 모드를 활성화하여 위치를 선택하세요</span>
                </div>
              </div>
            )}
          </div>

          {/* 선택된 위치 정보 및 컨트롤 */}
          <div className="p-4 border-t bg-gray-50">
            {selectedLocation ? (
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-gray-800">선택된 위치</h4>
                  <p className="text-sm text-gray-600">
                    위도: {selectedLocation.latitude.toFixed(6)}, 
                    경도: {selectedLocation.longitude.toFixed(6)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    type="button"
                    variant={isSelectionMode ? "default" : "outline"}
                    onClick={toggleSelectionMode}
                    className={isSelectionMode ? "bg-blue-600 text-white" : ""}
                  >
                    📍 {isSelectionMode ? "위치 선택 중..." : "위치 선택"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {isSelectionMode 
                    ? "지도에서 위치를 클릭해주세요" 
                    : "선택 모드를 활성화한 후 지도에서 위치를 선택해주세요"
                  }
                </p>
                <Button 
                  type="button"
                  variant={isSelectionMode ? "default" : "outline"}
                  onClick={toggleSelectionMode}
                  className={isSelectionMode ? "bg-blue-600 text-white" : ""}
                >
                  📍 {isSelectionMode ? "위치 선택 중..." : "위치 선택"}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={!selectedLocation}
          >
            위치 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
