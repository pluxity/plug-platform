import React, { useState, useCallback } from 'react';
import { Button } from '@plug/ui';
import MapLocationSelector from './MapLocationSelector';
import type { LocationData } from './LocationPicker';

interface LocationInputFieldProps {
  value?: Partial<LocationData>;
  onChange: (location: LocationData) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const LocationInputField: React.FC<LocationInputFieldProps> = ({
  value,
  onChange,
  label = "위치 정보",
  placeholder = "지도에서 위치를 선택하세요",
  required = false,
  disabled = false,
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleLocationConfirm = useCallback((location: LocationData) => {
    onChange(location);
  }, [onChange]);

  const formatLocationDisplay = (location?: Partial<LocationData>) => {
    if (!location || !location.latitude || !location.longitude) {
      return placeholder;
    }
    
    return `위도: ${location.latitude.toFixed(6)}, 경도: ${location.longitude.toFixed(6)}${
      location.altitude ? `, 고도: ${location.altitude.toFixed(1)}m` : ''
    }`;
  };

  const hasLocation = value && value.latitude && value.longitude;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <div className={`
            w-full px-3 py-2 border rounded-md shadow-sm text-sm
            ${hasLocation 
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
              : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }
            ${disabled 
              ? 'border-gray-200 dark:border-gray-600 cursor-not-allowed' 
              : 'border-gray-300 dark:border-gray-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
          `}>
            <div className="truncate">
              {formatLocationDisplay(value)}
            </div>
          </div>
        </div>
        
        <Button
          type="button"
          onClick={handleOpenModal}
          disabled={disabled}
          variant="outline"
          className="shrink-0"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          선택
        </Button>
      </div>

      {/* 선택된 위치 상세 정보 */}
      {hasLocation && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <div><span className="font-medium">위도:</span> {value.latitude?.toFixed(6)}</div>
            <div><span className="font-medium">경도:</span> {value.longitude?.toFixed(6)}</div>
            {value.altitude && (
              <div><span className="font-medium">고도:</span> {value.altitude.toFixed(1)}m</div>
            )}
            {value.cartographicHeight !== undefined && (
              <div><span className="font-medium">지형 고도:</span> {value.cartographicHeight.toFixed(1)}m</div>
            )}
          </div>
        </div>
      )}

      {/* 지도 모달 */}
      <MapLocationSelector
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLocationConfirm={handleLocationConfirm}
        initialLocation={value}
      />
    </div>
  );
};

export default LocationInputField;
