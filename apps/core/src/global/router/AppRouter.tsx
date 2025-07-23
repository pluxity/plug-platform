import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import BackofficeLayout from '@/backoffice/common/view/layouts/BackofficeLayout'
import Dashboard from '@/backoffice/domains/dashboard'
import Role from '@/backoffice/domains/users/page/Role'
import Device from '@/backoffice/domains/device'
import { AssetList, AssetCategory } from '@/backoffice/domains/asset'
import AppLayout from '@/app/view/layouts/AppLayout'
import MapView from '@/app/view/pages/MapView'
import FacilityManagement from "@/backoffice/domains/facility";
import BuildingDetailPage from "@/backoffice/domains/facility/buildings/BuildingDetailPage";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<MapView />} />
          </Route>

          <Route path="/admin" element={<BackofficeLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="role" element={<Role />} />
          <Route path="device" element={<Device />} />
          <Route path="assetList" element={<AssetList />} />
          <Route path="assetCategory" element={<AssetCategory />} />
          <Route path="facility" element={<Outlet />} >
            <Route index element={<FacilityManagement />} />
            <Route path=":id" element={<BuildingDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
