import React from 'react';
import { useStationEnv } from '../../../../api/hooks/nflux';

interface HeaderEnvInfoProps {
  stationId: string;
}

const HeaderEnvInfo: React.FC<HeaderEnvInfoProps> = ({ stationId }) => {
  const { data, loading, error } = useStationEnv(stationId);

  if (loading) {
    return (
      <div className="bg-primary-500/30 rounded-[5px] px-3 py-1 flex items-center justify-center">
        <div className="text-white text-sm">로딩 중...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-primary-500/30 rounded-[5px] px-3 py-1 flex items-center justify-center">
        <div className="text-red-300 text-sm">데이터 로드 오류</div>
      </div>
    );
  }
  return (
    <div className="bg-primary-500/30 rounded-[5px] px-3 py-1 flex items-center gap-4">
      <div className="flex items-center gap-1">
        <span className="text-white text-xs">대합실:</span>
        <div className="flex items-center">
          <img 
            src="/assets/station/temp.svg" 
            alt="온도" 
            width={14} 
            height={18} 
            className="mr-1"
          />
          <span className="text-white text-sm font-bold">{data.temperature.watingRoom}°C</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-white text-xs">승강장:</span>
        <div className="flex items-center">
          <img 
            src="/assets/station/temp.svg" 
            alt="온도" 
            width={14} 
            height={18} 
            className="mr-1"
          />
          <span className="text-white text-sm font-bold">{data.temperature.platform}°C</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-white text-xs">외부:</span>
        <div className="flex items-center">
          <img 
            src="/assets/station/temp.svg" 
            alt="온도" 
            width={14} 
            height={18} 
            className="mr-1"
          />
          <span className="text-white text-sm font-bold">{data.temperature.external}°C</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-white text-xs">초미세먼지:</span>
        <span className="text-white text-sm font-bold">{data.airQuality.ultrafineDust} ㎍/㎥</span>
        <span className="text-xs text-white">
          ({getAirQualityStatus(data.airQuality.ultrafineDust)})
        </span>
      </div>
    </div>
  );
};

// 공기질 상태 반환 함수
const getAirQualityStatus = (value: number): string => {
  if (value <= 15) return '좋음';
  if (value <= 35) return '보통';
  if (value <= 75) return '나쁨';
  return '매우 나쁨';
};

export default HeaderEnvInfo;
