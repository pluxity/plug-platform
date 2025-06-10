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
    <div className="flex items-center gap-3 !bg-primary-900/5 rounded-lg px-4 py-1.5 border border-gray-300/10 backdrop-blur-sm hover:bg-primary-300/15 transition-colors">
      <div className="flex items-center gap-6">
        {[
          { label: '대합실', value: displayData.temperature.watingRoom },
          { label: '승강장', value: displayData.temperature.platform },
          { label: '외부', value: displayData.temperature.external },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2 border-r border-gray-500/50 last:border-r-0 pr-6 last:pr-0"
          >
            <span className="text-gray-200 text-sm font-medium tracking-wide">{label}</span>
            <div className="flex items-center gap-1.5">
              <img
                src="/assets/station/temp.svg"
                alt="온도"
                width={14}
                height={18}
                className="brightness-0 invert opacity-80"
              />
              <span className="text-white text-sm font-medium tracking-wide tabular-nums">
                {`${value}${typeof value === 'number' ? '°C' : ''}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="w-px h-4 bg-gray-600/80" />

      <div className="flex items-center gap-2">
        <span className="text-gray-200 text-sm font-medium tracking-wide">초미세먼지</span>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium tracking-wide tabular-nums">
            {`${displayData.airQuality.ultrafineDust}${typeof displayData.airQuality.ultrafineDust === 'number' ? ' ㎍/㎥' : ''}`}
          </span>
          {typeof displayData.airQuality.ultrafineDust === 'number' && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAirQualityStatusColor(displayData.airQuality.ultrafineDust)}`}
            >
              {getAirQualityStatus(displayData.airQuality.ultrafineDust)}
            </span>
          )}
        </div>
        {error && !loading && (
          <span className="text-red-400 text-xs font-medium">(오류)</span>
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

const getAirQualityStatusColor = (value: number): string => {
  if (value <= 15) return 'bg-green-500/15 text-green-300 border border-green-500/20';
  if (value <= 35) return 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/20';
  if (value <= 75) return 'bg-orange-500/15 text-orange-300 border border-orange-500/20';
  return 'bg-red-500/15 text-red-300 border border-red-500/20';
};

export default HeaderEnvInfo;
