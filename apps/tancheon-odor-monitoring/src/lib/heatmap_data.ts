import { TANCHEON_LOCATION, HEATMAP_GRID_CONFIG } from '@/constants/initialization';

/**
 * 히트맵 데이터 포인트 인터페이스
 */
export interface HeatmapDataPoint {
  longitude: number;   // 경도
  latitude: number;    // 위도
  value: number;       // 값 (0-100 범위)
  height: number;      // 고도 (미터)
}

/**
 * 3D 격자 셀 인터페이스
 */
export interface GridCell {
  x: number;           // 격자 X 인덱스
  y: number;           // 격자 Y 인덱스
  z: number;           // 격자 Z 인덱스(고도 레벨)
  longitude: number;   // 중심 경도
  latitude: number;    // 중심 위도
  height: number;      // 고도 (미터)
  value: number;       // 값 (0-100 범위)
}

/**
 * 히트맵 데이터 클래스
 * - 3D 격자 기반 데이터 생성 및 처리
 */
export class HeatmapData {
  // 격자 경계
  private west: number;
  private east: number;
  private south: number;
  private north: number;
  
  // 격자 설정
  private segments: number;
  private heightLevels: number[];
  
  // 격자 간격
  private longitudeStep: number;
  private latitudeStep: number;
  
  // 중심 위치
  private centerLongitude: number;
  private centerLatitude: number;
  
  // 생성된 데이터
  private gridCells: GridCell[] = [];
  private dataPoints: HeatmapDataPoint[] = [];
  
  // 최대/최소값
  private maxValue: number = 0;
  private minValue: number = 100;
  
  /**
   * 히트맵 데이터 초기화
   * @param heightLevels 고도 레벨 배열 (미터)
   */
  constructor(heightLevels: number[] = [30, 40, 50, 60, 70, 80, 90]) {
    // HEATMAP_GRID_CONFIG에서 격자 경계 및 설정 가져오기
    this.west = HEATMAP_GRID_CONFIG.WEST;
    this.east = HEATMAP_GRID_CONFIG.EAST;
    this.south = HEATMAP_GRID_CONFIG.SOUTH;
    this.north = HEATMAP_GRID_CONFIG.NORTH;
    this.segments = HEATMAP_GRID_CONFIG.SEGMENTS;
    
    this.longitudeStep = (this.east - this.west) / this.segments;
    this.latitudeStep = (this.north - this.south) / this.segments;
    
   // 중심 위치 설정
    this.centerLongitude = TANCHEON_LOCATION.longitude;
    this.centerLatitude = TANCHEON_LOCATION.latitude;
    
    // 고도 레벨 설정 (90m 이하로 제한)
    this.heightLevels = heightLevels.filter(h => h <= 90);
    
    // 3D 격자 생성
    this.generateGridData();
  }
  
  /**
   * 3D 격자 데이터 생성
   */
  private generateGridData(): void {
    // 최대 거리 계산 (정규화를 위해)
    const maxDistance = Math.sqrt(
      Math.pow((this.east - this.west) / 2, 2) + 
      Math.pow((this.north - this.south) / 2, 2)
    );
    
    // 각 고도별로 처리
    this.heightLevels.forEach((height, zIndex) => {
      const heightRatio = Math.max(0.3, Math.pow(1 - (height - this.heightLevels[0]) / 300, 1.5));
      const maxHeightValue = 100 * heightRatio;
      
      const heightDistanceDecayFactor = 0.7 + Math.pow((height - this.heightLevels[0]) / 100, 0.8);
      
      // 격자 순회
      for (let y = 0; y <= this.segments; y++) {
        for (let x = 0; x <= this.segments; x++) {
          // 격자 셀의 위경도 계산
          const longitude = this.west + (x * this.longitudeStep);
          const latitude = this.south + (y * this.latitudeStep);
          
          // 중심으로부터의 거리 계산
          const distX = longitude - this.centerLongitude;
          const distY = latitude - this.centerLatitude;
          const distance = Math.sqrt(distX * distX + distY * distY);
          
          // 거리를 0~1 범위로 정규화
          const normalizedDistance = distance / maxDistance;
          
          // 거리에 따른 감쇠 계산 (가우시안 - 감쇠 정도를 줄임)
          const distanceFactor = Math.exp(-Math.pow(normalizedDistance * heightDistanceDecayFactor, 2) * 3);
          
          // 값 계산 (거리와 고도에 따라 감소)
          let value = maxHeightValue * distanceFactor;
          
          // 노이즈 추가
          const noiseRange = 5 + (height / 50);
          const noise = (Math.random() * noiseRange * 2) - noiseRange;
          
          // 기본 최소값 보장 (최소값을 높여서 비어 보이는 격자가 없도록)
          const baseMinValue = Math.max(10, 30 - (height / 10));
          value = Math.max(baseMinValue, Math.min(100, value + noise));
          
          // 최대/최소값 업데이트
          this.maxValue = Math.max(this.maxValue, value);
          this.minValue = Math.min(this.minValue, value);
          
          // 격자 셀 생성
          const cell: GridCell = {
            x, y, z: zIndex,
            longitude, latitude, height,
            value
          };
          
          // 데이터 포인트 생성
          const dataPoint: HeatmapDataPoint = {
            longitude, latitude,
            value, height
          };
          
          // 배열에 추가
          this.gridCells.push(cell);
          this.dataPoints.push(dataPoint);
        }
      }
      
      // 로그 출력
      console.log(`고도 ${height}m 그리드 생성 완료, 최대값: ${maxHeightValue.toFixed(1)}`);
    });
    
    console.log(`히트맵 데이터 생성 완료: ${this.gridCells.length}개 격자 셀`);
    console.log(`데이터 값 범위: ${this.minValue.toFixed(1)} ~ ${this.maxValue.toFixed(1)}`);
  }
  
  /**
   * 모든 데이터 포인트 반환
   */
  public getAllDataPoints(): HeatmapDataPoint[] {
    return this.dataPoints;
  }
  
  /**
   * 특정 고도의 데이터 포인트만 반환
   */
  public getDataPointsByHeight(height: number): HeatmapDataPoint[] {
    return this.dataPoints.filter(point => point.height === height);
  }
  
  /**
   * 모든 격자 셀 반환
   */
  public getAllGridCells(): GridCell[] {
    return this.gridCells;
  }
  
  /**
   * 특정 고도의 격자 셀만 반환
   */
  public getGridCellsByHeight(height: number): GridCell[] {
    return this.gridCells.filter(cell => cell.height === height);
  }
  
  /**
   * 모든 고도 레벨 배열 반환
   */
  public getHeightLevels(): number[] {
    return this.heightLevels;
  }
  
  /**
   * 데이터의 최대값 반환
   */
  public getMaxValue(): number {
    return this.maxValue;
  }
  
  /**
   * 데이터의 최소값 반환
   */
  public getMinValue(): number {
    return this.minValue;
  }
  
  /**
   * 특정 위경도 범위 내의 데이터 반환
   */
  public getDataInBounds(
    west: number, south: number, 
    east: number, north: number
  ): HeatmapDataPoint[] {
    return this.dataPoints.filter(point => 
      point.longitude >= west && point.longitude <= east &&
      point.latitude >= south && point.latitude <= north
    );
  }
}

// 싱글톤 인스턴스 생성
export const heatmapData = new HeatmapData();

// 기본 데이터 포인트 반환 함수
export function getHeatmapDataPoints(): HeatmapDataPoint[] {
  return heatmapData.getAllDataPoints();
}

// 기본 고도 레벨 반환 함수
export function getHeightLevels(): number[] {
  return heatmapData.getHeightLevels();
}

// 특정 고도의 데이터 포인트 반환 함수
export function getHeatmapDataPointsByHeight(height: number): HeatmapDataPoint[] {
  return heatmapData.getDataPointsByHeight(height);
} 