import { useCallback, useMemo } from 'react';
import { api } from '@plug/api-hooks';
import type { PoiImportOption } from '@plug/engine/src/interfaces';

export interface UsePoiApiResult {
  assignDevice: (featureId: string, deviceId: string) => Promise<void>;
  updateTransform: (featureId: string, transform: Partial<Pick<PoiImportOption, 'position' | 'rotation' | 'scale'>>) => Promise<void>;
}

export function usePoiApi(): UsePoiApiResult {
  const assignDevice = useCallback(async (featureId: string, deviceId: string) => {
    try {
      await api.put(`features/${featureId}/assign-device`, { id: deviceId });
    } catch (error) {
      console.error('Error updating device code:', error);
      throw error;
    }
  }, []);

  const updateTransform = useCallback(async (
    featureId: string,
    transform: Partial<Pick<PoiImportOption, 'position' | 'rotation' | 'scale'>>
  ) => {
    try {
      await api.patch(`features/${featureId}/transform`, transform);
    } catch (error) {
      console.error('Error updating POI transform:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    assignDevice,
    updateTransform,
  }), [assignDevice, updateTransform]);
}
