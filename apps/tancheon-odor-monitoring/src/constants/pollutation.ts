import { TANCHEON_LOCATION } from '@/constants/initialization';
import { PollutionPoint } from '@/types/pollution';


export const POLLUTION_DATA: PollutionPoint[] = (() => {
    const data: PollutionPoint[] = [];
    const centerLon = TANCHEON_LOCATION.longitude;
    const centerLat = TANCHEON_LOCATION.latitude;
    
    data.push({ longitude: centerLon, latitude: centerLat, value: 0.95 });
    
    const pointCount = 40; // 총 포인트 수
    
    for (let i = 0; i < pointCount; i++) {
      let angle = Math.PI * (Math.random() * 0.5);

      const distanceRandom = Math.pow(Math.random(), 0.5); // 제곱근으로 분포 조정
      const distance = 0.0005 + distanceRandom * 0.002; // 50m~250m
      
      const directionFactor = (Math.cos(angle) + 1) / 2; // 서쪽(180도)에서 최대, 동쪽(0도)에서 최소
      const distanceFactor = 1 - (distance - 0.0005) / 0.002; // 거리가 가까울수록 높은 값
      
      const value = 0.3 + 0.65 * directionFactor * distanceFactor;      
      
      const lon = centerLon + (distance * Math.cos(angle));
      const lat = centerLat + (distance * Math.sin(angle));
      
      data.push({
        longitude: lon,
        latitude: lat,
        value: value
      });
    }
    
    return data;
  })();