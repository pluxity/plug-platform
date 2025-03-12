import { HeightHeatmaps } from '@/types/pollution';

/**
 * 히트맵 생성을 위한 데이터 포인트 인터페이스
 */
export interface HeatmapDataPoint {
  longitude: number;
  latitude: number;
  value: number;
}

/**
 * 히트맵 옵션 인터페이스
 */
export interface HeatmapOptions {
  gridSize?: number;        // 그리드 해상도
  canvasSize?: number;      // 캔버스 크기
  radius?: number;          // 영향 반경
  blurRadius?: number;      // 블러 효과 반경
  valueThreshold?: number;  // 값 임계치 (0.0-1.0)
}

/**
 * 히트맵 이미지 생성 함수
 * 
 * @param data 히트맵 데이터 포인트 배열
 * @param options 히트맵 생성 옵션
 * @returns 히트맵 캔버스 요소
 */
export function createHeatmapImage(
  data: HeatmapDataPoint[],
  options: HeatmapOptions = {}
): HTMLCanvasElement {
  // 옵션 기본값 설정
  const gridSize = options.gridSize || 256;
  const canvasSize = options.canvasSize || 1024;
  const radius = options.radius || 15;
  const blurRadius = options.blurRadius || 8;
  const valueThreshold = options.valueThreshold || 0.05;

  // 히트맵 영역 경계 계산
  const west = Math.min(...data.map(p => p.longitude)) - 0.001;
  const south = Math.min(...data.map(p => p.latitude)) - 0.001;
  const east = Math.max(...data.map(p => p.longitude)) + 0.001;
  const north = Math.max(...data.map(p => p.latitude)) + 0.001;
  
  // 히트맵 이미지 생성
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d')!;
  
  // 배경을 투명하게 설정
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  
  // 히트맵 데이터 그리드 생성
  const grid = new Array(gridSize).fill(0).map(() => new Array(gridSize).fill(0));
  
  // 모든 데이터 포인트의 값을 그리드에 누적
  data.forEach(point => {
    // 좌표를 그리드 좌표로 변환
    const gridX = Math.floor(((point.longitude - west) / (east - west)) * (gridSize - 1));
    const gridY = Math.floor((1 - (point.latitude - south) / (north - south)) * (gridSize - 1));
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      // 가중치를 더 주고, 값의 영향 범위를 확장 (가우시안 분포)
      const intensity = point.value;
      
      // 주변 그리드 셀에도 영향을 줌 (가우시안 분포 적용)
      for (let y = Math.max(0, gridY - radius); y < Math.min(gridSize, gridY + radius); y++) {
        for (let x = Math.max(0, gridX - radius); x < Math.min(gridSize, gridX + radius); x++) {
          const distance = Math.sqrt(Math.pow(gridX - x, 2) + Math.pow(gridY - y, 2));
          if (distance <= radius) {
            // 거리에 따라 영향력 감소 (가우시안)
            const factor = Math.exp(-(distance * distance) / (2 * (radius/2) * (radius/2)));
            grid[y][x] += intensity * factor;
          }
        }
      }
    }
  });
  
  // 그리드 값의 최대값 찾기 (정규화를 위해)
  let maxValue = 0;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      maxValue = Math.max(maxValue, grid[y][x]);
    }
  }
  
  // 컬러맵 캔버스 생성 (그라데이션)
  const colorMapCanvas = document.createElement('canvas');
  colorMapCanvas.width = 256;
  colorMapCanvas.height = 1;
  const colorMapCtx = colorMapCanvas.getContext('2d')!;
  const colorGradient = colorMapCtx.createLinearGradient(0, 0, 256, 0);
  colorGradient.addColorStop(0.0, 'rgba(0, 0, 255, 0)');  // 투명한 파란색 (낮은 값)
  colorGradient.addColorStop(0.1, 'rgba(0, 0, 255, 0.5)'); // 반투명 파란색
  colorGradient.addColorStop(0.3, 'rgba(0, 255, 255, 0.6)'); // 청록색
  colorGradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.7)');   // 초록색
  colorGradient.addColorStop(0.7, 'rgba(255, 255, 0, 0.8)'); // 노란색
  colorGradient.addColorStop(1.0, 'rgba(255, 0, 0, 0.9)');   // 빨간색 (높은 값)
  colorMapCtx.fillStyle = colorGradient;
  colorMapCtx.fillRect(0, 0, 256, 1);
  const colorMapData = colorMapCtx.getImageData(0, 0, 256, 1).data;
  
  // 이미지 데이터 생성
  const imageData = ctx.createImageData(canvasSize, canvasSize);
  
  // 그리드를 이미지로 변환
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const value = grid[y][x] / maxValue; // 0~1 사이 값으로 정규화
      
      if (value > valueThreshold) { // 값이 너무 작으면 무시 (노이즈 제거)
        // 그리드 셀을 캔버스 크기에 맞게 스케일링
        const canvasX = Math.floor((x / gridSize) * canvasSize);
        const canvasY = Math.floor((y / gridSize) * canvasSize);
        
        // 색상 인덱스 계산
        const colorIndex = Math.min(255, Math.floor(value * 255)) * 4;
        
        // 캔버스의 각 픽셀에 색상 값 설정
        for (let cy = 0; cy < canvasSize/gridSize; cy++) {
          for (let cx = 0; cx < canvasSize/gridSize; cx++) {
            const pixelPos = ((canvasY + cy) * canvasSize + (canvasX + cx)) * 4;
            
            if (pixelPos >= 0 && pixelPos < imageData.data.length - 3) {
              imageData.data[pixelPos] = colorMapData[colorIndex];     // R
              imageData.data[pixelPos + 1] = colorMapData[colorIndex + 1]; // G
              imageData.data[pixelPos + 2] = colorMapData[colorIndex + 2]; // B
              imageData.data[pixelPos + 3] = Math.floor(value * colorMapData[colorIndex + 3]); // A (투명도)
            }
          }
        }
      }
    }
  }
  
  // 이미지 데이터 캔버스에 그리기
  ctx.putImageData(imageData, 0, 0);
  
  // 블러 효과로 부드러운 히트맵 생성
  if (blurRadius > 0) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasSize;
    tempCanvas.height = canvasSize;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.filter = `blur(${blurRadius}px)`;
    tempCtx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.drawImage(tempCanvas, 0, 0);
  }
  
  return canvas;
}

/**
 * 세슘 뷰어에 히트맵 엔티티 추가 함수
 * 
 * @param viewer 세슘 뷰어 인스턴스
 * @param canvas 히트맵 이미지 캔버스
 * @param data 히트맵 데이터 포인트 배열
 * @param height 히트맵 높이 (미터)
 * @returns 생성된 히트맵 엔티티
 */
export async function addHeatmapToViewer(
  viewer: any,
  canvas: HTMLCanvasElement,
  data: HeatmapDataPoint[],
  height: number
): Promise<any> {
  const Cesium = await import('cesium');
  
  // 히트맵 영역 경계 계산
  const west = Math.min(...data.map(p => p.longitude)) - 0.001;
  const south = Math.min(...data.map(p => p.latitude)) - 0.001;
  const east = Math.max(...data.map(p => p.longitude)) + 0.001;
  const north = Math.max(...data.map(p => p.latitude)) + 0.001;
  
  // 히트맵 텍스처 생성
  const heatmapTexture = new Cesium.ImageMaterialProperty({
    image: canvas,
    transparent: true
  });
  
  // 히트맵 영역 생성
  const rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
  
  // 히트맵 엔티티 생성
  const heatmapEntity = viewer.entities.add({
    rectangle: {
      coordinates: rectangle,
      material: heatmapTexture,
      height: height, // 고도별 높이 설정
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
    }
  });
  
  return heatmapEntity;
}

/**
 * 특정 고도의 히트맵 생성 함수
 * 
 * @param viewer 세슘 뷰어 인스턴스
 * @param data 히트맵 데이터 포인트 배열
 * @param height 히트맵 높이 (미터)
 * @param options 히트맵 생성 옵션
 * @returns 생성된 히트맵 엔티티
 */
export async function createHeatmapAtHeight(
  viewer: any,
  data: HeatmapDataPoint[],
  height: number,
  options: HeatmapOptions = {}
): Promise<any> {
  // 히트맵 이미지 생성
  const canvas = createHeatmapImage(data, options);
  
  // 뷰어에 히트맵 추가
  return await addHeatmapToViewer(viewer, canvas, data, height);
} 