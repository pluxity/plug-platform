import React from 'react'
import AppHeader from './AppHeader'
import { Outlet } from 'react-router-dom'

const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <AppHeader />

      {/* Main Content - 전체 화면 사용 */}
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>

      {/* Copyright - 절대 위치로 하단에 고정, 영역 차지하지 않음 */}
      <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 px-2 py-1 rounded shadow-sm z-10">
        © 2025 Pluxity. All rights reserved.
      </span>
    </div>
  )
}

export default AppLayout
