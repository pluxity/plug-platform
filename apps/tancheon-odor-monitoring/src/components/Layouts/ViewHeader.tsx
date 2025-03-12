'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import UserIcon from '@plug/ui/src/assets/icons/user.svg';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { WeatherDisplay } from '@/components/Weather';

/**
 * 풍향 아이콘 컴포넌트
 */

const TimeDisplay = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

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


const ViewHeader = () => {
  const router = useRouter();
  
  // Zustand 스토어에서 사용자 정보와 clearUser 함수 가져오기
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  /**
   * 로그아웃 처리 함수
   */
  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    clearUser(); // Zustand의 clearUser 함수 사용
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
          <button 
            onClick={() => {
              if (user?.role === 'ADMIN') {
                router.push('/admin/users');
              } 
            }}
            type="button" className="bg-blue-600 text-xs px-2 py-1 rounded-md mr-2">
            {user?.role === 'ADMIN' ? '관리자' : '사용자'}
          </button>
          <div className="flex items-center">
            <Image src={UserIcon} alt="사용자" width={24} height={24} className="mr-2" />
            <span className="text-sm">
              {user?.user_name}
            </span>
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