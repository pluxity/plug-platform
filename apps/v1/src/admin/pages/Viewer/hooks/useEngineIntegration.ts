import { useMemo } from 'react';
import { useEngineIntegration as useBaseEngineIntegration } from '../../../../common/libs/engine';
import type { PoiImportOption, ModelInfo } from '@plug/engine/src/interfaces';
import type { EngineEventHandlers, EngineIntegrationConfig } from '../../../../common/libs/engine';
import { useFeatureApi } from './useFeatureApi';

interface UseEngineIntegrationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stationData: any;
  onPoiSelect: (poi: PoiImportOption) => void;
  onHierarchyLoaded: (hierarchy: ModelInfo[]) => void;
  onFloorChange: (floorId: string) => void;
  onPoiDeleteClick?: (poi: PoiImportOption) => void;
}

export function useEngineIntegration({
  stationData,
  onPoiSelect,
  onHierarchyLoaded,
  onFloorChange,
  onPoiDeleteClick,
}: UseEngineIntegrationProps) {
  const { updateTransform } = useFeatureApi();
  // 관리자 전용 이벤트 핸들러 설정
  const handlers: EngineEventHandlers = useMemo(() => ({
    onPoiClick: onPoiDeleteClick ? undefined : (poi: PoiImportOption) => {
      console.log('POI clicked:', poi);
      onPoiSelect(poi);
    },
    onPoiDeleteClick: onPoiDeleteClick ? (poi: PoiImportOption) => {
      console.log('POI delete clicked:', poi);
      onPoiDeleteClick(poi);
    } : undefined,
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
  }), [onPoiSelect, onFloorChange, onHierarchyLoaded, onPoiDeleteClick, updateTransform]);

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
