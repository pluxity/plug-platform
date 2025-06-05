import { useMemo } from 'react';
import { useEngineIntegration as useBaseEngineIntegration } from '../../../../common/libs/engine';
import type { PoiImportOption, ModelInfo } from '@plug/engine/src/interfaces';
import type { EngineEventHandlers, EngineIntegrationConfig } from '../../../../common/libs/engine';
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

  // 관리자 전용 이벤트 핸들러 설정
  const handlers: EngineEventHandlers = useMemo(() => ({
    onPoiClick: (poi: PoiImportOption) => {
      console.log('POI clicked:', poi);
      onPoiSelect(poi);
    },
    onPoiTransformChange: async (poi: PoiImportOption) => {
      try {
        await updateTransform(poi.id, {
          position: poi.position,
          rotation: poi.rotation,
          scale: poi.scale
        });
      } catch (error) {
        console.error('Failed to update POI transform:', error);
      }
    },
    onFloorChange,
    onHierarchyLoaded,
  }), [onPoiSelect, onFloorChange, onHierarchyLoaded, updateTransform]);

  // 관리자 전용 설정
  const config: EngineIntegrationConfig = useMemo(() => ({
    includeUnassignedDevices: true,
    enableTransformEdit: true,
    autoLoadHierarchy: true,
    defaultFloor: "0",
  }), []);

  const { handleModelLoaded, handleFloorChange, refreshPoiData } = useBaseEngineIntegration({
    stationData,
    handlers,
    config,
  });

  return {
    handleModelLoaded,
    handleFloorChange,
    refreshPoiData,
  };
}
