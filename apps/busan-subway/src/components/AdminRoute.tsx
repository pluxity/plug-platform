import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

interface AdminRouteProps {
  children?: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { accessToken, isAdmin } = useAuthStore();

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // 관리자가 아닌 경우 메인 페이지로 리다이렉트
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 인증된 관리자인 경우 자식 컴포넌트 또는 Outlet 렌더링
  return <>{children || <Outlet />}</>;
};

export default AdminRoute; 