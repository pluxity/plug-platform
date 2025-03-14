import { create } from 'zustand';
import * as Cesium from 'cesium';
import { HeatmapDataPoint } from '@/lib/heatmap_data';
import { updateColorScale } from '@/lib/heatmap_3D';

// 히트맵 인스턴스 관리를 위한 인터페이스
interface HeatmapInstanceData {
  geometryInstances: Cesium.GeometryInstance[];
  dataPoints: HeatmapDataPoint[];
  heightLevel: number;
}

// 히트맵 상태 관리 타입
type HeatmapState = {
  // 고도별 히트맵 인스턴스 데이터
  heatmapInstances: Record<number, HeatmapInstanceData>;
  
  // 함수들
  addHeatmapInstance: (height: number, data: Omit<HeatmapInstanceData, 'heightLevel'>) => void;
  removeHeatmapInstance: (height: number, viewer: Cesium.Viewer) => void;
  removeAllHeatmapInstances: (viewer: Cesium.Viewer) => void;
  
  // 히트맵 생성 및 업데이트 함수
  create3DHeatmap: (viewer: Cesium.Viewer, height: number, customDataPoints?: HeatmapDataPoint[]) => Promise<void>;
  applyNewDataToHeatmap: (viewer: Cesium.Viewer, height: number, data: HeatmapDataPoint[]) => void;
  updateColorScale: (newColorScale: Array<{ value: number, color: Cesium.Color }>, viewer: Cesium.Viewer, heights: number[]) => Promise<void>;
};

// 히트맵 스토어 생성
export const useHeatmapStore = create<HeatmapState>((set, get) => ({
  heatmapInstances: {},
  
  // 히트맵 인스턴스 추가
  addHeatmapInstance: (height, data) => set(state => ({
    heatmapInstances: {
      ...state.heatmapInstances,
      [height]: {
        ...data,
        heightLevel: height,
      },
    },
  })),
  
  // 히트맵 인스턴스 제거 (단일 고도)
  removeHeatmapInstance: (height, viewer) => {
    removeHeatmapPrimitivesFromScene(viewer, height);
    
    set(state => {
      const newHeatmapInstances = { ...state.heatmapInstances };
      delete newHeatmapInstances[height];
      return { heatmapInstances: newHeatmapInstances };
    });
  },
  
  // 모든 히트맵 인스턴스 제거
  removeAllHeatmapInstances: (viewer) => {
    const { heatmapInstances } = get();
    
    Object.entries(heatmapInstances).forEach(([heightStr]) => {
      const height = parseInt(heightStr);
      removeHeatmapPrimitivesFromScene(viewer, height);
    });
    
    set({ heatmapInstances: {} });
  },
  
  // 3D 히트맵 생성 함수
  create3DHeatmap: async (viewer, height, customDataPoints) => {
    const state = get();
    
    try {
      if (state.heatmapInstances[height]) {
        return;
      }
      
      const dataPoints = customDataPoints || [];
      const geometryInstances = await createHeatmapGeometryInstances(height, dataPoints);
      
      createPrimitivesFromInstances(viewer, geometryInstances, height);
      
      state.addHeatmapInstance(height, {
        geometryInstances,
        dataPoints,
      });
    } catch (error) {
      // 오류 처리는 유지
    }
  },
  
  // 기존 히트맵에 새 데이터 적용
  applyNewDataToHeatmap: (viewer, height, data) => {
    const state = get();
    const instanceData = state.heatmapInstances[height];
    
    if (!instanceData) {
      state.create3DHeatmap(viewer, height, data);
      return;
    }
    
    try {
      removeHeatmapPrimitivesFromScene(viewer, height);
      
      createHeatmapGeometryInstances(height, data)
        .then(geometryInstances => {
          createPrimitivesFromInstances(viewer, geometryInstances, height);
          
          state.addHeatmapInstance(height, {
            geometryInstances,
            dataPoints: data,
          });
          
          viewer.scene.requestRender();
        })
        .catch(error => {
          // 오류 처리는 유지
        });
    } catch (error) {
      // 오류 처리는 유지
    }
  },
  
  // 히트맵 색상 스케일 업데이트
  updateColorScale: async (newColorScale, viewer, heights) => {
    try {
      updateColorScale(newColorScale);
      
      const state = get();
      
      for (const height of heights) {
        const instanceData = state.heatmapInstances[height];
        
        if (instanceData && instanceData.dataPoints && instanceData.dataPoints.length > 0) {
          removeHeatmapPrimitivesFromScene(viewer, height);
          
          const geometryInstances = await createHeatmapGeometryInstances(height, instanceData.dataPoints);
          
          createPrimitivesFromInstances(viewer, geometryInstances, height);
          
          state.addHeatmapInstance(height, {
            geometryInstances,
            dataPoints: instanceData.dataPoints,
          });
        }
      }
      
      viewer.scene.requestRender();
    } catch (error) {
      // 오류 처리는 유지
    }
  },
}));

// GeometryInstance 생성 함수
async function createHeatmapGeometryInstances(
  heightLevel: number,
  dataPoints: HeatmapDataPoint[]
): Promise<Cesium.GeometryInstance[]> {
  const Cesium = await import('cesium');
  const { HEATMAP_GRID_CONFIG } = await import('@/constants/initialization');
  
  // 색상 스케일
  const colorScale = [
    { value: 1, color: Cesium.Color.BLUE.withAlpha(0.3) },
    { value: 25, color: Cesium.Color.CYAN.withAlpha(0.4) },
    { value: 50, color: Cesium.Color.GREEN.withAlpha(0.6) },
    { value: 75, color: Cesium.Color.YELLOW.withAlpha(0.8) },
    { value: 100, color: Cesium.Color.RED.withAlpha(0.9) },
  ];
  
  // 값에 따른 색상 계산
  function getColorFromValue(value: number): Cesium.Color {
    if (value <= colorScale[0].value) return colorScale[0].color;
    if (value >= colorScale[colorScale.length - 1].value) return colorScale[colorScale.length - 1].color;
    
    for (let i = 0; i < colorScale.length - 1; i++) {
      if (value >= colorScale[i].value && value <= colorScale[i + 1].value) {
        const ratio = (value - colorScale[i].value) / (colorScale[i + 1].value - colorScale[i].value);
        return Cesium.Color.lerp(colorScale[i].color, colorScale[i + 1].color, ratio, new Cesium.Color());
      }
    }
    
    return colorScale[0].color;
  }
  
  // 격자 크기 계산
  const centerLatitude = (HEATMAP_GRID_CONFIG.NORTH + HEATMAP_GRID_CONFIG.SOUTH) / 2;
  const longitudeMeters = 111320 * Math.cos(centerLatitude * Math.PI / 180);
  const latitudeMeters = 110574;
  
  const gridLongitudeSize = longitudeMeters * (HEATMAP_GRID_CONFIG.EAST - HEATMAP_GRID_CONFIG.WEST) / HEATMAP_GRID_CONFIG.SEGMENTS;
  const gridLatitudeSize = latitudeMeters * (HEATMAP_GRID_CONFIG.NORTH - HEATMAP_GRID_CONFIG.SOUTH) / HEATMAP_GRID_CONFIG.SEGMENTS;
  
  const gridSize = Math.min(gridLongitudeSize, gridLatitudeSize);
  
  // 간격이 없도록 박스 크기를 크게 키움 (겹침 효과)
  const boxWidth = gridSize * 1.0; // 10% 크게 설정하여 간격을 확실히 메움
  const boxHeight = 10; // 박스 높이
  
  // 값 임계값 필터링
  const filteredPoints = dataPoints.filter(point => 
    point.value >= (HEATMAP_GRID_CONFIG.VALUE_THRESHOLD || 10) && 
    point.height === heightLevel
  );
  
  // GeometryInstance 배열 생성
  const instances: Cesium.GeometryInstance[] = filteredPoints.map(point => {
    const color = getColorFromValue(point.value);
    
    // 위치를 지면에 설정
    const position = Cesium.Cartesian3.fromDegrees(
      point.longitude, 
      point.latitude, 
      0 // 지면에 위치
    );
    
    const modelMatrix = Cesium.Matrix4.multiplyByTranslation(
      Cesium.Transforms.eastNorthUpToFixedFrame(position),
      new Cesium.Cartesian3(0, 0, 0),
      new Cesium.Matrix4()
    );
    
    // 고도별 높이 계산
    const boxStartHeight = heightLevel;
    const baseHeight = HEATMAP_GRID_CONFIG.BASE_HEIGHT;
    
    // 박스가 정확히 격자 경계에 맞도록 설정 (간격 없도록)
    const boxGeometry = new Cesium.BoxGeometry({
      minimum: new Cesium.Cartesian3(-boxWidth/2, -boxWidth/2, baseHeight + boxStartHeight),
      maximum: new Cesium.Cartesian3(boxWidth/2, boxWidth/2, baseHeight + boxStartHeight + boxHeight),
      vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
    });
    
    return new Cesium.GeometryInstance({
      geometry: boxGeometry,
      modelMatrix: modelMatrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
      },
      id: `heatmap-3d-box-${heightLevel}-${point.longitude.toFixed(6)}-${point.latitude.toFixed(6)}`,
    });
  });
  
  return instances;
}

// Primitive 생성 함수
function createPrimitivesFromInstances(
  viewer: Cesium.Viewer,
  geometryInstances: Cesium.GeometryInstance[],
  heightLevel: number
): void {
  const batchSize = 100;
  
  for (let i = 0; i < geometryInstances.length; i += batchSize) {
    const batch = geometryInstances.slice(i, i + batchSize);
    
    const primitive = new Cesium.Primitive({
      geometryInstances: batch,
      appearance: new Cesium.PerInstanceColorAppearance({
        translucent: true,
        closed: true,
      }),
      asynchronous: false,
    });
    
    // @ts-ignore
    primitive._heightLevel = heightLevel;
    // @ts-ignore
    primitive._batchIndex = i;
    
    viewer.scene.primitives.add(primitive);
  }
}

// 씬에서 특정 고도의 프리미티브 제거
function removeHeatmapPrimitivesFromScene(viewer: Cesium.Viewer, heightLevel: number): void {
  const primitivesToRemove: Cesium.Primitive[] = [];
  
  for (let i = 0; i < viewer.scene.primitives.length; i++) {
    const primitive = viewer.scene.primitives.get(i);
    if (primitive) {
      // @ts-ignore
      if (primitive._heightLevel === heightLevel) {
        primitivesToRemove.push(primitive);
      }
    }
  }
  
  primitivesToRemove.forEach(primitive => {
    viewer.scene.primitives.remove(primitive);
  });
} 