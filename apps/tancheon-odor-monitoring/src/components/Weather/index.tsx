import { useEffect, useState } from 'react';
import Image from 'next/image';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  windSpeed: number;
  windDeg: number;
}

const getWindDirection = (deg: number): string => {
  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};


const WindDirectionIcon = ({ deg }: { deg: number }) => {
  return (
    <div className="relative inline-block">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transform"
        style={{ transform: `rotate(${deg}deg)` }}
      >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </div>
  );
};

export const WeatherDisplay = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);
    try {

      const lat = 37.5139;
      const lon = 127.0599;
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '6d730b0224c411d1832362c66c083e91';
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
      );
      
      if (!response.ok) {
        throw new Error('날씨 정보를 가져오는데 실패했습니다.');
      }
      
      const data = await response.json();
      
      setWeather({
        temp: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg
      });

    } catch (err) {
      console.error('날씨 정보 가져오기 오류:', err);
      setError('날씨 정보를 가져오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 날씨 정보 가져오기
  useEffect(() => {
    fetchWeather();
    
    // 10분마다 날씨 정보 업데이트
    const weatherInterval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => {
      clearInterval(weatherInterval);
    };
  }, []);

  const handleRefreshWeather = () => {
    fetchWeather();
  };

  return (
    <div className="flex items-center">
      <div className="bg-gray-700 p-2 rounded-md">
        {isLoading ? (
          <div className="text-sm">날씨 정보 로딩 중...</div>
        ) : error ? (
          <div className="text-sm text-red-300">{error}</div>
        ) : weather ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Image 
                src={`https://openweathermap.org/img/wn/${weather.icon}.png`} 
                alt={weather.description}
                width={40}
                height={40}
              />
              <div className="ml-1">
                <div className="text-sm font-medium">{Math.round(weather.temp)}°C</div>
                <div className="text-xs">{weather.description}</div>
              </div>
            </div>
            
            <div className="border-l border-gray-500 pl-3">
              <div className="text-xs flex items-center">
                <span className="mr-1">풍속:</span>
                <span>{weather.windSpeed} m/s</span>
              </div>
              <div className="text-xs flex items-center">
                <span className="mr-1">풍향:</span>
                <WindDirectionIcon deg={weather.windDeg} />
                <span className="ml-1">{getWindDirection(weather.windDeg)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleRefreshWeather}
              className="text-gray-300 hover:text-white p-1"
              title="날씨 정보 새로고침"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};