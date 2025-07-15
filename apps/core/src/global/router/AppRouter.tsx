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
import {Buildings} from "@/backoffice/domains/facility/buildings";
import BuildingCreatePage from "@/backoffice/domains/facility/buildings/page/BuildingCreatePage";
import BuildingDetailPage from "@/backoffice/domains/facility/buildings/page/BuildingDetailPage";
import BuildingEditPage from "@/backoffice/domains/facility/buildings/page/BuildingEditPage";

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
          <Route path="facility" element={<FacilityManagement />}/>
          <Route path="building" >
            <Route index element={<Buildings />} />
            <Route path="add" element={<BuildingCreatePage />} />
            <Route path=":id" element={<BuildingDetailPage />} />
            <Route path=":id/edit" element={<BuildingEditPage /> } />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter
