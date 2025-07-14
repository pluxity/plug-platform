import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import BackofficeLayout from '@/backoffice/common/view/layouts/BackofficeLayout'
import Dashboard from '@/backoffice/domains/dashboard'
import Users from '@/backoffice/domains/users'
import Device from '@/backoffice/domains/device'
import Asset from '@/backoffice/domains/asset'
import AppLayout from '@/app/view/layouts/AppLayout'
import MapView from '@/app/view/pages/MapView'
import Buildings from "@/backoffice/domains/buildings";
import BuildingDetail from "@/backoffice/domains/buildings/[id]/BuildingDetailPage";
import BuildingEditPage from "@/backoffice/domains/buildings/[id]/BuildingEditPage";
import BuildingCreate from "@/backoffice/domains/buildings/[id]/BuildingCreatePage";
import FacilityManagement from "@/backoffice/domains/facility";
import Stations from "@/backoffice/domains/station";
import Factories from "@/backoffice/domains/factory";

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
          <Route element={<FacilityManagement />}>
            <Route path="buildings" element={<Buildings />}>
              <Route path="add" element={<BuildingCreate />} />
              <Route path=":id" element={<BuildingDetail />} />
              <Route path=":id/edit" element={<BuildingEditPage /> } />
            </Route>
            <Route path="stations" element={<Stations />} />
            <Route path="factories" element={<Factories />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter
