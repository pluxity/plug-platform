import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'

// 인증이 필요한 라우트를 위한 래퍼 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated, userName, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">부산 지하철</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:underline">홈</Link></li>
              <li><Link to="/map" className="hover:underline">노선도</Link></li>
              <li><Link to="/info" className="hover:underline">역 정보</Link></li>
              {isAuthenticated ? (
                <>
                  <li><span className="text-white font-medium">{userName} 님</span></li>
                  <li>
                    <button 
                      onClick={logout} 
                      className="text-white hover:underline"
                    >
                      로그아웃
                    </button>
                  </li>
                </>
              ) : (
                <li><Link to="/login" className="hover:underline">로그인</Link></li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/map" element={
            <ProtectedRoute>
              <div>노선도 페이지 (개발 중)</div>
            </ProtectedRoute>
          } />
          <Route path="/info" element={
            <ProtectedRoute>
              <div>역 정보 페이지 (개발 중)</div>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>© 2025 부산 지하철 정보 서비스</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App 