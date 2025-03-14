import * as Cesium from 'cesium';
import { HEATMAP_GRID_CONFIG } from '@/constants/initialization';
import { HeatmapDataPoint, getHeatmapDataPointsByHeight } from './heatmap_data';
import { HeatmapOptions, Heatmap2DOptions } from '@/types/heatmap';

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
  useAbsoluteScale: true
};


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
  
  const intensityScale = 0.05;
  
  data.forEach(point => {
    const gridX = Math.floor(((point.longitude - west) / (east - west)) * (gridSize - 1));
    const gridY = Math.floor((1 - (point.latitude - south) / (north - south)) * (gridSize - 1));
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      const intensity = point.value * intensityScale;
    
      for (let y = Math.max(0, gridY - radius); y < Math.min(gridSize, gridY + radius); y++) {
        for (let x = Math.max(0, gridX - radius); x < Math.min(gridSize, gridX + radius); x++) {
          const distance = Math.sqrt(Math.pow(gridX - x, 2) + Math.pow(gridY - y, 2));
          if (distance <= radius) {
            const factor = Math.exp(-(distance * distance) / (2 * (radius/3) * (radius/3)));
            grid[y][x] += intensity * factor;
          }
        }
      }
    }
  });
  
  let maxGridValue = 0;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      maxGridValue = Math.max(maxGridValue, grid[y][x]);
    }
  }
  
  const targetMaxValue = HEATMAP_GRID_CONFIG.POLLUTION_DATA_MAX;
  
  if (maxGridValue > targetMaxValue) {
    const scaleFactor = targetMaxValue / maxGridValue;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        grid[y][x] *= scaleFactor;
      }
    }
    maxGridValue = targetMaxValue;
  }
  
  const normalizeForColor = (value: number): number => {
    return value / targetMaxValue;
  };
  
  const colorMapCanvas = document.createElement('canvas');
  colorMapCanvas.width = 256;
  colorMapCanvas.height = 1;
  const colorMapCtx = colorMapCanvas.getContext('2d')!;
  const colorGradient = colorMapCtx.createLinearGradient(0, 0, 256, 0);
  
  colorGradient.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
  colorGradient.addColorStop(0.2, 'rgba(0, 0, 255, 0.1)');
  colorGradient.addColorStop(0.4, 'rgba(0, 255, 255, 0.4)');
  colorGradient.addColorStop(0.6, 'rgba(0, 255, 0, 0.6)');
  colorGradient.addColorStop(0.8, 'rgba(255, 255, 0, 0.8)');
  colorGradient.addColorStop(1.0, 'rgba(255, 0, 0, 1.0)');
  
  colorMapCtx.fillStyle = colorGradient;
  colorMapCtx.fillRect(0, 0, 256, 1);
  const colorMapData = colorMapCtx.getImageData(0, 0, 256, 1).data;
  
  const imageData = ctx.createImageData(canvasSize, canvasSize);
  
  const transformValue = (value: number): number => {
    if (value === 0) return 0;
    const normalizedValue = normalizeForColor(value);
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
              
              const alphaBase = colorMapData[colorIndex + 3];
              const alphaScale = Math.min(1.0, transformedValue * 4);
              let alphaValue = Math.floor(alphaBase * alphaScale);
              
              if (transformedValue < valueThreshold * 2) {
                alphaValue = Math.floor(alphaValue * 0.5);
              }
              
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
  
  const dataPoints = options.customData || getHeatmapDataPointsByHeight(heightLevel);
  
  if (dataPoints.length === 0) {
    console.warn(`경고: 2D 히트맵 생성을 위한 데이터가 없습니다. (고도: ${heightLevel}m)`);
  }
  
  const canvas = createHeatmapImage(dataPoints, heatmapOptions);
  
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