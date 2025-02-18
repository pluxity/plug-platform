import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AdminLayout from './layouts/AdminLayout';
import AppRoutes from './routes/AppRoutes';
import 'antd/dist/reset.css';

const App = () => {
  return (
    <ConfigProvider>
      <BrowserRouter basename='/admin'>
        <AdminLayout>
          <AppRoutes />
        </AdminLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
