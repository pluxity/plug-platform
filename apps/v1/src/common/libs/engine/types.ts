import type { PoiImportOption, ModelInfo } from '@plug/engine/src/interfaces';

export interface BaseFeature {
  id: string;
  deviceId: string | null;
  assetId: number; // number 타입으로 변경
  floorId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface BaseStationData {
  features: BaseFeature[];
}

export interface EngineEventHandlers {
  onPoiClick?: (poi: PoiImportOption) => void;
  onPoiTransformChange?: (poi: PoiImportOption) => Promise<void>;
  onFloorChange?: (floorId: string) => void;
  onHierarchyLoaded?: (hierarchy: ModelInfo[]) => void;
}

export interface EngineIntegrationConfig {
  includeUnassignedDevices?: boolean;
  enableTransformEdit?: boolean;
  autoLoadHierarchy?: boolean;
  defaultFloor?: string;
}

export interface EngineIntegrationResult {
  handleModelLoaded: () => Promise<void>;
  handleFloorChange: (floorId: string) => void;
  refreshPoiData: () => void;
}
