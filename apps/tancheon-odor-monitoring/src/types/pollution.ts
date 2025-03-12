/**
 * 오염 지점 데이터를 나타내는 인터페이스
 * 위도, 경도 및 오염 값을 포함합니다.
 */
export interface PollutionPoint {
  /**
   * 경도 좌표값
   */
  longitude: number;
  
  /**
   * 위도 좌표값
   */
  latitude: number;
  
  /**
   * 오염도 값 (0.0 ~ 1.0 사이의 값)
   * 0은 오염이 없음, 1은 최대 오염을 나타냄
   */
  value: number;
  
  /**
   * 고도 (미터 단위, 선택적)
   */
  altitude?: number;
  
  /**
   * 타임스탬프 (ISO 문자열 형식, 선택적)
   */
  timestamp?: string;
  
  /**
   * 데이터 소스 또는 센서 ID (선택적)
   */
  source?: string;
}

/**
 * 다양한 고도에서의 오염 데이터 맵
 */
export interface HeightHeatmaps {
  /**
   * 30미터 고도의 오염 데이터
   */
  '30m': PollutionPoint[];
  
  /**
   * 60미터 고도의 오염 데이터
   */
  '60m': PollutionPoint[];
  
  /**
   * 90미터 고도의 오염 데이터
   */
  '90m': PollutionPoint[];
  
  /**
   * 추가 고도를 위한 인덱스 시그니처
   */
  [height: string]: PollutionPoint[];
}

/**
 * 각 고도별 히트맵 표시 여부를 나타내는 인터페이스
 */
export interface VisibleHeatmaps {
  '30m': boolean;
  '60m': boolean;
  '90m': boolean;
  
  /**
   * 추가 고도를 위한 인덱스 시그니처
   */
  [height: string]: boolean;
} 