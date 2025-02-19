import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/User';
import SystemSettings from '../pages/SystemSetting';
import Drawing from '../pages/Drawings/Drawing';
import DrawingCategory from "../pages/Drawings/Category";
import PlxObject from '../pages/Objects/Object';
import ObjectCategory from '../pages/Objects/Category';

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