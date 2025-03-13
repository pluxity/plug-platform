import { TANCHEON_LOCATION, HEATMAP_GRID_CONFIG } from '@/constants/initialization';
import { PollutionPoint } from '@/types/pollution';

// 탄천 위치를 중심으로 데이터 생성
const CENTER_LONGITUDE = TANCHEON_LOCATION.longitude;
const CENTER_LATITUDE = TANCHEON_LOCATION.latitude;

// 사용할 고도 레벨 (미터)
// const HEIGHT_LEVELS = [30, 40, 50, 60, 70, 80, 90];
const HEIGHT_LEVELS = [30];

const generate3DPollutionData = (): PollutionPoint[] => {
  const points: PollutionPoint[] = [];
  
  HEIGHT_LEVELS.forEach(heightLevel => {
    const heightFactor = Math.pow(Math.max(0.1, 1 - (heightLevel / 600)), 2); // 고도가 높을수록 오염도 감소
    
    points.push({
      longitude: CENTER_LONGITUDE,
      latitude: CENTER_LATITUDE,
      value: 0.95 * heightFactor, // 고도에 따라 오염도 조정
      height: heightLevel
    });
    
    const pointsPerHeight = Math.floor(40 * (1 - heightLevel / 600)); // 고도가 높을수록 포인트 수 감소
    
    for (let i = 0; i < pointsPerHeight; i++) {
      const angle = Math.random() * Math.PI * 2;
      
      const distance = 0.01 * Math.sqrt(Math.random());
      
      const longitude = CENTER_LONGITUDE + distance * Math.cos(angle);
      const latitude = CENTER_LATITUDE + distance * Math.sin(angle);
      
      const distanceRatio = distance / 0.01;  // 0~1 범위로 정규화
      const baseValue = 0.95 * heightFactor - (0.9 * distanceRatio * heightFactor);  // 고도와 거리에 기반한 감소
      
      const randomFactor = (Math.random() * 0.2) - 0.1;  // -0.1 ~ +0.1
      
      const value = Math.min(1, Math.max(0, baseValue + randomFactor));
      
      points.push({
        longitude,
        latitude,
        value,
        height: heightLevel
      });
    }
  });
  
  return points;
};

const generateGridPollutionData = (): PollutionPoint[] => {
  const points: PollutionPoint[] = [];
  
  // 격자 경계 및 세분화 설정 가져오기
  const { WEST, SOUTH, EAST, NORTH, SEGMENTS } = HEATMAP_GRID_CONFIG;
  
  // 격자 셀 간격 계산
  const cellStep = 2; // 성능을 위해 격자 간격 조절
  const longitudeStep = (EAST - WEST) / SEGMENTS;
  const latitudeStep = (NORTH - SOUTH) / SEGMENTS;
  
  // 패턴 생성용 함수
  const createPatternValue = (x: number, y: number, height: number): number => {
    // 중심에서의 거리 계산
    const longitude = WEST + x * longitudeStep;
    const latitude = SOUTH + y * latitudeStep;
    const distX = (longitude - CENTER_LONGITUDE) / (EAST - WEST) * 5;
    const distY = (latitude - CENTER_LATITUDE) / (NORTH - SOUTH) * 5;
    const dist = Math.sqrt(distX * distX + distY * distY);
    
    // 거리에 따른 감쇠 (가우시안)
    const distanceFactor = Math.exp(-dist * dist / 2.0);
    
    // 고도에 따른 감쇠
    const heightFactor = Math.pow(Math.max(0.1, 1 - (height / 600)), 2);
    
    // 간단한 패턴 추가 (사인 웨이브)
    const pattern = 0.2 * (
      Math.sin(x / 5) * Math.cos(y / 5) + 
      Math.sin(y / 7) * Math.cos(x / 7)
    );
    
    // 최종 값 계산
    let value = (0.7 * distanceFactor + 0.3 * pattern) * heightFactor;
    
    // 0-1 범위로 제한
    value = Math.min(1, Math.max(0.01, value));
    
    return value;
  };
  
  // 각 고도별로 격자 데이터 생성
  HEIGHT_LEVELS.forEach(heightLevel => {
    
    // 모든 격자 셀에 데이터 생성
    for (let y = 0; y <= SEGMENTS; y += cellStep) {
      for (let x = 0; x <= SEGMENTS; x += cellStep) {
        // 격자 좌표 계산 (약간의 무작위성 추가)
        const jitter = longitudeStep * 0.1 * (Math.random() - 0.5);
        const longitude = WEST + (x * longitudeStep) + jitter;
        const latitude = SOUTH + (y * latitudeStep) + jitter;
        
        // 해당 위치에 대한 패턴 값 계산
        let value = createPatternValue(x, y, heightLevel);
        
        // 랜덤 노이즈 추가 (자연스러움 증가)
        const randomFactor = (Math.random() * 0.1) - 0.05;
        value = Math.min(1, Math.max(0.01, value + randomFactor));
        
        points.push({
          longitude,
          latitude,
          value,
          height: heightLevel // 고도 레벨을 정확히 사용
        });
      }
    }
  });
  
  console.log(`생성된 총 데이터 포인트 수: ${points.length}`);
  return points;
};

/**
 * 탄천 주변 3D 오염도 데이터
 * 다양한 고도에서의 오염도 값을 포함
 * 모든 격자 셀에 데이터 포인트가 있음
 */
export const POLLUTION_DATA: PollutionPoint[] = generateGridPollutionData();