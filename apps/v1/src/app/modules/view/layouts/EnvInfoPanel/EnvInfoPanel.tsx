import React, { useState, useEffect } from 'react';
import { useStationEnv } from '../../../../api/hooks/nflux';

interface EnvInfoPanelProps {
  stationId: string;
}

// 타입 정의
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

const EnvInfoPanel: React.FC<EnvInfoPanelProps> = ({ stationId }) => {
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
    // 첫 로드 후 10초마다 데이터 새로고침
    const interval = setInterval(() => {
      refetch();
    }, 10 * 1000);
    
    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="w-[300px] bg-primary-400/20 rounded-[5px] backdrop-blur-[5px] p-4">
      <h2 className="text-white text-lg font-bold mb-4">역사 환경 정보</h2>
      
      <div className="mb-4">
        <h3 className="text-white text-base font-semibold mb-2">온도</h3>
        <div className="grid grid-cols-3 gap-2">          <div className="bg-primary-600/30 rounded p-2">
            <div className="text-white text-xs">대합실</div>            <div className="text-white text-lg font-bold">
              {`${displayData.temperature.watingRoom}${typeof displayData.temperature.watingRoom === 'number' ? '°C' : ''}`}
            </div>
          </div>          <div className="bg-primary-600/30 rounded p-2">
            <div className="text-white text-xs">승강장</div>
            <div className="text-white text-lg font-bold">
              {`${displayData.temperature.platform}${typeof displayData.temperature.platform === 'number' ? '°C' : ''}`}
            </div>
          </div>          <div className="bg-primary-600/30 rounded p-2">
            <div className="text-white text-xs">외부</div>
            <div className="text-white text-lg font-bold">
              {`${displayData.temperature.external}${typeof displayData.temperature.external === 'number' ? '°C' : ''}`}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-white text-base font-semibold mb-2">공기질</h3>
        <div className="bg-primary-600/30 rounded p-2">          <div className="text-white text-xs">초미세먼지(PM2.5)</div>
          <div className="text-white text-lg font-bold">
            {`${displayData.airQuality.ultrafineDust}${typeof displayData.airQuality.ultrafineDust === 'number' ? ' ㎍/㎥' : ''}`}
          </div>
          {typeof displayData.airQuality.ultrafineDust === 'number' && (
            <div className="text-white text-xs mt-1">
              {getAirQualityStatus(displayData.airQuality.ultrafineDust)}
            </div>
          )}
          {error && (
            <div className="text-red-500 text-xs mt-1">데이터 로드 오류</div>
          )}
        </div>
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

export default EnvInfoPanel;
