import { create } from 'zustand';
import * as Cesium from 'cesium';
import { HeatmapDataPoint } from '@/lib/heatmap_data';
import { HeatmapState, ColorScaleItem } from '@/types/heatmap';

export const useHeatmapStore = create<HeatmapState>((set, get) => ({
  heatmapInstances: {},
  
  addHeatmapInstance: (height, data) => set(state => ({
    heatmapInstances: {
      ...state.heatmapInstances,
      [height]: {
        ...data,
        heightLevel: height,
      },
    },
  })),
  
  removeHeatmapInstance: (height, viewer) => {
    removeHeatmapPrimitivesFromScene(viewer, height);
    
    set(state => {
      const newHeatmapInstances = { ...state.heatmapInstances };
      delete newHeatmapInstances[height];
      return { heatmapInstances: newHeatmapInstances };
    });
  },
  
  removeAllHeatmapInstances: (viewer) => {
    const { heatmapInstances } = get();
    
    Object.entries(heatmapInstances).forEach(([heightStr]) => {
      const height = parseInt(heightStr);
      removeHeatmapPrimitivesFromScene(viewer, height);
    });
    
    set({ heatmapInstances: {} });
  },
  
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
      console.error('3D 히트맵 생성 오류:', error);
    }
  },
  
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
          console.error('히트맵 데이터 적용 오류:', error);
        });
    } catch (error) {
      console.error('히트맵 데이터 적용 오류:', error);
    }
  },
  
}));

async function createHeatmapGeometryInstances(
  heightLevel: number,
  dataPoints: HeatmapDataPoint[]
): Promise<Cesium.GeometryInstance[]> {
  const Cesium = await import('cesium');
  const { HEATMAP_GRID_CONFIG } = await import('@/constants/initialization');
  
  const colorScale: ColorScaleItem[] = [
    { value: 1, color: Cesium.Color.RED.withAlpha(0.0) },
    { value: 25, color: Cesium.Color.CYAN.withAlpha(0.0) },
    { value: 50, color: Cesium.Color.GREEN.withAlpha(0.1) },
    { value: 75, color: Cesium.Color.YELLOW.withAlpha(0.8) },
    { value: 100, color: Cesium.Color.RED.withAlpha(0.9) },
  ];
  
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
  
  const centerLatitude = (HEATMAP_GRID_CONFIG.NORTH + HEATMAP_GRID_CONFIG.SOUTH) / 2;
  const longitudeMeters = 111320 * Math.cos(centerLatitude * Math.PI / 180);
  const latitudeMeters = 110574;
  
  const gridLongitudeSize = longitudeMeters * (HEATMAP_GRID_CONFIG.EAST - HEATMAP_GRID_CONFIG.WEST) / HEATMAP_GRID_CONFIG.SEGMENTS;
  const gridLatitudeSize = latitudeMeters * (HEATMAP_GRID_CONFIG.NORTH - HEATMAP_GRID_CONFIG.SOUTH) / HEATMAP_GRID_CONFIG.SEGMENTS;
  
  const gridSize = Math.min(gridLongitudeSize, gridLatitudeSize);
  
  const boxWidth = gridSize * 1.0;
  const boxHeight = 10;
  
  const filteredPoints = dataPoints.filter(point => 
    point.value >= (HEATMAP_GRID_CONFIG.VALUE_THRESHOLD || 10) && 
    point.height === heightLevel
  );
  
  const instances: Cesium.GeometryInstance[] = filteredPoints.map(point => {
    const color = getColorFromValue(point.value);
    
    const position = Cesium.Cartesian3.fromDegrees(
      point.longitude, 
      point.latitude, 
      0
    );
    
    const modelMatrix = Cesium.Matrix4.multiplyByTranslation(
      Cesium.Transforms.eastNorthUpToFixedFrame(position),
      new Cesium.Cartesian3(0, 0, 0),
      new Cesium.Matrix4()
    );
    
    const boxStartHeight = heightLevel;
    const baseHeight = HEATMAP_GRID_CONFIG.BASE_HEIGHT;
    
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