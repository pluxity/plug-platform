import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BackofficeLayout from '@/backoffice/common/view/layouts/BackofficeLayout'
import Dashboard from '@/backoffice/domains/dashboard'
import Users from '@/backoffice/domains/users'
import Device from '@/backoffice/domains/device'
import Asset from '@/backoffice/domains/asset'
import AppLayout from '@/app/view/layouts/AppLayout'
import MapView from '@/app/view/pages/MapView'
import FacilityManagement from "@/backoffice/domains/facility";
import { BuildingDetailPage } from "@/backoffice/domains/facility/buildings/BuildingDetailPage";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<MapView />} />
        </Route>

        <Route path="/admin" element={<BackofficeLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="device" element={<Device />} />
          <Route path="asset" element={<Asset />} />
          <Route path="facility"  index element={<FacilityManagement />} />
          <Route path="building/:id" element={<BuildingDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter
