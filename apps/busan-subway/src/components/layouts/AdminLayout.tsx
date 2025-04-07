import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 