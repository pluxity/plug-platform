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
          <div className="w-0.5 h-5 rounded-sm bg-primary-600 inline-block mr-3"/>
          <label className="block font-bold">
            위치 정보
          </label>
        </div>
        
        <div className="flex gap-4 justify-between">
          <div className="flex space-x-4">
            <div className="flex space-x-2 items-center justify-center">
              <label className="block text-gray-500 w-50">*  위도 (Latitude)</label>
              <Controller
                name="facility.lat"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="any"
                    placeholder="위도"
                    readOnly
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? Number(value) : undefined);
                    }}
                  />
                )}
              />
            </div>

            <div className="flex space-x-2 items-center justify-center">
              <label className="block text-gray-500 w-50">*  경도 (Longitude)</label>
              <Controller
                name="facility.lon"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="any"
                    placeholder="경도"
                    readOnly
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? Number(value) : undefined);
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <Button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="w-48"
            >
              위치 정보 수정
            </Button>
          </div>
        </div>

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
