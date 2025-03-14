import * as Cesium from 'cesium';
import { HeatmapDataPoint } from '@/lib/heatmap_data';

// 3D 히트맵 생성 옵션 인터페이스
export interface Heatmap3DOptions {
  pointSize?: number;         // 포인트 크기
  minPointSize?: number;      // 최소 포인트 크기
  maxPointSize?: number;      // 최대 포인트 크기
  valueThreshold?: number;    // 데이터 임계값
  heightOffset?: number;      // 높이 오프셋
  useFixedGrid?: boolean;     // 고정 격자 사용 여부
  useAbsoluteScale?: boolean; // 절대값 스케일 사용 여부
}

// 2D 히트맵 생성 옵션 인터페이스
export interface HeatmapOptions {
  gridSize?: number;
  canvasSize?: number;
  radius?: number;
  blurRadius?: number;
  valueThreshold?: number;
  showBorder?: boolean;
  borderColor?: string;
  borderWidth?: number;
  rotation?: number;
  useAbsoluteScale?: boolean;
}

// 2D 히트맵 생성 옵션 인터페이스 (이전 코드와의 호환성 유지)
export interface Heatmap2DOptions {
  radius?: number;            // 영향 반경
  blur?: number;              // 블러 적용 여부
  gradient?: string[];        // 색상 그라데이션
  valueThreshold?: number;    // 데이터 임계값
  opacity?: number;           // 불투명도
  useAbsoluteScale?: boolean; // 절대값 스케일 사용 여부
  customData?: HeatmapDataPoint[]; // 커스텀 데이터 포인트
}

// 히트맵 인스턴스 관리를 위한 인터페이스
export interface HeatmapInstanceData {
  geometryInstances: Cesium.GeometryInstance[];
  dataPoints: HeatmapDataPoint[];
  heightLevel: number;
}

// 히트맵 상태 관리 타입
export interface HeatmapState {
  heatmapInstances: Record<number, HeatmapInstanceData>;
  addHeatmapInstance: (height: number, data: Omit<HeatmapInstanceData, 'heightLevel'>) => void;
  removeHeatmapInstance: (height: number, viewer: Cesium.Viewer) => void;
  removeAllHeatmapInstances: (viewer: Cesium.Viewer) => void;
  create3DHeatmap: (viewer: Cesium.Viewer, height: number, customDataPoints?: HeatmapDataPoint[]) => Promise<void>;
  applyNewDataToHeatmap: (viewer: Cesium.Viewer, height: number, data: HeatmapDataPoint[]) => void;
}

// 히트맵 엔티티 관리를 위한 타입
export type HeatmapEntityMap = {
  [height: number]: Cesium.Entity | Cesium.PrimitiveCollection;
};

// 맵 토글 컨트롤 컴포넌트 props
export interface MapToggleControlsProps {
  className?: string;
}

// 색상 스케일 항목 인터페이스
export interface ColorScaleItem {
  value: number;
  color: Cesium.Color;
}