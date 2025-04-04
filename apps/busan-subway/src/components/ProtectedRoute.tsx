import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { cookieStorage, ACCESS_TOKEN_NAME } from '../utils/cookies';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { initialize, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasValidToken, setHasValidToken] = useState(false);
  
  useEffect(() => {
    const checkToken = () => {
      // 쿠키에서 직접 토큰 확인
      const token = cookieStorage.getCookie(ACCESS_TOKEN_NAME);
      console.log('보호된 라우트 - 토큰 확인:', token ? '있음' : '없음');
      
      if (token) {
        setHasValidToken(true);
      }
      
      // 인증 상태 초기화
      initialize();
      setIsChecking(false);
    };
    
    checkToken();
  }, [initialize]);
  
  // 둘 다 확인 완료되면 체크
  if (!isChecking && !hasValidToken && !isAuthenticated) {
    console.log('인증되지 않음. 로그인 페이지로 이동');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (isChecking) {
    // 인증 확인 중일 때 로딩 상태 표시 (선택적)
    return <div className="flex justify-center items-center h-screen">
      <p>인증 확인 중...</p>
    </div>;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute; 