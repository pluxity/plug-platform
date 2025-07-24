import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import BackofficeLayout from '@/backoffice/common/view/layouts/BackofficeLayout'
import Dashboard from '@/backoffice/domains/dashboard'
import Device from '@/backoffice/domains/device'
import { Role , User } from '@/backoffice/domains/users'
import { AssetList, AssetCategory } from '@/backoffice/domains/asset'
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
          <Route path="role" element={<Role />} />
          <Route path="user" element={<User />} />
          <Route path="device" element={<Device />} />
          <Route path="assetList" element={<AssetList />} />
          <Route path="assetCategory" element={<AssetCategory />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
