import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import useAuthStore from './stores/authStore';
import { setTokenGetter } from '@plug/api-hooks';
import { MainLayout } from './components/layouts/MainLayout';

const App: React.FC = () => {

  // useEffect 안에서 연결하면 타이밍 문제가 있을 수 있음 → 바로 연결
  setTokenGetter(() => {
    const token = useAuthStore.getState().accessToken;
    console.log('App.tsx에서 토큰 가져오기:', token);
    return token;
  });
  
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 관리자 라우트 */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* 보호된 라우트 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App; 