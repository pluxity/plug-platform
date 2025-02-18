import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AdminLayout from './layouts/AdminLayout';
import ThreeDLayout from './layouts/ThreeDLayout';
import AppRoutes from './routes/DashboardRoutes';

const App = () => {
  return (
    <ConfigProvider>
      <BrowserRouter>    
        <Routes>
          <Route path="/3d" element={
            <ThreeDLayout />
          } />
          <Route path="/*" element={
            <AdminLayout>
              <AppRoutes />
            </AdminLayout>
          } />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
