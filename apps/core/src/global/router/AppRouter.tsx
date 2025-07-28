import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { BackofficeLayout, ViewLayout, DashboardLayout } from '@/backoffice/common/view/layouts'
import Dashboard from '@/backoffice/domains/dashboard'
import Role from '@/backoffice/domains/users/page/Role'
import Device from '@/backoffice/domains/device'
import { AssetList, AssetCategory } from '@/backoffice/domains/asset'
import { ViewMain } from '@/backoffice/domains/view'
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

          {/* 백오피스 (인증 필요) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <BackofficeLayout />
            </ProtectedRoute>
          }>

            <Route element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="role" element={<Role />} />
              <Route path="device" element={<Device />} />
              <Route path="assetList" element={<AssetList />} />
              <Route path="assetCategory" element={<AssetCategory />} />
            </Route>

            <Route path="view" element={<ViewLayout />}>
              <Route index element={<ViewMain />} />
            </Route>
          </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
