import * as Cesium from 'cesium';
import { HeatmapDataPoint, getHeatmapDataPointsByHeight } from './heatmap_data';
import { HEATMAP_GRID_CONFIG } from '@/constants/initialization';

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

// 기본 히트맵 옵션
const DEFAULT_OPTIONS: Heatmap3DOptions = {
  pointSize: 100,           // 기본 포인트 크기 (미터)
  minPointSize: 0,         // 최소 포인트 크기 (미터)
  maxPointSize: 5,        // 최대 포인트 크기 (미터)
  valueThreshold: HEATMAP_GRID_CONFIG.VALUE_THRESHOLD || 10, // 값 임계값
  heightOffset: HEATMAP_GRID_CONFIG.BASE_HEIGHT || 0, // 높이 오프셋
  useFixedGrid: true,       // 기본적으로 고정 격자 사용
  useAbsoluteScale: true,   // 기본적으로 절대값 스케일 사용
};

// 색상 그라데이션 정의
const colorScale = [
  { value: 1, color: Cesium.Color.BLUE.withAlpha(0.1) },
  { value: 25, color: Cesium.Color.CYAN.withAlpha(0.3) },
  { value: 50, color: Cesium.Color.GREEN.withAlpha(0.5) },
  { value: 75, color: Cesium.Color.YELLOW.withAlpha(0.7) },
  { value: 100, color: Cesium.Color.RED.withAlpha(0.9) },
];

// 동적 색상 매핑을 위한 내부 상태 변수
let currentColorScale = [...colorScale];

/**
 * 색상 스케일 업데이트 함수
 * @param newColorScale 새로운 색상 스케일
 */
export function updateColorScale(newColorScale: Array<{ value: number, color: Cesium.Color }>): void {
  currentColorScale = [...newColorScale];
  console.log('3D 히트맵 색상 스케일이 업데이트되었습니다:', newColorScale);
}

/**
 * 값에 따른 색상을 가져오는 함수
 * @param value 데이터 값
 * @returns 색상 객체
 */
function getColorFromValue(value: number): Cesium.Color {
  // 경계 케이스 처리
  if (value <= currentColorScale[0].value) {
    return currentColorScale[0].color;
  }
  if (value >= currentColorScale[currentColorScale.length - 1].value) {
    return currentColorScale[currentColorScale.length - 1].color;
  }
  
  // 적절한 색상 범위 찾기
  for (let i = 0; i < currentColorScale.length - 1; i++) {
    if (value >= currentColorScale[i].value && value <= currentColorScale[i + 1].value) {
      const ratio = (value - currentColorScale[i].value) / (currentColorScale[i + 1].value - currentColorScale[i].value);
      // 색상 보간
      return Cesium.Color.lerp(currentColorScale[i].color, currentColorScale[i + 1].color, ratio, new Cesium.Color());
    }
  }
  
  return currentColorScale[0].color;
}

function getPointSizeFromValue(value: number, options: Heatmap3DOptions): number {
  const { minPointSize, maxPointSize } = { ...DEFAULT_OPTIONS, ...options };
  // 절대값 스케일 사용 시 DATA_MAX 기준으로 정규화
  const DATA_MAX = HEATMAP_GRID_CONFIG.POLLUTION_DATA_MAX || 100;
  const normalizedValue = options.useAbsoluteScale ? value / DATA_MAX : value / 100;
  return minPointSize! + (maxPointSize! - minPointSize!) * Math.pow(normalizedValue, 1.5);
}

export function createOptimized3DHeatmap(
  viewer: Cesium.Viewer,
  heightLevel: number,
  options: Heatmap3DOptions = {},
  customDataPoints?: HeatmapDataPoint[] // 외부에서 데이터를 전달받기 위한 매개변수 추가
): Cesium.PrimitiveCollection {
  // 옵션 병합
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  // 히트맵 데이터 포인트 가져오기 (customDataPoints가 제공되면 사용, 아니면 기본 데이터 가져오기)
  const dataPoints = customDataPoints || getHeatmapDataPointsByHeight(heightLevel);
  
  console.log(`고도 ${heightLevel}m 3D 히트맵 생성 중: ${dataPoints.length}개 데이터 포인트, 절대값 스케일: ${mergedOptions.useAbsoluteScale}${customDataPoints ? ' (커스텀 데이터 사용)' : ''}`);
  
  const filteredPoints = dataPoints.filter(point => point.value >= mergedOptions.valueThreshold!);
  
  console.log(`고도 ${heightLevel}m 3D 히트맵: 임계값(${mergedOptions.valueThreshold}) 이상 ${filteredPoints.length}개 데이터 포인트`);
  
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
    
    // 박스 크기와 위치 행렬 계산
    const modelMatrix = Cesium.Matrix4.multiplyByTranslation(
      Cesium.Transforms.eastNorthUpToFixedFrame(position),
      new Cesium.Cartesian3(0, 0, 0),
      new Cesium.Matrix4()
    );
    
    // 값에 따른 박스 생성
    let boxGeometry;
    
    if (mergedOptions.useFixedGrid) {
      // 절대값 스케일 사용 시 DATA_MAX 기준으로 정규화
      const DATA_MAX = HEATMAP_GRID_CONFIG.POLLUTION_DATA_MAX || 100;
      // 값에 따른 박스 높이 계산 (값이 클수록 높이가 높아짐)
      const heightScale = mergedOptions.useAbsoluteScale ? point.value / DATA_MAX : point.value / 100; // 0-1 사이 값
      const boxHeight = gridSize * (0.5 + heightScale * 2); // 높이는 격자 크기의 0.5~3.5배
      const boxHeightConstant = 10;
      
      // 박스 형태 정의 - 너비와 길이는 격자 크기에 맞추고, 높이는 값에 따라 조절
      boxGeometry = new Cesium.BoxGeometry({
        minimum: new Cesium.Cartesian3(-gridSize/2, -gridSize/2, 0),
        maximum: new Cesium.Cartesian3(gridSize/2, gridSize/2, boxHeight),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
      });
    } else {
      // 기존 방식 (가변 크기 모드)
      const pointSize = getPointSizeFromValue(point.value, mergedOptions);
      
      boxGeometry = new Cesium.BoxGeometry({
        minimum: new Cesium.Cartesian3(-pointSize/2, -pointSize/2, -pointSize/2),
        maximum: new Cesium.Cartesian3(pointSize/2, pointSize/2, pointSize/2),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
      });
    }
    
    // GeometryInstance 생성
    return new Cesium.GeometryInstance({
      geometry: boxGeometry,
      modelMatrix: modelMatrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
      },
      id: `heatmap-3d-box-${heightLevel}-${point.longitude.toFixed(6)}-${point.latitude.toFixed(6)}`,
    });
  });
  
  // 여러 인스턴스를 하나의 Primitive로 배치 처리
  const batchSize = 100; // 한 번에 처리할 인스턴스 수
  
  for (let i = 0; i < instances.length; i += batchSize) {
    const batch = instances.slice(i, i + batchSize);
    
    // Primitive 생성 및 추가
    const primitive = new Cesium.Primitive({
      geometryInstances: batch,
      appearance: new Cesium.PerInstanceColorAppearance({
        translucent: true,
        closed: true,
      }),
      asynchronous: true,
    });
    
    // 컬렉션에 추가
    primitiveCollection.add(primitive);
  }
  
  viewer.scene.primitives.add(primitiveCollection);
  
  console.log(`고도 ${heightLevel}m 3D 히트맵 생성 완료`);
  
  return primitiveCollection;
}

/**
 * 히트맵 색상 업데이트 함수
 * @param primitiveCollection 업데이트할 프리미티브 컬렉션
 * @param dataPoints 업데이트된 데이터 포인트
 */
export function updateHeatmapColors(
  primitiveCollection: Cesium.PrimitiveCollection, 
  dataPoints: HeatmapDataPoint[]
): number {
  if (!primitiveCollection) return 0;
  
  console.log(`색상 업데이트 시작: ${dataPoints.length}개 데이터 포인트로 업데이트합니다`);
  
  // 데이터 포인트 맵 만들기 (빠른 조회용)
  const dataPointMap = new Map<string, HeatmapDataPoint>();
  const altDataPointMap = new Map<string, HeatmapDataPoint>(); // 대체 키 맵 추가
  
  dataPoints.forEach(point => {
    // 키: height_longitude_latitude 형식 (정확한 매칭을 위해)
    const key = `${point.height}_${point.longitude.toFixed(6)}_${point.latitude.toFixed(6)}`;
    dataPointMap.set(key, point);
    
    // 대체 키: 좀 더 느슨한 정밀도로 키 생성
    const altKey = `${point.height}_${point.longitude.toFixed(4)}_${point.latitude.toFixed(4)}`;
    altDataPointMap.set(altKey, point);
    
    // 추가 대체 키: 형식이 다른 경우를 위한 키
    const altKey2 = `${point.height}-${point.longitude.toFixed(6)}-${point.latitude.toFixed(6)}`;
    altDataPointMap.set(altKey2, point);
  });
  
  let idSampleLogged = false;
  
  let updatedPrimitivesCount = 0;
  let totalInstancesCount = 0;
  
  for (let i = 0; i < primitiveCollection.length; i++) {
    const primitive = primitiveCollection.get(i) as Cesium.Primitive;

    console.log('primitive', primitive);
    
    if (!primitive || !primitive.geometryInstances) {
      console.warn(`프리미티브 #${i}에 geometryInstances가 없습니다.`);
      continue;
    }
    
    const instances = Array.isArray(primitive.geometryInstances) 
      ? primitive.geometryInstances 
      : [primitive.geometryInstances];
    
    console.log(`프리미티브 #${i}에 ${instances.length}개의 인스턴스가 있습니다.`);
    
    const newInstances: Cesium.GeometryInstance[] = [];
    let hasUpdates = false;
    
    for (let j = 0; j < instances.length; j++) {
      totalInstancesCount++;
      
      const instance = instances[j];
      if (!instance || !instance.id) {
        console.warn(`인스턴스 #${j}에 ID가 없습니다.`);
        newInstances.push(instance);
        continue;
      }
      
      // ID 문자열 추출
      const idStr = typeof instance.id === 'string' ? instance.id : (instance.id.toString ? instance.id.toString() : '알 수 없음');
      
      // 처음 10개 인스턴스의 ID 샘플 로깅
      if (i === 0 && j < 10) {
        console.log(`인스턴스 #${j} ID: ${idStr}`);
      }
      
      // 첫 ID 형식 확인 (디버깅용)
      if (!idSampleLogged) {
        console.log(`인스턴스 ID 샘플: ${idStr}`);
        idSampleLogged = true;
      }
      
      // ID 파싱
      const idParts = idStr.split('-');
      
      if (idParts.length < 6) {
        console.warn(`ID 형식이 예상과 다릅니다: ${idStr}`);
        newInstances.push(instance);
        continue;
      }
      
      try {
        // ID에서 정보 추출 (예: heatmap-3d-box-30-127.123456-37.654321)
        const heightLevel = parseFloat(idParts[3]);
        const longitude = parseFloat(idParts[4]);
        const latitude = parseFloat(idParts[5]);
        
        // 키 생성 (데이터 포인트 맵과 동일한 형식)
        const key = `${heightLevel}_${longitude.toFixed(6)}_${latitude.toFixed(6)}`;
        
        // 대체 키들 (느슨한 매칭 시도)
        const altKey = `${heightLevel}_${longitude.toFixed(4)}_${latitude.toFixed(4)}`;
        const altKey2 = `${heightLevel}-${longitude.toFixed(6)}-${latitude.toFixed(6)}`;
        
        // 일치하는 데이터 포인트 찾기 (여러 방식 시도)
        let matchingPoint = dataPointMap.get(key) || 
                          altDataPointMap.get(altKey) || 
                          altDataPointMap.get(altKey2);
        
        // 위치 기반 매칭 시도 (마지막 시도)
        if (!matchingPoint) {
          // 가장 가까운 데이터 포인트 찾기
          for (const point of dataPoints) {
            if (point.height === heightLevel && 
                Math.abs(point.longitude - longitude) < 0.001 && 
                Math.abs(point.latitude - latitude) < 0.001) {
              matchingPoint = point;
              break;
            }
          }
        }
        
        // 샘플링을 위해 처음 몇 개의 인스턴스에 대해 자세한 로깅
        if (i === 0 && j < 3) {
          console.log(`인스턴스 #${j} 매칭 시도:`, {
            id: idStr,
            height: heightLevel,
            longitude: longitude,
            latitude: latitude,
            key: key,
            altKey: altKey,
            altKey2: altKey2,
            found: !!matchingPoint
          });
        }
        
        if (matchingPoint) {
          // 새 색상 계산
          const newColor = getColorFromValue(matchingPoint.value);
          
          // 새 인스턴스 생성 (기존 정보 복사하며 색상만 변경)
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
          // 변경 필요 없는 인스턴스는 그대로 유지
          newInstances.push(instance);
        }
      } catch (error) {
        console.warn(`인스턴스 ID 파싱 오류, 원본 유지: ${idStr}`, error);
        newInstances.push(instance);
      }
    }
    
    // 변경된 인스턴스가 있으면 Primitive 교체
    if (hasUpdates) {
      // 새 Primitive 생성
      const newPrimitive = new Cesium.Primitive({
        geometryInstances: newInstances,
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: true,
          closed: true
        }),
        asynchronous: false // 즉시 렌더링
      });
      
      // 이전 Primitive 제거 후 새로운 Primitive 추가
      primitiveCollection.remove(primitive);
      primitiveCollection.add(newPrimitive);
    }
  }
  
  console.log(`3D 히트맵 색상 업데이트 완료: 전체 ${totalInstancesCount}개 중 ${updatedPrimitivesCount}개 업데이트됨`);
  return updatedPrimitivesCount;
}

// 3D 히트맵 데이터 업데이트 함수
export function update3DHeatmapData(
  viewer: Cesium.Viewer,
  heightLevel: number,
  newData: HeatmapDataPoint[],
  primitiveCollection?: Cesium.PrimitiveCollection
): Cesium.PrimitiveCollection {
  // 기존 프리미티브 컬렉션이 있으면 제거
  if (primitiveCollection && viewer.scene.primitives.contains(primitiveCollection)) {
    viewer.scene.primitives.remove(primitiveCollection);
  }
  
  // 필터링된 데이터로 새 히트맵 생성
  const filteredData = newData.filter(point => point.height === heightLevel);
  console.log(`고도 ${heightLevel}m 3D 히트맵 데이터 업데이트: ${filteredData.length}개 데이터 포인트`);
  
  // 새 히트맵 생성
  return createOptimized3DHeatmap(viewer, heightLevel, {
    valueThreshold: 10,
    useAbsoluteScale: true
  });
}
