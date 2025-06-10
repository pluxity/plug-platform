import React, { useState, useEffect } from 'react';
import { useStationEnv } from '@plug/v1/app/api/hooks/nflux';

interface HeaderEnvInfoProps {
  stationId: string;
}

interface EnvDisplayData {
  temperature: {
    watingRoom: number | string;
    platform: number | string;
    external: number | string;
  };
  airQuality: {
    ultrafineDust: number | string;
  };
}

const HeaderEnvInfo: React.FC<HeaderEnvInfoProps> = ({ stationId }) => {
  const { data, loading, error, refetch } = useStationEnv(stationId);
  
  // 기본 데이터 설정
  const defaultData: EnvDisplayData = {
    temperature: {
      watingRoom: '-',
      platform: '-',
      external: '-'
    },
    airQuality: {
      ultrafineDust: '-'
    }
  };
    // 이전 상태를 유지하기 위한 상태 관리
  const [displayData, setDisplayData] = useState<EnvDisplayData>(defaultData);

  // 데이터가 변경될 때만 상태 업데이트
  useEffect(() => {
    if (data && !loading) {
      // 서버 데이터를 displayData 형식에 맞게 변환
      const formattedData: EnvDisplayData = {
        temperature: {
          watingRoom: data.temperature.watingRoom,
          platform: data.temperature.platform,
          external: data.temperature.external
        },
        airQuality: {
          ultrafineDust: data.airQuality.ultrafineDust
        }
      };
      setDisplayData(formattedData);
    }
  }, [data, loading]);
  
  // 10초마다 데이터 새로고침
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10 * 1000);
    
    return () => clearInterval(interval);
  }, [refetch]);
  return (
    <div className="flex items-center gap-4">
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
          <span className="text-white text-sm font-bold">
            {`${displayData.temperature.watingRoom}${typeof displayData.temperature.watingRoom === 'number' ? '°C' : ''}`}
          </span>
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
          <span className="text-white text-sm font-bold">
            {`${displayData.temperature.platform}${typeof displayData.temperature.platform === 'number' ? '°C' : ''}`}
          </span>
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
          <span className="text-white text-sm font-bold">
            {`${displayData.temperature.external}${typeof displayData.temperature.external === 'number' ? '°C' : ''}`}
          </span>
        </div>
      </div>      <div className="flex items-center gap-1">
        <span className="text-white text-xs">초미세먼지:</span>
        <span className="text-white text-sm font-bold">
          {`${displayData.airQuality.ultrafineDust}${typeof displayData.airQuality.ultrafineDust === 'number' ? ' ㎍/㎥' : ''}`}
        </span>
        {typeof displayData.airQuality.ultrafineDust === 'number' && (
          <span className="text-xs text-white">
            ({getAirQualityStatus(displayData.airQuality.ultrafineDust)})
          </span>
        )}
        {error && !loading && (
          <span className="text-xs text-red-300 ml-1">(오류)</span>
        )}
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
