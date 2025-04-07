import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/molecules/ProtectedRoute';
import AdminRoute from './components/molecules/AdminRoute';
import useAuthStore from './stores/authStore';
import { setTokenGetter } from '@plug/api-hooks';
import { MainLayout } from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/station/CategoryManagement';
import DrawingManagement from './pages/admin/station/DrawingManagement';
import ObjectManagement from './pages/admin/ObjectManagement';

const App = () => {
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
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="users" replace />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="station">
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="drawings" element={<DrawingManagement />} />
              </Route>
              <Route path="objects" element={<ObjectManagement />} />
            </Route>
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