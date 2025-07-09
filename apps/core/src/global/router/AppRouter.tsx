import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import BackofficeLayout from '@/backoffice/common/view/layouts/BackofficeLayout'
import Dashboard from '@/backoffice/pages/dashboard'
import Users from '@/backoffice/pages/users'
import Device from '@/backoffice/pages/device'
import Asset from '@/backoffice/pages/asset'

import AppLayout from '@/app/view/layouts/AppLayout'
import MapView from '@/app/view/pages/MapView'

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
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
