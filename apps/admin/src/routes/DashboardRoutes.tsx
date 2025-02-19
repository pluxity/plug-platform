import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/MainPage';
import Users from '../pages/UserPage';
import SystemSettings from '../pages/SystemSettingPage';
import Drawing from '../pages/Drawings/DrawingPage';
import DrawingCategory from "../pages/Drawings/CategoryPage";
import PlxObject from '../pages/Objects/ObjectPage';
import ObjectCategory from '../pages/Objects/CategoryPage';

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