import { HEATMAP_GRID_CONFIG } from '@/constants/initialization';

export interface HeatmapDataPoint {
  longitude: number;
  latitude: number;
  value: number;
  height: number;  
}

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
}

export function createHeatmapImage(
  data: HeatmapDataPoint[],
  options: HeatmapOptions = {}
): HTMLCanvasElement {
  const gridSize = options.gridSize || 256;
  const canvasSize = options.canvasSize || 1024;
  const radius = options.radius || 15;
  const blurRadius = options.blurRadius || 12;
  const valueThreshold = options.valueThreshold || HEATMAP_GRID_CONFIG.VALUE_THRESHOLD;
  const showBorder = options.showBorder !== undefined ? options.showBorder : true;
  const borderColor = options.borderColor || 'rgba(255, 255, 255, 0.7)';
  const borderWidth = options.borderWidth || 3;
  
  const maxDataValue = Math.max(...data.map(p => p.value));
  const isLargeValueRange = maxDataValue > 1.5;
  
  const normalizeValue = (value: number): number => {
    if (isLargeValueRange) {
      return value / 100;
    }
    return value;
  };

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
  
  data.forEach(point => {
    const gridX = Math.floor(((point.longitude - west) / (east - west)) * (gridSize - 1));
    const gridY = Math.floor((1 - (point.latitude - south) / (north - south)) * (gridSize - 1));
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      const intensity = normalizeValue(point.value);
      
      for (let y = Math.max(0, gridY - radius); y < Math.min(gridSize, gridY + radius); y++) {
        for (let x = Math.max(0, gridX - radius); x < Math.min(gridSize, gridX + radius); x++) {
          const distance = Math.sqrt(Math.pow(gridX - x, 2) + Math.pow(gridY - y, 2));
          if (distance <= radius) {
            const factor = Math.exp(-(distance * distance) / (2 * (radius/2) * (radius/2)));
            grid[y][x] += intensity * factor;
          }
        }
      }
    }
  });
  
  let maxValue = 0;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      maxValue = Math.max(maxValue, grid[y][x]);
    }
  }
  
  const colorMapCanvas = document.createElement('canvas');
  colorMapCanvas.width = 256;
  colorMapCanvas.height = 1;
  const colorMapCtx = colorMapCanvas.getContext('2d')!;
  const colorGradient = colorMapCtx.createLinearGradient(0, 0, 256, 0);
  
  colorGradient.addColorStop(0.0, 'rgba(0, 0, 255, 0)');
  colorGradient.addColorStop(0.1, 'rgba(0, 0, 255, 0.5)');
  colorGradient.addColorStop(0.3, 'rgba(0, 255, 255, 0.6)');
  colorGradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.7)');
  colorGradient.addColorStop(0.7, 'rgba(255, 255, 0, 0.8)');
  colorGradient.addColorStop(1.0, 'rgba(255, 0, 0, 0.9)');
  
  colorMapCtx.fillStyle = colorGradient;
  colorMapCtx.fillRect(0, 0, 256, 1);
  const colorMapData = colorMapCtx.getImageData(0, 0, 256, 1).data;
  
  const imageData = ctx.createImageData(canvasSize, canvasSize);
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const value = grid[y][x] / maxValue;
      
      if (value > valueThreshold) {
        const canvasX = Math.floor((x / gridSize) * canvasSize);
        const canvasY = Math.floor((y / gridSize) * canvasSize);
        
        const colorIndex = Math.min(255, Math.floor(value * 255)) * 4;
        
        for (let cy = 0; cy < canvasSize/gridSize; cy++) {
          for (let cx = 0; cx < canvasSize/gridSize; cx++) {
            const pixelPos = ((canvasY + cy) * canvasSize + (canvasX + cx)) * 4;
            
            if (pixelPos >= 0 && pixelPos < imageData.data.length - 3) {
              imageData.data[pixelPos] = colorMapData[colorIndex];
              imageData.data[pixelPos + 1] = colorMapData[colorIndex + 1];
              imageData.data[pixelPos + 2] = colorMapData[colorIndex + 2];
              imageData.data[pixelPos + 3] = Math.floor(value * colorMapData[colorIndex + 3]);
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
  viewer: any,
  canvas: HTMLCanvasElement,
  data: HeatmapDataPoint[],
  height: number,
  options: HeatmapOptions = {}
): Promise<any> {
  const Cesium = await import('cesium');
  
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
    rectangle: {
      coordinates: rectangle,
      material: heatmapTexture,
      height: height,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      rotation: rotation
    }
  });
  
  return heatmapEntity;
}

export async function createHeatmapAtHeight(
  viewer: any,
  data: HeatmapDataPoint[],
  height: number,
  options: HeatmapOptions = {}
): Promise<any> {
  const canvas = createHeatmapImage(data, options);
  
  return await addHeatmapToViewer(viewer, canvas, data, height, options);
}

export async function create2DHeatmaps(
  viewer: any,
  data: HeatmapDataPoint[],
  options: HeatmapOptions = {}
): Promise<any[]> {
  const heightLevels = [...new Set(data.map(point => point.height))].sort((a, b) => a - b);
  const entities: any[] = [];
  
  for (const height of heightLevels) {
    const heightFilteredData = data.filter(point => point.height === height);
    
    if (heightFilteredData.length > 0) {
      console.log(`고도 ${height}m 2D 히트맵 생성`);
      const heatmapEntity = await createHeatmapAtHeight(
        viewer, 
        heightFilteredData, 
        height, 
        options
      );
      
      entities.push(heatmapEntity);
    }
  }
  
  return entities;
}