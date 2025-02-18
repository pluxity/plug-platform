import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/dashboard/Dashboard';
import Users from '../pages/dashboard/User';
import SystemSettings from '../pages/dashboard/SystemSetting';
import Drawing from '../pages/dashboard/Drawings/Drawing';
import DrawingCategory from "../pages/dashboard/Drawings/Category";
import PlxObject from '../pages/dashboard/Objects/Object';
import ObjectCategory from '../pages/dashboard/Objects/Category';

const DashboardRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/users" element={<Users />} />
    <Route path="/settings" element={<SystemSettings />} />
    <Route path="/drawings/category" element={<DrawingCategory />} />
    <Route path="/drawings/drawing" element={<Drawing />} />
    <Route path="/objects/category" element={<ObjectCategory />} />
    <Route path="/objects/object" element={<PlxObject />} />
  </Routes>
);

export default DashboardRoutes;