import { useMemo } from 'react';
import { useEngineIntegration as useBaseEngineIntegration } from '@plug/v1/common/libs/engine';
import useStationStore from '@plug/v1/app/stores/stationStore';
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
  const { setSelectedDeviceId } = useStationStore();

  // 사용자 페이지 전용 이벤트 핸들러 설정
  const handlers: EngineEventHandlers = useMemo(() => ({
    onPoiClick: (poi: PoiImportOption) => {
      const feature = features?.find(f => f.id === poi.id);
      if (feature?.deviceId) {
        setSelectedDeviceId(feature.deviceId);
      }
      
      if (onPoiSelect) {
        onPoiSelect(poi);
      }
    },
  }), [onPoiSelect, features, setSelectedDeviceId]);

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
