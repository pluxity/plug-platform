import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';
import { cookieStorage, ACCESS_TOKEN_NAME } from './utils/cookies';

const App: React.FC = () => {
  const { initialize, isAuthenticated } = useAuthStore();
  
  // 앱 시작 시 쿠키에서 인증 상태 초기화
  useEffect(() => {
    console.log('===== 앱 초기화 시작 =====');
    // 쿠키 확인
    const token = cookieStorage.getCookie(ACCESS_TOKEN_NAME);
    console.log('앱 시작 시 토큰 존재 여부:', token ? '있음' : '없음');
    
    // 인증 상태 초기화
    initialize();
    
    // 초기화 후 상태 확인
    setTimeout(() => {
      console.log('초기화 후 인증 상태:', isAuthenticated);
      console.log('===== 앱 초기화 완료 =====');
    }, 100);
  }, [initialize, isAuthenticated]);
  
  return (
    <Router>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 보호된 라우트 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 