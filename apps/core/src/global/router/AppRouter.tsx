import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import BackofficeLayout from '@/backoffice/common/view/layouts/BackofficeLayout'
import Dashboard from '@/backoffice/domains/dashboard'
import UsersRole from '@/backoffice/domains/users/page/usersRole'
import Device from '@/backoffice/domains/device'
import AssetList from '@/backoffice/domains/asset/page/assetList'
import AssetCategory from '@/backoffice/domains/asset/page/assetCategory'
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
          <Route path="usersRole" element={<UsersRole />} />
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
