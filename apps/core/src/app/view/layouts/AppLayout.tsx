import { Outlet } from 'react-router-dom'

import React from 'react'
const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
      <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 px-2 py-1 rounded z-10">
        © 2025 Pluxity. All rights reserved.
      </span>
    </div>
  )
}

export default AppLayout
