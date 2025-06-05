import { useCallback, useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';
import { useAssetStore } from '../../store/assetStore';
import type { 
  BaseStationData, 
  EngineEventHandlers, 
  EngineIntegrationConfig, 
  EngineIntegrationResult 
} from './types';
import type { PoiImportOption } from '@plug/engine/src/interfaces';

interface UseEngineIntegrationProps {
  stationData: BaseStationData | null;
  handlers: EngineEventHandlers;
  config?: EngineIntegrationConfig;
}

const defaultConfig: EngineIntegrationConfig = {
  includeUnassignedDevices: true,
  enableTransformEdit: false,
  autoLoadHierarchy: false,
  defaultFloor: "0",
};

export const useEngineIntegration = ({
  stationData,
  handlers,
  config = {},
}: UseEngineIntegrationProps): EngineIntegrationResult => {
  const finalConfig = { ...defaultConfig, ...config };
  const eventListenersRef = useRef<Array<{ event: string; handler: (...args: unknown[]) => void }>>([]);

  // POI 클릭 이벤트 핸들러
  const poiClickListener = useCallback((event: { target: PoiImportOption }) => {
    if (event.target && handlers.onPoiClick) {
      handlers.onPoiClick(event.target);
    }
  }, [handlers]);

  // POI Transform 변경 이벤트 핸들러 (관리자 전용)
  const poiTransformListener = useCallback(async (event: { target: PoiImportOption }) => {
    if (event.target && handlers.onPoiTransformChange) {
      try {
        await handlers.onPoiTransformChange(event.target);
      } catch {
        // Ignore transform update errors
      }
    }
  }, [handlers]);

  // Floor 변경 핸들러
  const changeEngineFloor = useCallback((floorId: string) => {
    try {
      Px.Model.HideAll();
      Px.Model.Show(floorId);
    } catch {
      // Ignore floor change errors in engine
      throw new Error(`Failed to change floor in engine: ${floorId}`);
    }
  }, []);

  const handleFloorChange = useCallback((floorId: string) => {
    try {
      changeEngineFloor(floorId);
      if (handlers.onFloorChange) {
        handlers.onFloorChange(floorId);
      }
    } catch {
      // Floor change failed, but continue execution
    }
  }, [changeEngineFloor, handlers]);

  // POI 데이터 생성 및 임포트
  const handleFeatureData = useCallback(() => {
    const currentAssets = useAssetStore.getState().assets;
    
    if (stationData?.features && currentAssets.length > 0) {
      // 설정에 따라 미할당 디바이스 포함 여부 결정
      const filteredFeatures = finalConfig.includeUnassignedDevices 
        ? stationData.features 
        : stationData.features.filter(feature => feature.deviceId !== null);

      const poiData = filteredFeatures.map((feature) => {
        const modelUrl = currentAssets.find(asset => asset.id === feature.assetId)?.file?.url || '';
        const poi: PoiImportOption = {
          id: feature.id, 
          iconUrl: '', 
          modelUrl: modelUrl,
          displayText: feature.deviceId || 'Device 할당 필요',
          floorId: feature.floorId,
          property: {
            code: feature.deviceId || '',
          },
          position: feature.position,
          rotation: feature.rotation,
          scale: feature.scale
        };
        
        return poi;
      });

      Px.Poi.Import(JSON.stringify(poiData));
    }
  }, [stationData, finalConfig.includeUnassignedDevices]);

  // 이벤트 리스너 추가
  const addEngineEventListeners = useCallback(() => {
    // 기존 이벤트 리스너 제거
    eventListenersRef.current.forEach(({ event, handler }) => {
      try {
        Px.Event.RemoveEventListener(event, handler);
      } catch {
        // Ignore cleanup errors
      }
    });
    eventListenersRef.current = [];

    // POI 클릭 이벤트
    if (handlers.onPoiClick) {
      Px.Event.AddEventListener("onPoiPointerUp", poiClickListener);
      eventListenersRef.current.push({ event: "onPoiPointerUp", handler: poiClickListener as (...args: unknown[]) => void });
    }

    // POI Transform 변경 이벤트 (관리자 전용)
    if (finalConfig.enableTransformEdit && handlers.onPoiTransformChange) {
      Px.Event.AddEventListener('onPoiTransformChange', poiTransformListener);
      eventListenersRef.current.push({ event: 'onPoiTransformChange', handler: poiTransformListener as (...args: unknown[]) => void });
    }
  }, [handlers, finalConfig.enableTransformEdit, poiClickListener, poiTransformListener]);

  // 모델 로드 완료 핸들러
  const handleModelLoaded = useCallback(async () => {
    // POI 데이터 로드
    handleFeatureData();

    // 모델 계층 구조 로드 (관리자 전용)
    if (finalConfig.autoLoadHierarchy && handlers.onHierarchyLoaded) {
      const modelHierarchy = Px.Model.GetModelHierarchy();
      if (modelHierarchy) {
        handlers.onHierarchyLoaded(modelHierarchy);
        // 기본 층으로 변경
        if (finalConfig.defaultFloor) {
          handleFloorChange(finalConfig.defaultFloor);
        }
      }
    }

    // 이벤트 리스너 추가
    addEngineEventListeners();
  }, [handleFeatureData, finalConfig.autoLoadHierarchy, finalConfig.defaultFloor, handlers, handleFloorChange, addEngineEventListeners]);

  // POI 데이터 새로고침
  const refreshPoiData = useCallback(() => {
    handleFeatureData();
  }, [handleFeatureData]);

  // 컴포넌트 언마운트 시 이벤트 리스너 정리
  useEffect(() => {
    return () => {
      eventListenersRef.current.forEach(({ event, handler }) => {
        try {
          Px.Event.RemoveEventListener(event, handler);
        } catch {
          // Ignore cleanup errors
        }
      });
      eventListenersRef.current = [];
    };
  }, []);

  return {
    handleModelLoaded,
    handleFloorChange,
    refreshPoiData,
  };
};
