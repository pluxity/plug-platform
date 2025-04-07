import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/pages/AdminDashboard';
import useAuthStore from './stores/authStore';
import { setTokenGetter } from '@plug/api-hooks';
import { MainLayout } from './components/layouts/MainLayout';

const App: React.FC = () => {

  // useEffect 안에서 연결하면 타이밍 문제가 있을 수 있음 → 바로 연결
  setTokenGetter(() => useAuthStore.getState().accessToken);
  
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 관리자 라우트 */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 보호된 라우트 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App; 