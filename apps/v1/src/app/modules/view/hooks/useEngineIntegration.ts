import { useMemo } from 'react';
import { useEngineIntegration as useBaseEngineIntegration } from '@plug/v1/common/libs/engine';
import type { PoiImportOption } from '@plug/engine/src/interfaces';
import type { FeatureResponse as Feature } from '@plug/v1/app/modules/view/types/station';
import type { EngineEventHandlers, EngineIntegrationConfig } from '@plug/v1/common/libs/engine';

interface UseEngineIntegrationProps {
  features: Feature[] | null;
  onPoiSelect?: (poi: PoiImportOption) => void;
}

export function useEngineIntegration({
  features,
  onPoiSelect,
}: UseEngineIntegrationProps) {
  // 사용자 페이지 전용 이벤트 핸들러 설정
  const handlers: EngineEventHandlers = useMemo(() => ({
    onPoiClick: (poi: PoiImportOption) => {
      console.log('View page POI clicked:', poi);
      
      // POI 선택 핸들러 호출 (사이드 메뉴 열기)
      if (onPoiSelect) {
        onPoiSelect(poi);
      }
    },
  }), [onPoiSelect]);

  // 사용자 페이지 전용 설정
  const config: EngineIntegrationConfig = useMemo(() => ({
    includeUnassignedDevices: false, // 사용자 페이지에서는 할당된 디바이스만 표시
    enableTransformEdit: false,
    autoLoadHierarchy: false,
    defaultFloor: undefined,
  }), []);

  const { handleModelLoaded, handleFloorChange, refreshPoiData } = useBaseEngineIntegration({
    features,
    handlers,
    config,
  });
  return {
    handleModelLoaded,
    handleFloorChange,
    refreshPoiData,
  };
}
