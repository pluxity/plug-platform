import { FacilityCreateFormData } from '../../../types';

import React, { useState } from 'react';
import { Controller, Control, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';

import { Button, Input } from '@plug/ui';

import { MapLocationSelector } from './MapLocationSelector';
interface LocationSelectorFieldProps {
  control: Control<FacilityCreateFormData>;
  setValue: UseFormSetValue<FacilityCreateFormData>;
  watch: UseFormWatch<FacilityCreateFormData>;
  errors: FieldErrors<FacilityCreateFormData>;
}

const LocationSelectorField: React.FC<LocationSelectorFieldProps> = ({
  control,
  setValue,
  watch,
  errors,
}) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const watchedLat = watch('facility.lat');
  const watchedLon = watch('facility.lon');

  const handleLocationSelect = (lat: number, lon: number) => {
    if (watchedLat !== lat) {
      setValue('facility.lat', lat, { shouldDirty: false, shouldTouch: false });
    }
    if (watchedLon !== lon) {
      setValue('facility.lon', lon, { shouldDirty: false, shouldTouch: false });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4" data-testid="location-selector-input">
        <div className="flex items-center space-x-2">
          <div className="w-0.5 h-6 rounded-sm bg-primary-600 inline-block mr-3"/>
          <label className="block font-bold">
            위치 정보
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-2">위도 (Latitude)</label>
            <Controller
              name="facility.lat"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="any"
                  placeholder="위도"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? Number(value) : undefined);
                  }}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">경도 (Longitude)</label>
            <Controller
              name="facility.lon"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="any"
                  placeholder="경도"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? Number(value) : undefined);
                  }}
                />
              )}
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMapOpen(true)}
              className="w-full"
            >
              지도에서 선택
            </Button>
          </div>
        </div>

        {watchedLat && watchedLon && (
          <div className="mt-3 p-3 bg-secondary-300 rounded-md">
            <p className="text-sm text-secondary-900">
              선택된 위치: 위도 {watchedLat.toFixed(6)}, 경도 {watchedLon.toFixed(6)}
            </p>
          </div>
        )}

        {errors.facility?.lat && (
          <p className="text-red-500 text-sm mt-1">{errors.facility.lat.message}</p>
        )}
        {errors.facility?.lon && (
          <p className="text-red-500 text-sm mt-1">{errors.facility.lon.message}</p>
        )}
      </div>

      <MapLocationSelector
        isOpen={isMapOpen}
        initialLat={watchedLat || 37.5665}
        initialLon={watchedLon || 126.9780}
        onLocationSelect={handleLocationSelect}
        onClose={() => setIsMapOpen(false)}
      />
    </div>
  );
};

export { LocationSelectorField };
