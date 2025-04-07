import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;