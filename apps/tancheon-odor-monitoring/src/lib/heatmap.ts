import { HEATMAP_GRID_CONFIG } from '@/constants/initialization';

export interface HeatmapDataPoint {
  longitude: number;
  latitude: number;
  value: number;
  height: number;  // 고도 (미터)
}

export interface Heatmap3DOptions {
  minHeight?: number;      // 최소 높이 (미터)
  maxHeight?: number;      // 최대 높이 (미터)
  segments?: number;       // 그리드 세분화 (높을수록 더 부드러움)
  colorScheme?: string[];  // 색상 스키마
  opacity?: number;        // 투명도 (0-1)
  enhancedSmoothing?: boolean; // 향상된 스무딩 사용 여부
  influenceRadius?: number;    // 영향 반경 (데이터 포인트 주변)
  valueThreshold?: number;     // 값 임계치 (0.0-1.0)
  colorOffset?: number;        // 색상 매핑 오프셋 (낮은 값이 더 빨리 상위 색상으로 매핑)
  colorMultiplier?: number;    // 색상 매핑 승수 (값 증폭)
  weightDivisor?: number;      // 스무딩 후 값 조정 (값이 클수록 셀당 값 감소)
  lowValueOpacity?: number;    // 낮은 값의 투명도 설정 (0은 완전 투명)
  transparencyThreshold?: number; // 완전 투명 처리할 상위 임계값
  baseHeight?: number;        // 기본 고도 오프셋 (미터)
}

export async function create3DGridHeatmap(
  viewer: any,
  data: HeatmapDataPoint[],
  options: Heatmap3DOptions = {}
): Promise<any[]> {
  const Cesium = await import('cesium');
  
  const minHeight = options.minHeight || 10;
  const maxHeight = options.maxHeight || 100;
  const baseHeight = options.baseHeight || 0; 

  const opacity = options.opacity !== undefined ? options.opacity : 0.3;
  
  // 기본 색상 스키마 설정 (낮은 값부터 높은 값까지)
  const colorScheme = options.colorScheme || [
    "rgba(0, 0, 255, 0.1)",    
    "rgba(0, 255, 255, 0.5)",  
    "rgba(0, 255, 0, 0.6)",    
    "rgba(255, 255, 0, 0.7)",  
    "rgba(255, 0, 0, 0.7)"     
  ];
  
  // 향상된 스무딩 사용 여부
  const enhancedSmoothing = options.enhancedSmoothing !== undefined ? 
    options.enhancedSmoothing : false;
  
  // 영향 반경 설정 - 기본값 또는 환경변수 값 사용
  const influenceRadius = options.influenceRadius || 
    HEATMAP_GRID_CONFIG.INFLUENCE_RADIUS;
  
  // 값 임계치 설정 - 기본값 또는 환경변수 값 사용
  const valueThreshold = options.valueThreshold || 
    HEATMAP_GRID_CONFIG.VALUE_THRESHOLD;
    
  // 색상 매핑 조정 옵션
  const colorOffset = options.colorOffset !== undefined ? options.colorOffset : 0;
  const colorMultiplier = options.colorMultiplier !== undefined ? options.colorMultiplier : 1.0;
  const weightDivisor = options.weightDivisor !== undefined ? options.weightDivisor : 1.0;
  
  // 낮은 값 투명도 설정 (기본값: 0 - 완전 투명)
  const lowValueOpacity = options.lowValueOpacity !== undefined ? options.lowValueOpacity : 0;
  
  // 낮은 값 투명도 적용 임계값 (예: 0.2 이하는 lowValueOpacity 적용)
  const transparencyThreshold = options.transparencyThreshold !== undefined ? 
    options.transparencyThreshold : 0.2;
  
  // 데이터 값 범위 자동 감지 (0-1 또는 0-100)
  const maxDataValue = Math.max(...data.map(p => p.value));
  const isLargeValueRange = maxDataValue > 1.5; // 1.5보다 크면 0-100 범위로 간주
  
  // 값 정규화 함수 (0-1 범위로 변환)
  const normalizeValue = (value: number): number => {
    if (isLargeValueRange) {
      return value / 100;
    }
    return value;
  };
  
  // 고도별로 데이터 그룹화
  const dataByHeight: Record<number, HeatmapDataPoint[]> = {};
  data.forEach(point => {
    if (!dataByHeight[point.height]) {
      dataByHeight[point.height] = [];
    }
    dataByHeight[point.height].push(point);
  });
  
  // 3D 객체 엔티티 배열
  const entities: any[] = [];
  
  // 각 고도별로 처리
  Object.entries(dataByHeight).forEach(([heightStr, heightData]) => {
    const currentHeight = parseInt(heightStr);
    
    // 환경변수에서 격자 경계 가져오기
    const west = HEATMAP_GRID_CONFIG.WEST;
    const south = HEATMAP_GRID_CONFIG.SOUTH;
    const east = HEATMAP_GRID_CONFIG.EAST;
    const north = HEATMAP_GRID_CONFIG.NORTH;
    
    // 격자 해상도 - 환경변수에서 세그먼트 수 가져오기
    const gridSize = options.segments || HEATMAP_GRID_CONFIG.SEGMENTS;
    const longitudeStep = (east - west) / gridSize;
    const latitudeStep = (north - south) / gridSize;
    
    // 격자 데이터 생성 및 보간
    const grid: number[][] = Array(gridSize + 1).fill(0).map(() => Array(gridSize + 1).fill(0));
    const valueGrid: number[][] = Array(gridSize + 1).fill(0).map(() => Array(gridSize + 1).fill(0));
    const weightGrid: number[][] = Array(gridSize + 1).fill(0).map(() => Array(gridSize + 1).fill(0));
    
    // 각 데이터 포인트의 영향력을 격자에 적용
    heightData.forEach(point => {
      const normalizedValue = normalizeValue(point.value);
      
      // 격자 위치 계산
      const x = Math.round((point.longitude - west) / longitudeStep);
      const y = Math.round((point.latitude - south) / latitudeStep);
      
      if (x >= 0 && x <= gridSize && y >= 0 && y <= gridSize) {
        // 포인트에서 격자로의 영향력 반경 - 커스텀 값 사용
        const radius = influenceRadius;
        
        // 영향 범위 내의 모든 격자점에 값 누적
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const gx = x + dx;
            const gy = y + dy;
            
            if (gx >= 0 && gx <= gridSize && gy >= 0 && gy <= gridSize) {
              // 거리에 따른 가중치 계산 (가우시안)
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance <= radius) {
                // 좀 더 집중된 가우시안 커널 사용
                // 2D 히트맵과 일관된 가우시안 커널 사용
                const weight = Math.exp(-(distance * distance) / (2 * (radius / 2) * (radius / 2)));
                valueGrid[gy][gx] += normalizedValue * weight;
                weightGrid[gy][gx] += weight;
              }
            }
          }
        }
      }
    });
    
    // 값 정규화 및 공간적 스무딩 적용
    for (let y = 0; y <= gridSize; y++) {
      for (let x = 0; x <= gridSize; x++) {
        // 기본 정규화 (weightDivisor 적용하여 값 조정)
        grid[y][x] = weightGrid[y][x] > 0 ? valueGrid[y][x] / (weightGrid[y][x] * weightDivisor) : 0;
      }
    }
    
    // 추가 스무딩 패스 - 격자를 더 부드럽게 만들기 위한 추가 작업
    const smoothedGrid = Array(gridSize + 1).fill(0).map(() => Array(gridSize + 1).fill(0));
    
    // enhancedSmoothing이 true인 경우 더 넓은 스무딩 반경과 더 많은 반복 사용
    const smoothRadius = enhancedSmoothing ? 3 : 2; 
    const smoothPasses = enhancedSmoothing ? 4 : 3;
    
    // 스무딩 반복
    for (let smoothPass = 0; smoothPass < smoothPasses; smoothPass++) {
      for (let y = 0; y <= gridSize; y++) {
        for (let x = 0; x <= gridSize; x++) {
          let totalWeight = 0;
          let weightedSum = 0;
          
          // 주변 셀의 가중 평균 계산 (더 넓은 반경)
          for (let dy = -smoothRadius; dy <= smoothRadius; dy++) {
            for (let dx = -smoothRadius; dx <= smoothRadius; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              
              if (nx >= 0 && nx <= gridSize && ny >= 0 && ny <= gridSize) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                // enhancedSmoothing에 따라 다른 파라미터 사용
                const weightParam = enhancedSmoothing ? 1.5 : 1.0;
                const weight = Math.exp(-(dist * dist) / (2 * weightParam * weightParam));
                
                // 첫 패스에서는 원본 그리드 사용, 이후는 이전 스무딩 결과 사용
                const sourceValue = smoothPass === 0 ? 
                  grid[ny][nx] : 
                  smoothedGrid[ny][nx];
                
                weightedSum += sourceValue * weight;
                totalWeight += weight;
              }
            }
          }
          
          smoothedGrid[y][x] = totalWeight > 0 ? weightedSum / totalWeight : 0;
        }
      }
    }
    
    // 격자 렌더링 (폴리곤 생성)
    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        // 4개 꼭지점의 값 평균 계산
        const cornerValues = [
          smoothedGrid[y][x], 
          smoothedGrid[y][x+1], 
          smoothedGrid[y+1][x+1], 
          smoothedGrid[y+1][x]
        ];
        
        // 평균값 계산 - colorOffset 및 colorMultiplier 적용하여 색상 매핑 조정
        let value = cornerValues.reduce((sum, v) => sum + v, 0) / 4;
        
        // 색상 매핑 조정 - 오프셋 추가 및 승수 적용
        value = Math.min(1.0, Math.max(0, (value + colorOffset) * colorMultiplier));
        
        // 값이 임계값보다 작으면 무시 (노이즈 제거)
        if (value < valueThreshold) continue;
        
        // 높이는 오염도에 비례
        const cellHeight = minHeight + (value * (maxHeight - minHeight));
        
        // 색상 보간 (부드러운 그라데이션)
        const colorIndex = value * (colorScheme.length - 1);
        const lowerIndex = Math.floor(colorIndex);
        const upperIndex = Math.min(Math.ceil(colorIndex), colorScheme.length - 1);
        const mixRatio = colorIndex - lowerIndex;
        
        const color = Cesium.Color.lerp(
          Cesium.Color.fromCssColorString(colorScheme[lowerIndex]),
          Cesium.Color.fromCssColorString(colorScheme[upperIndex]),
          mixRatio,
          new Cesium.Color()
        );
        
        // 투명도 계산을 위한 값 범위 설정 (valueThreshold ~ transparencyThreshold 사이는 저투명도)
        let finalOpacity;
        
        if (value <= transparencyThreshold) {
          // transparencyThreshold 이하의 값에는 lowValueOpacity 적용 (기본값 0 = 완전 투명)
          finalOpacity = lowValueOpacity;
        } else {
          // 임계값 이상에서는 점진적으로 투명도 증가
          // enhancedSmoothing이 true인 경우, 2D 히트맵과 더 유사하게 투명도 조정
          const opacityAdjust = enhancedSmoothing ? 
            Math.pow((value - transparencyThreshold) / (1 - transparencyThreshold), 0.7) : // 더 완만한 커브
            0.3 + ((value - transparencyThreshold) / (1 - transparencyThreshold) * 0.7);  // 기존 방식
          
          finalOpacity = opacity * opacityAdjust;
        }
        
        // 최종 투명도 값 설정 (최소값 보장)
        finalOpacity = Math.max(finalOpacity, lowValueOpacity);
        
        const finalColor = new Cesium.Color(
          color.red,
          color.green,
          color.blue,
          finalOpacity
        );
        
        // 중심점 계산
        const centerLon = west + (x + 0.5) * longitudeStep;
        const centerLat = south + (y + 0.5) * latitudeStep;
        
        // 셀 크기 100%로 설정 - 간격 없애기
        const halfWidth = longitudeStep * 0.5;  // 셀 너비의 100%
        const halfHeight = latitudeStep * 0.5;  // 셀 높이의 100%
        
        // 직사각형 모서리 좌표 - 간격 없이 연결
        const positions = [
          centerLon - halfWidth, centerLat - halfHeight,
          centerLon + halfWidth, centerLat - halfHeight,
          centerLon + halfWidth, centerLat + halfHeight,
          centerLon - halfWidth, centerLat + halfHeight,
          centerLon - halfWidth, centerLat - halfHeight  // 닫힌 폴리곤을 위해 처음 점 반복
        ];
        
        // 간단한 폴리곤 사용 - 성능 최적화
        const polygon = viewer.entities.add({
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(positions),
            material: finalColor,
            height: baseHeight + currentHeight, // 기본 고도 + 데이터 고도
            extrudedHeight: baseHeight + currentHeight + cellHeight, // 기본 고도 + 데이터 고도 + 셀 높이
            outline: false,
            perPositionHeight: false
          }
        });
        
        entities.push(polygon);
      }
    }
  });
  
  return entities;
} 