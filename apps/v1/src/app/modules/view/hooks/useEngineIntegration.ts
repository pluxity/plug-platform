import { useCallback, useEffect } from 'react';
import * as Px from '@plug/engine/src';
import { useAssetStore } from '@plug/v1/common/store/assetStore';
import useStationStore from '@plug/v1/app/stores/stationStore';
import type { PoiImportOption } from '@plug/engine/src/interfaces';
import type { StationWithFeatures } from '@plug/v1/app/modules/view/types/station';

interface UseEngineIntegrationProps {
  stationData: StationWithFeatures | null;
  onPoiSelect?: (poi: PoiImportOption) => void;
}

export function useEngineIntegration({
  stationData,
  onPoiSelect,
}: UseEngineIntegrationProps) {
  const { setSelectedDeviceId } = useStationStore();
  
  const poiClickListener = useCallback((event: { target: PoiImportOption }) => {
    if (event.target) {
      // POI에서 deviceId 추출 (POI의 id가 feature.id와 같음)
      const feature = stationData?.features?.find(f => f.id === event.target.id);
      if (feature) {
        // 디바이스 ID로 모달 열기 (feature.id를 deviceId로 사용)
        setSelectedDeviceId(feature.id);
      }
      
      // 기존 onPoiSelect 콜백도 호출
      if (onPoiSelect) {
        onPoiSelect(event.target);
      }
    }
  }, [onPoiSelect, stationData, setSelectedDeviceId]);
  const changeEngineFloor = useCallback((floorId: string) => {
    try {
      Px.Model.HideAll();
      Px.Model.Show(floorId);
    } catch (error) {
      console.error('Failed to change floor in engine:', error);
      throw error;
    }
  }, []);

  const handleFloorChange = useCallback((floorId: string) => {
    try {
      changeEngineFloor(floorId);
    } catch (error) {
      console.error(`Floor change failed for floor ${floorId}:`, error);
    }
  }, [changeEngineFloor]);

  const handleFeatureData = useCallback(() => {
    const currentAssets = useAssetStore.getState().assets;
    
    if (stationData?.features && currentAssets.length > 0) {
      const poiData = stationData.features.map((feature) => {
        const modelUrl = currentAssets.find(asset => asset.id === feature.assetId)?.file?.url || '';
        const poi = {
          id: feature.id, 
          iconUrl: '', 
          modelUrl: modelUrl,
          displayText: feature.deviceCode || 'Device 할당 필요',
          floorId: feature.floorId,
          property: {
            code: feature.deviceCode || '',
          },
          position: feature.position,
          rotation: feature.rotation,
          scale: feature.scale
        };
        
        return poi;      });

      Px.Poi.Import(JSON.stringify(poiData));
    }
  }, [stationData]);

  const addEngineEventListeners = useCallback(() => {
    if (onPoiSelect) {
      Px.Event.AddEventListener("onPoiPointerUp", poiClickListener);
    }
  }, [poiClickListener, onPoiSelect]);
  useEffect(() => {
    return () => {
      try {
        if (onPoiSelect) {
          Px.Event.RemoveEventListener("onPoiPointerUp", poiClickListener);
        }      } catch {
        // Event listener cleanup
      }
    };
  }, [poiClickListener, onPoiSelect]);
    const handleModelLoaded = useCallback(async () => {
    handleFeatureData();
    addEngineEventListeners();
  }, [handleFeatureData, addEngineEventListeners]);

  return {
    handleModelLoaded,
    handleFloorChange,
  };
}
