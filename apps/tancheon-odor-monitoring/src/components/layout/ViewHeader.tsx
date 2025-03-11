'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import UserIcon from '@plug/ui/src/assets/icons/user.svg';
import { useRouter } from 'next/navigation';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  windSpeed: number;
  windDeg: number;
}

/**
 * 풍향을 계산하는 함수
 * @param deg 풍향 각도
 * @returns 풍향 문자열
 */
const getWindDirection = (deg: number): string => {
  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

/**
 * 풍향 아이콘 컴포넌트
 */
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

// 클라이언트 사이드에서만 렌더링할 시간 컴포넌트
const TimeDisplay = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // 1초마다 현재 시간 업데이트
    const timeInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  /**
   * 날짜 포맷팅 함수
   */
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  /**
   * 시간 포맷팅 함수
   */
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="text-center">
      <div className="text-sm">{formatDate(currentDate)}</div>
      <div className="text-lg font-semibold">{formatTime(currentDate)}</div>
    </div>
  );
};

// 클라이언트 사이드에서만 렌더링할 날씨 컴포넌트
const WeatherDisplay = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 날씨 정보 가져오기
  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 서울 좌표 (탄천 인근)
      const lat = 37.5139;
      const lon = 127.0599;
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'f5d4a5f5e0843e7c44fcca9c1c26c6a2';
      
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

  /**
   * 날씨 정보 수동 새로고침 함수
   */
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

/**
 * 뷰 헤더 컴포넌트
 */
const ViewHeader = () => {
  const router = useRouter();

  /**
   * 로그아웃 처리 함수
   */
  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    localStorage.removeItem('user');
    router.push('/login');
  };

  // 클라이언트 사이드에서만 렌더링할 컴포넌트를 위한 상태
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="bg-gray-800 text-white py-3 px-6 shadow-md">
      <div className="flex justify-between items-center">
        {/* 왼쪽: 로고와 타이틀 */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold">TM</span>
          </div>
          <h1 className="text-xl font-bold">탄천 악취 모니터링</h1>
        </div>
        
        {/* 가운데: 시간과 날씨 - 클라이언트 사이드에서만 렌더링 */}
        <div className="flex items-center space-x-6">
          {isMounted ? (
            <>
              <TimeDisplay />
              <WeatherDisplay />
            </>
          ) : (
            <div className="h-16 w-64 bg-gray-700 rounded-md animate-pulse"></div>
          )}
        </div>
        
        {/* 오른쪽: 사용자 정보 */}
        <div className="flex items-center">
          <div className="bg-blue-600 text-xs px-2 py-1 rounded-md mr-2">관리자</div>
          <div className="flex items-center">
            <Image src={UserIcon} alt="사용자" width={24} height={24} className="mr-2" />
            <span className="text-sm">홍길동</span>
          </div>
          <button 
            onClick={handleLogout}
            className="ml-4 text-sm text-gray-300 hover:text-white"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

export default ViewHeader; 