import { TANCHEON_LOCATION } from '@/constants/initialization';
import { PollutionPoint } from '@/types/pollution';

export const POLLUTION_DATA: PollutionPoint[] = (() => {
  const data: PollutionPoint[] = [];
  const centerLon = TANCHEON_LOCATION.longitude;
  const centerLat = TANCHEON_LOCATION.latitude;
  
  data.push({ 
    longitude: centerLon, 
    latitude: centerLat, 
    value: 1.0 
  });
  
  const totalPoints = 800;

  const maxRadius = 0.015; 
  
  for (let i = 0; i < totalPoints; i++) {
    const angle = Math.random() * Math.PI * 2;
    
    // 균일한 밀도 분포를 위해 제곱근 적용
    // 원 면적에 비례하는 균일 분포를 위한 수학적 보정
    const distanceFactor = Math.sqrt(Math.random());
    const randomFactor = 0.85 + Math.random() * 0.3;

    const distance = maxRadius * distanceFactor;
    
    const lon = centerLon + (distance * Math.cos(angle));
    const lat = centerLat + (distance * Math.sin(angle));
    
    const baseValue = 1.0 - 0.9 * distanceFactor;

    const value = Math.min(1.0, Math.max(0.1, baseValue * randomFactor));
    
    data.push({
      longitude: lon,
      latitude: lat,
      value: value
    });
  }
  
  return data;
})();