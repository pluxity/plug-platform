import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import useAuthStore from '../stores/authStore';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { accessToken, isAdmin, hasRole } = useAuthStore();
  const location = useLocation();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 관리자가 아닌 경우 메인 페이지로 리다이렉트
  if (!isAdmin || !hasRole('ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 