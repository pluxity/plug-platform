import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/global/store'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string // 필요한 역할 추가
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 특정 역할이 필요한 경우 확인
  if (requiredRole && !hasRole(requiredRole)) {
    // 권한이 없으면 메인 페이지로 리다이렉트
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
