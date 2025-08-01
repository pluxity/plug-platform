import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import { BackofficeLayout, ViewLayout, DashboardLayout } from '@/backoffice/common/view/layouts'
import Dashboard from '@/backoffice/domains/dashboard'
import Device from '@/backoffice/domains/device'
import { Role , User } from '@/backoffice/domains/users'
import { AssetList, AssetCategory } from '@/backoffice/domains/asset'
import { ViewMain } from '@/backoffice/domains/view'
import AppLayout from '@/app/view/layouts/AppLayout'
import MapView from '@/app/view/pages/MapView'
import FacilityManagement from "@/backoffice/domains/facility/pages";
import FacilityDetailPage from "@/backoffice/domains/facility/pages/FacilityDetailPage";
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
              <Route path="device" element={<Device />} />
              <Route path="assetList" element={<AssetList />} />
              <Route path="assetCategory" element={<AssetCategory />} />
              <Route path="facility" element={<Outlet />} >
                <Route index element={<FacilityManagement />} />
                <Route path="buildings/:id" element={<FacilityDetailPage />} />
                <Route path="stations/:id" element={<FacilityDetailPage />} />
              </Route>
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
