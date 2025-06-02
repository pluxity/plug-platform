import { useCallback, useMemo } from 'react';
import { api } from '@plug/api-hooks';
import type { PoiImportOption } from '@plug/engine/src/interfaces';

export interface UsePoiApiResult {
  updateDeviceCode: (poiId: string, code: string) => Promise<void>;
  updateTransform: (poiId: string, transform: Partial<Pick<PoiImportOption, 'position' | 'rotation' | 'scale'>>) => Promise<void>;
}

export function usePoiApi(): UsePoiApiResult {
  const updateDeviceCode = useCallback(async (poiId: string, code: string) => {
    try {
      await api.put(`features/${poiId}/assign-device`, { code });
    } catch (error) {
      console.error('Error updating device code:', error);
      throw error;
    }
  }, []);

  const updateTransform = useCallback(async (
    poiId: string, 
    transform: Partial<Pick<PoiImportOption, 'position' | 'rotation' | 'scale'>>
  ) => {
    try {
      await api.patch(`features/${poiId}/transform`, transform);
    } catch (error) {
      console.error('Error updating POI transform:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    updateDeviceCode,
    updateTransform,
  }), [updateDeviceCode, updateTransform]);
}
