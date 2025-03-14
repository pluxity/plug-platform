import * as Cesium from 'cesium';
import { HeatmapDataPoint, getHeatmapDataPointsByHeight } from './heatmap_data';
import { HEATMAP_GRID_CONFIG } from '@/constants/initialization';
import { Heatmap3DOptions, ColorScaleItem } from '@/types/heatmap';

const DEFAULT_OPTIONS: Heatmap3DOptions = {
  pointSize: 100,
  minPointSize: 0,
  maxPointSize: 5,
  valueThreshold: HEATMAP_GRID_CONFIG.VALUE_THRESHOLD || 10,
  heightOffset: HEATMAP_GRID_CONFIG.BASE_HEIGHT || 0,
  useFixedGrid: true,
  useAbsoluteScale: true,
};

const colorScale: ColorScaleItem[] = [
  { value: 1, color: Cesium.Color.RED.withAlpha(0.0) },
  { value: 25, color: Cesium.Color.RED.withAlpha(0.0) },
  { value: 50, color: Cesium.Color.GREEN.withAlpha(0.5) },
  { value: 75, color: Cesium.Color.YELLOW.withAlpha(0.7) },
  { value: 100, color: Cesium.Color.RED.withAlpha(0.9) },
];

let currentColorScale = [...colorScale];

export function updateColorScale(newColorScale: ColorScaleItem[]): void {
  currentColorScale = [...newColorScale];
  console.log('3D 히트맵 색상 스케일이 업데이트되었습니다:', newColorScale);
}

function getColorFromValue(value: number): Cesium.Color {
  if (value <= currentColorScale[0].value) {
    return currentColorScale[0].color;
  }
  if (value >= currentColorScale[currentColorScale.length - 1].value) {
    return currentColorScale[currentColorScale.length - 1].color;
  }
  
  for (let i = 0; i < currentColorScale.length - 1; i++) {
    if (value >= currentColorScale[i].value && value <= currentColorScale[i + 1].value) {
      const ratio = (value - currentColorScale[i].value) / (currentColorScale[i + 1].value - currentColorScale[i].value);
      return Cesium.Color.lerp(currentColorScale[i].color, currentColorScale[i + 1].color, ratio, new Cesium.Color());
    }
  }
  
  return currentColorScale[0].color;
}

function getPointSizeFromValue(value: number, options: Heatmap3DOptions): number {
  const { minPointSize, maxPointSize } = { ...DEFAULT_OPTIONS, ...options };
  const DATA_MAX = HEATMAP_GRID_CONFIG.POLLUTION_DATA_MAX || 100;
  const normalizedValue = options.useAbsoluteScale ? value / DATA_MAX : value / 100;
  return minPointSize! + (maxPointSize! - minPointSize!) * Math.pow(normalizedValue, 1.5);
}

export function createOptimized3DHeatmap(
  viewer: Cesium.Viewer,
  heightLevel: number,
  options: Heatmap3DOptions = {},
  customDataPoints?: HeatmapDataPoint[]
): Cesium.PrimitiveCollection {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const dataPoints = customDataPoints || getHeatmapDataPointsByHeight(heightLevel);
  
  const valueThreshold = mergedOptions.valueThreshold || 20;
  const filteredPoints = dataPoints.filter(point => point.value >= valueThreshold);
  
  console.log(`고도 ${heightLevel}m 3D 히트맵: 임계값(${valueThreshold}) 이상 ${filteredPoints.length}개 데이터 포인트`);
  
  const primitiveCollection = new Cesium.PrimitiveCollection();
  
  const centerLatitude = (HEATMAP_GRID_CONFIG.NORTH + HEATMAP_GRID_CONFIG.SOUTH) / 2;
  const longitudeMeters = 111320 * Math.cos(centerLatitude * Math.PI / 180);
  const latitudeMeters = 110574;
  
  const gridLongitudeSize = longitudeMeters * (HEATMAP_GRID_CONFIG.EAST - HEATMAP_GRID_CONFIG.WEST) / HEATMAP_GRID_CONFIG.SEGMENTS;
  const gridLatitudeSize = latitudeMeters * (HEATMAP_GRID_CONFIG.NORTH - HEATMAP_GRID_CONFIG.SOUTH) / HEATMAP_GRID_CONFIG.SEGMENTS;
  
  const gridSize = Math.min(gridLongitudeSize, gridLatitudeSize);
  
  const instances = filteredPoints.map(point => {
    const color = getColorFromValue(point.value);
    
    const position = Cesium.Cartesian3.fromDegrees(
      point.longitude, 
      point.latitude, 
      mergedOptions.heightOffset! + heightLevel
    );
    
    const modelMatrix = Cesium.Matrix4.multiplyByTranslation(
      Cesium.Transforms.eastNorthUpToFixedFrame(position),
      new Cesium.Cartesian3(0, 0, 0),
      new Cesium.Matrix4()
    );
    
    let boxGeometry;
    
    if (mergedOptions.useFixedGrid) {
      const DATA_MAX = HEATMAP_GRID_CONFIG.POLLUTION_DATA_MAX || 100;
      const heightScale = mergedOptions.useAbsoluteScale ? point.value / DATA_MAX : point.value / 100;
      const boxHeight = gridSize * (0.5 + heightScale * 2);
      
      boxGeometry = new Cesium.BoxGeometry({
        minimum: new Cesium.Cartesian3(-gridSize/2, -gridSize/2, 0),
        maximum: new Cesium.Cartesian3(gridSize/2, gridSize/2, boxHeight),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
      });
    } else {
      const pointSize = getPointSizeFromValue(point.value, mergedOptions);
      
      boxGeometry = new Cesium.BoxGeometry({
        minimum: new Cesium.Cartesian3(-pointSize/2, -pointSize/2, -pointSize/2),
        maximum: new Cesium.Cartesian3(pointSize/2, pointSize/2, pointSize/2),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
      });
    }
    
    return new Cesium.GeometryInstance({
      geometry: boxGeometry,
      modelMatrix: modelMatrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
      },
      id: `heatmap-3d-box-${heightLevel}-${point.longitude.toFixed(6)}-${point.latitude.toFixed(6)}`,
    });
  });
  
  const batchSize = 100;
  
  for (let i = 0; i < instances.length; i += batchSize) {
    const batch = instances.slice(i, i + batchSize);
    
    const primitive = new Cesium.Primitive({
      geometryInstances: batch,
      appearance: new Cesium.PerInstanceColorAppearance({
        translucent: true,
        closed: true,
      }),
      asynchronous: true,
    });
    
    primitiveCollection.add(primitive);
  }
  
  viewer.scene.primitives.add(primitiveCollection);
  
  return primitiveCollection;
}

export function updateHeatmapColors(
  primitiveCollection: Cesium.PrimitiveCollection, 
  dataPoints: HeatmapDataPoint[]
): number {
  if (!primitiveCollection) return 0;
  
  const dataPointMap = new Map<string, HeatmapDataPoint>();
  const altDataPointMap = new Map<string, HeatmapDataPoint>();
  
  dataPoints.forEach(point => {
    const key = `${point.height}_${point.longitude.toFixed(6)}_${point.latitude.toFixed(6)}`;
    dataPointMap.set(key, point);
    
    const altKey = `${point.height}_${point.longitude.toFixed(4)}_${point.latitude.toFixed(4)}`;
    altDataPointMap.set(altKey, point);
    
    const altKey2 = `${point.height}-${point.longitude.toFixed(6)}-${point.latitude.toFixed(6)}`;
    altDataPointMap.set(altKey2, point);
  });
  
  let updatedPrimitivesCount = 0;
  
  for (let i = 0; i < primitiveCollection.length; i++) {
    const primitive = primitiveCollection.get(i) as Cesium.Primitive;
    
    if (!primitive || !primitive.geometryInstances) {
      continue;
    }
    
    const instances = Array.isArray(primitive.geometryInstances) 
      ? primitive.geometryInstances 
      : [primitive.geometryInstances];
    
    const newInstances: Cesium.GeometryInstance[] = [];
    let hasUpdates = false;
    
    for (let j = 0; j < instances.length; j++) {

      const instance = instances[j];
      if (!instance || !instance.id) {
        newInstances.push(instance);
        continue;
      }
      
      const idStr = typeof instance.id === 'string' ? instance.id : (instance.id.toString ? instance.id.toString() : '알 수 없음');
      
      const idParts = idStr.split('-');
      
      if (idParts.length < 6) {
        newInstances.push(instance);
        continue;
      }
      
      try {
        const heightLevel = parseFloat(idParts[3]);
        const longitude = parseFloat(idParts[4]);
        const latitude = parseFloat(idParts[5]);
        
        const key = `${heightLevel}_${longitude.toFixed(6)}_${latitude.toFixed(6)}`;
        const altKey = `${heightLevel}_${longitude.toFixed(4)}_${latitude.toFixed(4)}`;
        const altKey2 = `${heightLevel}-${longitude.toFixed(6)}-${latitude.toFixed(6)}`;
        
        let matchingPoint = dataPointMap.get(key) || 
                          altDataPointMap.get(altKey) || 
                          altDataPointMap.get(altKey2);
        
        if (!matchingPoint) {
          for (const point of dataPoints) {
            if (point.height === heightLevel && 
                Math.abs(point.longitude - longitude) < 0.001 && 
                Math.abs(point.latitude - latitude) < 0.001) {
              matchingPoint = point;
              break;
            }
          }
        }
        
        if (matchingPoint) {
          const newColor = getColorFromValue(matchingPoint.value);
          
          const newInstance = new Cesium.GeometryInstance({
            geometry: instance.geometry,
            modelMatrix: instance.modelMatrix,
            id: instance.id,
            attributes: {
              ...instance.attributes,
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(newColor)
            }
          });
          
          newInstances.push(newInstance);
          hasUpdates = true;
          updatedPrimitivesCount++;
        } else {
          newInstances.push(instance);
        }
      } catch (error) {
        newInstances.push(instance);
        console.error('Heatmap 업데이트 오류:', error);
      }
    }
    
    if (hasUpdates) {
      const newPrimitive = new Cesium.Primitive({
        geometryInstances: newInstances,
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: true,
          closed: true
        }),
        asynchronous: false
      });
      
      primitiveCollection.remove(primitive);
      primitiveCollection.add(newPrimitive);
    }
  }
  
  return updatedPrimitivesCount;
}

export function update3DHeatmapData(
  viewer: Cesium.Viewer,
  heightLevel: number,
  newData: HeatmapDataPoint[],
  primitiveCollection?: Cesium.PrimitiveCollection
): Cesium.PrimitiveCollection {
  if (primitiveCollection && viewer.scene.primitives.contains(primitiveCollection)) {
    viewer.scene.primitives.remove(primitiveCollection);
  }
  
  const filteredData = newData.filter(point => point.height === heightLevel);
  
  return createOptimized3DHeatmap(viewer, heightLevel, {
    valueThreshold: 10,
    useAbsoluteScale: true
  }, filteredData);
}
