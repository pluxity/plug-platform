import { TANCHEON_LOCATION } from '@/constants/initialization';

/**
 * 오염도 데이터 포인트 인터페이스
 */
export interface ContaminationPoint {
  longitude: number;     // 경도
  latitude: number;      // 위도
  value: number;         // 오염도 값 (0-100)
  height: number;        // 고도 (미터)
}

/**
 * 탄천 주변 오염도 데이터 생성
 * 
 * 오염도 값 범위: 0-100
 * - 0: 오염 없음
 * - 25: 낮은 오염도
 * - 50: 중간 오염도
 * - 75: 높은 오염도
 * - 100: 매우 높은 오염도
 * 
 * 고도 범위: 10-500m
 */

// 탄천 위치를 중심으로 데이터 생성
const CENTER_LONGITUDE = TANCHEON_LOCATION.longitude;
const CENTER_LATITUDE = TANCHEON_LOCATION.latitude;

// 사용할 고도 레벨 (미터)
const HEIGHT_LEVELS = [10, 30, 50, 100, 150, 200, 300, 400, 500];

// 오염도 데이터 생성 함수
const generate3DContaminationData = (): ContaminationPoint[] => {
  const points: ContaminationPoint[] = [];
  
  // 각 고도 레벨에 대한 오염도 데이터 생성
  HEIGHT_LEVELS.forEach(heightLevel => {
    // 고도별 오염도 패턴 (예: 고도가 높을수록 오염도 감소 또는 특정 고도에서 오염도 집중)
    const heightFactor = Math.pow(Math.max(0.1, 1 - (heightLevel / 600)), 2); // 고도가 높을수록 오염도 감소
    
    // 고도 레벨에 대한 중심점 (각 고도별 핵심 오염원)
    points.push({
      longitude: CENTER_LONGITUDE,
      latitude: CENTER_LATITUDE,
      value: Math.round(95 * heightFactor), // 고도에 따라 오염도 조정
      height: heightLevel
    });
    
    // 각 고도별 데이터 포인트 수
    const pointsPerHeight = Math.floor(50 * (1 - heightLevel / 600)); // 고도가 높을수록 포인트 수 감소
    
    // 중심에서 랜덤한 방향과 거리에 포인트 추가
    for (let i = 0; i < pointsPerHeight; i++) {
      // 랜덤 각도 (0-360도)
      const angle = Math.random() * Math.PI * 2;
      
      // 랜덤 거리 (최대 약 1km, 지리좌표 단위로 약 0.01)
      // 거리 분포를 자연스럽게 하기 위해 제곱근 사용
      const distance = 0.01 * Math.sqrt(Math.random());
      
      // 위도/경도 계산
      const longitude = CENTER_LONGITUDE + distance * Math.cos(angle);
      const latitude = CENTER_LATITUDE + distance * Math.sin(angle);
      
      // 중심에서 거리에 따라 오염도 감소 (거리 비례하여 감소)
      const distanceRatio = distance / 0.01;  // 0~1 범위로 정규화
      const baseValue = 95 * heightFactor - (90 * distanceRatio * heightFactor);  // 고도와 거리에 기반한 감소
      
      // 약간의 랜덤성 추가
      const randomFactor = (Math.random() * 20) - 10;
      
      // 최종 오염도 값 (0-100 범위 내로 제한)
      const value = Math.min(100, Math.max(0, baseValue + randomFactor));
      
      points.push({
        longitude,
        latitude,
        value: Math.round(value),  // 소수점 제거
        height: heightLevel
      });
    }
    
    // 각 고도별 핫스팟 추가
    if (heightLevel < 300) { // 300m 이하의 고도에만 핫스팟 추가
      // 고도별로 다른 위치에 핫스팟 배치
      const offsetX = 0.003 + (heightLevel / 5000); 
      const offsetY = 0.002 - (heightLevel / 6000);
      const intensity = 85 * heightFactor;
      
      const hotspotLong = CENTER_LONGITUDE + offsetX;
      const hotspotLat = CENTER_LATITUDE + offsetY;
      
      // 핫스팟 중심
      points.push({
        longitude: hotspotLong,
        latitude: hotspotLat,
        value: Math.round(intensity),
        height: heightLevel
      });
      
      // 핫스팟 주변
      const surroundingDistance = 0.0005; // 약 50m
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        points.push({
          longitude: hotspotLong + surroundingDistance * Math.cos(angle),
          latitude: hotspotLat + surroundingDistance * Math.sin(angle),
          value: Math.round(intensity * 0.8),  // 중심보다 약간 낮은 오염도
          height: heightLevel
        });
      }
      
      // 고도별 두 번째 핫스팟 (다른 방향에 배치)
      if (heightLevel % 100 === 0) { // 100m 간격으로만 두 번째 핫스팟 배치
        const offsetX2 = -0.004 - (heightLevel / 8000);
        const offsetY2 = -0.003 + (heightLevel / 7000);
        const intensity2 = 92 * heightFactor;
        
        const hotspotLong2 = CENTER_LONGITUDE + offsetX2;
        const hotspotLat2 = CENTER_LATITUDE + offsetY2;
        
        points.push({
          longitude: hotspotLong2,
          latitude: hotspotLat2,
          value: Math.round(intensity2),
          height: heightLevel
        });
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
          points.push({
            longitude: hotspotLong2 + surroundingDistance * Math.cos(angle),
            latitude: hotspotLat2 + surroundingDistance * Math.sin(angle),
            value: Math.round(intensity2 * 0.8),
            height: heightLevel
          });
        }
      }
    }
  });
  
  // 고도별 랜덤 저오염 지역
  for (let h = 0; h < HEIGHT_LEVELS.length; h++) {
    const heightLevel = HEIGHT_LEVELS[h];
    const heightFactor = Math.max(0.2, 1 - (heightLevel / 500)); // 고도 별 스케일링 팩터
    
    for (let i = 0; i < 5; i++) { // 각 고도별 5개의 저오염 지역
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.003 + (Math.random() * 0.007); // 300m ~ 1km
      
      const longitude = CENTER_LONGITUDE + distance * Math.cos(angle);
      const latitude = CENTER_LATITUDE + distance * Math.sin(angle);
      
      points.push({
        longitude,
        latitude,
        value: 5 + Math.random() * 15 * heightFactor, // 고도에 따라 감소하는 낮은 오염도
        height: heightLevel
      });
    }
  }
  
  return points;
};

/**
 * 탄천 주변 3D 오염도 데이터
 * 다양한 고도에서의 오염도 값을 포함
 */
export const CONTAMINATION_DATA: ContaminationPoint[] = generate3DContaminationData(); 