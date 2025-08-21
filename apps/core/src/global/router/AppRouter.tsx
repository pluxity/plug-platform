import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from '@/global/pages/LoginPage'
import ProtectedRoute from '@/global/components/ProtectedRoute'

import { BackofficeLayout, DashboardLayout, IndoorLayout } from '@/backoffice/common/view/layouts'

import { Dashboard, FacilityList, FacilityEdit, FacilityIndoor, Role, User, Permission, AssetList, AssetCategory, DeviceCategory, DeviceList } from '@/backoffice/domains'

import AppLayout from '@/app/view/layouts/AppLayout'
import MapView from '@/app/view/pages/MapView'

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<MapView />} />
          </Route>

          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <BackofficeLayout />
            </ProtectedRoute>
          }>

              <Route element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="role" element={<Role />} />
              <Route path="user" element={<User />} />
              <Route path="permission" element={<Permission />} />
              <Route path="facility" element={<FacilityList />} />
              <Route path="facility/:id" element={<FacilityEdit />} />
              <Route path="asset-category" element={<AssetCategory />} />
              <Route path="asset-list" element={<AssetList />} />
              <Route path="device-category" element={<DeviceCategory />} />
              <Route path="device-list" element={<DeviceList />} />
            </Route>

            {/* 실내지도 편집을 위한 별도 레이아웃 */}
            <Route element={<IndoorLayout />}>
              <Route path="facility/:id/indoor" element={<FacilityIndoor />} />
            </Route>
          </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
