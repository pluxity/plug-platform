import { TANCHEON_LOCATION } from '@/constants/initialization';
import { PollutionPoint } from '@/types/pollution';


export const POLLUTION_DATA: PollutionPoint[] = (() => {
    const data: PollutionPoint[] = [];
    const centerLon = TANCHEON_LOCATION.longitude;
    const centerLat = TANCHEON_LOCATION.latitude;
    
    data.push({ longitude: centerLon, latitude: centerLat, value: 0.95 });
    
    const pointCount = 40;
    
    for (let i = 0; i < pointCount; i++) {
      let angle = Math.PI * (Math.random() * 0.5);

      const distanceRandom = Math.pow(Math.random(), 0.5);
      const distance = 0.0005 + distanceRandom * 0.002;
      
      const directionFactor = (Math.cos(angle) + 1) / 2;
      const distanceFactor = 1 - (distance - 0.0005) / 0.002;
      
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