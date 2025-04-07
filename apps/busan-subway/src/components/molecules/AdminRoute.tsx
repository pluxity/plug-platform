import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const AdminRoute = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if ([...user.roles].filter((role) => role.name !== 'ADMIN').length > 0) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 