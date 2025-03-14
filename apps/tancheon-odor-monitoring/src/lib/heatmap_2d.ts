import * as Cesium from 'cesium';
import { HEATMAP_GRID_CONFIG } from '@/constants/initialization';
import { HeatmapDataPoint, getHeatmapDataPointsByHeight } from './heatmap_data';

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
  useAbsoluteScale?: boolean; // 절대값 스케일 사용 여부
}

// 2D 히트맵 생성 옵션 인터페이스 (이전 코드와의 호환성 유지)
export interface Heatmap2DOptions {
  radius?: number;            // 영향 반경
  blur?: number;              // 블러 적용 여부
  gradient?: string[];        // 색상 그라데이션
  valueThreshold?: number;    // 데이터 임계값
  opacity?: number;           // 불투명도
  useAbsoluteScale?: boolean; // 절대값 스케일 사용 여부
}

// 기본 히트맵 옵션
const DEFAULT_OPTIONS: HeatmapOptions = {
  gridSize: 256,
  canvasSize: 1024,
  radius: 15,
  blurRadius: 12,
  valueThreshold: HEATMAP_GRID_CONFIG.VALUE_THRESHOLD || 0.01,
  showBorder: false,
  borderColor: 'rgba(255, 255, 255, 0.7)',
  borderWidth: 2,
  rotation: 0,
  useAbsoluteScale: true // 기본값으로 절대값 스케일 사용
};

// 전역 절대값 범위 (모든 고도에 동일하게 적용)
const GLOBAL_MIN_VALUE = HEATMAP_GRID_CONFIG.POLLUTION_DATA_MIN || 0;
const GLOBAL_MAX_VALUE = HEATMAP_GRID_CONFIG.POLLUTION_DATA_MAX || 100;

export function createHeatmapImage(
  data: HeatmapDataPoint[],
  options: HeatmapOptions = {}
): HTMLCanvasElement {
  const gridSize = options.gridSize || DEFAULT_OPTIONS.gridSize!;
  const canvasSize = options.canvasSize || DEFAULT_OPTIONS.canvasSize!;
  const radius = options.radius || DEFAULT_OPTIONS.radius!;
  const blurRadius = options.blurRadius || DEFAULT_OPTIONS.blurRadius!;
  const valueThreshold = options.valueThreshold || DEFAULT_OPTIONS.valueThreshold!;
  const showBorder = options.showBorder !== undefined ? options.showBorder : DEFAULT_OPTIONS.showBorder!;
  const borderColor = options.borderColor || DEFAULT_OPTIONS.borderColor!;
  const borderWidth = options.borderWidth || DEFAULT_OPTIONS.borderWidth!;
  const useAbsoluteScale = options.useAbsoluteScale !== undefined ? options.useAbsoluteScale : DEFAULT_OPTIONS.useAbsoluteScale!;
  
  console.log(`2D 히트맵 생성 중: ${data.length}개 데이터, 그리드 ${gridSize}x${gridSize}, 캔버스 ${canvasSize}x${canvasSize}, 절대값 스케일: ${useAbsoluteScale}`);
  
  // 고도에 관계없이 항상 전역 최대/최소값 사용
  const DATA_MIN = GLOBAL_MIN_VALUE;
  const DATA_MAX = GLOBAL_MAX_VALUE;
  
  // 데이터셋의 실제 최대/최소값 (로깅용)
  const actualMinValue = Math.min(...data.map(p => p.value), 0);
  const actualMaxValue = Math.max(...data.map(p => p.value));
  
  console.log(`2D 히트맵 데이터 범위: 설정 범위=[${DATA_MIN}-${DATA_MAX}], 실제 범위=[${actualMinValue}-${actualMaxValue}], 실제 데이터 점 수=${data.length}개`);
  
  const west = HEATMAP_GRID_CONFIG.WEST;
  const south = HEATMAP_GRID_CONFIG.SOUTH;
  const east = HEATMAP_GRID_CONFIG.EAST;
  const north = HEATMAP_GRID_CONFIG.NORTH;
  
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d')!;
  
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  
  const grid = new Array(gridSize).fill(0).map(() => new Array(gridSize).fill(0));
  
  // 값 강도 조절 계수 재도입 (더 낮은 값으로)
  const intensityScale = 0.05; // 값 증폭 방지를 위해 낮은 계수 적용
  
  data.forEach(point => {
    const gridX = Math.floor(((point.longitude - west) / (east - west)) * (gridSize - 1));
    const gridY = Math.floor((1 - (point.latitude - south) / (north - south)) * (gridSize - 1));
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      // 원본 값에 강도 계수 적용
      const intensity = point.value * intensityScale;
    
      for (let y = Math.max(0, gridY - radius); y < Math.min(gridSize, gridY + radius); y++) {
        for (let x = Math.max(0, gridX - radius); x < Math.min(gridSize, gridX + radius); x++) {
          const distance = Math.sqrt(Math.pow(gridX - x, 2) + Math.pow(gridY - y, 2));
          if (distance <= radius) {
            // 거리에 따른 감쇠 조정
            const factor = Math.exp(-(distance * distance) / (2 * (radius/3) * (radius/3)));
            grid[y][x] += intensity * factor;
          }
        }
      }
    }
  });
  
  // 그리드 최대값 계산
  let maxGridValue = 0;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      maxGridValue = Math.max(maxGridValue, grid[y][x]);
    }
  }
  
  console.log(`원본 그리드 최대값: ${maxGridValue}`);
  
  // 적절한 값 범위로 스케일링 재도입
  // 너무 큰 값 범위는 시각적 구분을 어렵게 함
  const targetMaxValue = DATA_MAX;
  
  if (maxGridValue > targetMaxValue) {
    const scaleFactor = targetMaxValue / maxGridValue;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        grid[y][x] *= scaleFactor;
      }
    }
    maxGridValue = targetMaxValue;
    console.log(`그리드 값 스케일링 적용: 팩터 = ${scaleFactor}`);
  }
  
  // 데이터 분포 로깅 (디버깅용)
  let values = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] > 0) {
        values.push(grid[y][x]);
      }
    }
  }
  
  if (values.length > 0) {
    values.sort((a, b) => a - b);
    const min = values[0];
    const max = values[values.length - 1];
    const median = values[Math.floor(values.length / 2)];
    const p90 = values[Math.floor(values.length * 0.9)];
  }
  
  // 색상 매핑을 위한 선형 변환 함수
  // 0-targetMaxValue 범위를 0-1로 정규화
  const normalizeForColor = (value: number): number => {
    return value / targetMaxValue;
  };
  
  const colorMapCanvas = document.createElement('canvas');
  colorMapCanvas.width = 256;
  colorMapCanvas.height = 1;
  const colorMapCtx = colorMapCanvas.getContext('2d')!;
  const colorGradient = colorMapCtx.createLinearGradient(0, 0, 256, 0);
  
  // 색상 그라데이션 - 알파값 더 높게 조정
  colorGradient.addColorStop(0.0, 'rgba(0, 0, 0, 0)');      // 시작은 투명
  colorGradient.addColorStop(0.01, 'rgba(0, 0, 255, 0.1)'); // 파랑 (낮은 값)
  colorGradient.addColorStop(0.25, 'rgba(0, 255, 255, 0.3)'); // 청록색
  colorGradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.5)');  // 녹색 (중간 값)
  colorGradient.addColorStop(0.75, 'rgba(255, 255, 0, 7)'); // 노랑
  colorGradient.addColorStop(1.0, 'rgba(255, 0, 0, 1.0)');  // 빨강 (높은 값)
  
  colorMapCtx.fillStyle = colorGradient;
  colorMapCtx.fillRect(0, 0, 256, 1);
  const colorMapData = colorMapCtx.getImageData(0, 0, 256, 1).data;
  
  const imageData = ctx.createImageData(canvasSize, canvasSize);
  
  // 로그 스케일 값 변환 함수
  const transformValue = (value: number): number => {
    if (value === 0) return 0;
    
    // 정규화된 값에 로그 스케일 적용 (낮은 값을 더 돋보이게)
    const normalizedValue = normalizeForColor(value);
    
    // 데이터의 시각적 구분을 위한 변환 
    return Math.log(1 + normalizedValue * 9) / Math.log(10);
  };
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const value = grid[y][x];
      const transformedValue = transformValue(value);
      
      if (transformedValue > valueThreshold) {
        const canvasX = Math.floor((x / gridSize) * canvasSize);
        const canvasY = Math.floor((y / gridSize) * canvasSize);
        
        const colorIndex = Math.min(255, Math.floor(transformedValue * 255)) * 4;
        
        for (let cy = 0; cy < canvasSize/gridSize; cy++) {
          for (let cx = 0; cx < canvasSize/gridSize; cx++) {
            const pixelPos = ((canvasY + cy) * canvasSize + (canvasX + cx)) * 4;
            
            if (pixelPos >= 0 && pixelPos < imageData.data.length - 3) {
              imageData.data[pixelPos] = colorMapData[colorIndex];
              imageData.data[pixelPos + 1] = colorMapData[colorIndex + 1];
              imageData.data[pixelPos + 2] = colorMapData[colorIndex + 2];
              
              // 알파값 계산 - 원래 알파값 유지하되 최소값 설정
              const alphaBase = colorMapData[colorIndex + 3];
              // 최소 알파값 보장
              const alphaValue = Math.min(255, Math.max(alphaBase, 180));
              imageData.data[pixelPos + 3] = alphaValue;
            }
          }
        }
      }
    }
  }
  
  if (blurRadius > 0) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasSize;
    tempCanvas.height = canvasSize;
    const tempCtx = tempCanvas.getContext('2d')!;
    
    tempCtx.putImageData(imageData, 0, 0);
    
    ctx.filter = `blur(${blurRadius}px)`;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.drawImage(tempCanvas, 0, 0);
    
    ctx.filter = 'none';
  } else {
    ctx.putImageData(imageData, 0, 0);
  }
  
  if (showBorder) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    
    const padding = borderWidth / 2;
    ctx.beginPath();
    ctx.rect(
      padding, 
      padding, 
      canvasSize - borderWidth, 
      canvasSize - borderWidth
    );
    ctx.stroke();
  }
  
  return canvas;
}

export async function addHeatmapToViewer(
  viewer: Cesium.Viewer,
  canvas: HTMLCanvasElement,
  height: number,
  options: HeatmapOptions = {}
): Promise<Cesium.Entity> {
  const west = HEATMAP_GRID_CONFIG.WEST;
  const south = HEATMAP_GRID_CONFIG.SOUTH;
  const east = HEATMAP_GRID_CONFIG.EAST;
  const north = HEATMAP_GRID_CONFIG.NORTH;
  
  const heatmapTexture = new Cesium.ImageMaterialProperty({
    image: canvas,
    transparent: true
  });
  
  const rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
  
  const rotation = options.rotation || 0;
  
  const heatmapEntity = viewer.entities.add({
    id: `heatmap-2d-${height}`,
    rectangle: {
      coordinates: rectangle,
      material: heatmapTexture,
      height: HEATMAP_GRID_CONFIG.BASE_HEIGHT + height,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      rotation: rotation,
      outline: false,
      outlineColor: Cesium.Color.RED.withAlpha(0.1),
    }
  });
  
  return heatmapEntity;
}

export function create2DHeatmap(
  viewer: Cesium.Viewer,
  heightLevel: number,
  options: Heatmap2DOptions = {}
): Promise<Cesium.Entity> {

  const heatmapOptions: HeatmapOptions = {
    valueThreshold: options.valueThreshold || DEFAULT_OPTIONS.valueThreshold,
    blurRadius: options.blur ? Math.floor(options.blur * 15) : DEFAULT_OPTIONS.blurRadius,
    radius: options.radius ? Math.floor(options.radius * 7500) : DEFAULT_OPTIONS.radius,
    useAbsoluteScale: options.useAbsoluteScale !== undefined ? options.useAbsoluteScale : DEFAULT_OPTIONS.useAbsoluteScale
  };
  
  // 히트맵 데이터 포인트 가져오기
  const dataPoints = getHeatmapDataPointsByHeight(heightLevel);
  
  // 히트맵 이미지 생성
  const canvas = createHeatmapImage(dataPoints, heatmapOptions);
  
  // 히트맵 엔티티 생성 및 반환
  const entity = addHeatmapToViewer(viewer, canvas, heightLevel, heatmapOptions);
    
  return entity;
}

export function create2DHeatmapsForHeights(
  viewer: Cesium.Viewer,
  heightLevels: number[],
  options: Heatmap2DOptions = {}
): Promise<Cesium.Entity[]> {
  const entities: Promise<Cesium.Entity>[] = [];
  
  for (const height of heightLevels) {
    const entity = create2DHeatmap(viewer, height, options);
    entities.push(entity);
  }
  
  return Promise.all(entities);
}