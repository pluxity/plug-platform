import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { BackofficeLayout, DashboardLayout } from '@/backoffice/common/view/layouts'
import Dashboard from '@/backoffice/domains/dashboard'
import { Role , User, Permission } from '@/backoffice/domains/users'
import { AssetList, AssetCategory } from '@/backoffice/domains/asset'
import { DeviceCategory } from '@/backoffice/domains/device'
import AppLayout from '@/app/view/layouts/AppLayout'
import MapView from '@/app/view/pages/MapView'
import LoginPage from '@/global/pages/LoginPage'
import ProtectedRoute from '@/global/components/ProtectedRoute'

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
              <Route path="assetList" element={<AssetList />} />
              <Route path="assetCategory" element={<AssetCategory />} />
              <Route path="deviceCategory" element={<DeviceCategory />} />
            </Route>
          </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
