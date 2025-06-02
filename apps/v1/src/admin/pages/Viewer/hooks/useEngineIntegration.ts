import { useCallback, useEffect } from 'react';
import * as Px from '@plug/engine/src';
import { useAssetStore } from '../../../../common/store/assetStore';
import type { FeatureResponse } from '../types';
import type { PoiImportOption, ModelInfo } from '@plug/engine/src/interfaces';
import { usePoiApi } from './usePoiApi';

interface UseEngineIntegrationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stationData: any;
  onPoiSelect: (poi: PoiImportOption) => void;
  onHierarchyLoaded: (hierarchy: ModelInfo[]) => void;
  onFloorChange: (floorId: string) => void;
}

export function useEngineIntegration({
  stationData,
  onPoiSelect,
  onHierarchyLoaded,
  onFloorChange,
}: UseEngineIntegrationProps) {
  const { updateTransform } = usePoiApi();
  // Store event listener references for cleanup
  const poiClickListener = useCallback((event: { target: PoiImportOption }) => {

    console.log('POI clicked:', event);

    if (event.target) {
      onPoiSelect(event.target);
    }
  }, [onPoiSelect]);
  const poiTransformListener = useCallback(async (event: { target: PoiImportOption }) => {
    const { target } = event;
    try {
      await updateTransform(target.id, {
        position: target.position,
        rotation: target.rotation,
        scale: target.scale
      });
    } catch (error) {
      console.error('Failed to update POI transform:', error);
    }
  }, [updateTransform]);  // Internal function to handle 3D engine floor visibility
  const changeEngineFloor = useCallback((floorId: string) => {
    try {
      Px.Model.HideAll();
      Px.Model.Show(floorId);
    } catch (error) {
      console.error('Failed to change floor in engine:', error);
      throw error; // Re-throw to handle in calling function
    }
  }, []);
  // Combined floor change handler that updates both UI and engine
  const handleFloorChange = useCallback((floorId: string) => {
    console.log(`Floor change requested: ${floorId}`);
    try {
      // Update the 3D engine first
      changeEngineFloor(floorId);
      // Notify parent component for UI updates
      onFloorChange(floorId);
      console.log(`Floor change completed: ${floorId}`);
    } catch (error) {
      console.error(`Floor change failed for floor ${floorId}:`, error);
    }
  }, [changeEngineFloor, onFloorChange]);

  const handleFeatureData = useCallback(() => {
    const currentAssets = useAssetStore.getState().assets;
    
    if (stationData?.features && currentAssets.length > 0) {
      console.log(`Processing ${stationData.features.length} features with ${currentAssets.length} assets`);
      
      const poiData = stationData.features.map((feature: FeatureResponse) => {
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
        
        console.log(`POI created for floor ${feature.floorId}:`, poi.displayText);
        return poi;
      });

      console.log('Importing POI data:', poiData);
      Px.Poi.Import(JSON.stringify(poiData));
    } else {
      console.log('No features or assets available for POI import');
    }
  }, [stationData]);  const addEngineEventListeners = useCallback(() => {
    console.log('Adding engine event listeners');
    
    Px.Event.AddEventListener("onPoiPointerUp", poiClickListener);
    Px.Event.AddEventListener('onPoiTransformChange', poiTransformListener);
  }, [poiClickListener, poiTransformListener]);
  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up engine event listeners');
      try {
        Px.Event.RemoveEventListener("onPoiPointerUp", poiClickListener);
        Px.Event.RemoveEventListener('onPoiTransformChange', poiTransformListener);
      } catch {
        console.log('Event listener cleanup completed (some listeners may not have been registered)');
      }
    };
  }, [poiClickListener, poiTransformListener]);
  
  const handleModelLoaded = useCallback(async () => {
    
    handleFeatureData();

    const modelHierarchy = Px.Model.GetModelHierarchy();
    if (modelHierarchy) {
      onHierarchyLoaded(modelHierarchy as ModelInfo[]);
      handleFloorChange("0");
    }

    addEngineEventListeners();
  }, [handleFeatureData, handleFloorChange, addEngineEventListeners, onHierarchyLoaded]);

  return {
    handleModelLoaded,
    handleFloorChange,
  };
}
