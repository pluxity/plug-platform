import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/app/view/components'

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppHeader />

      {/* Main Content */}
      <main className="flex-1 relative">
        <Outlet />
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200 z-10">
        <div className="container mx-auto px-6 py-2">
          <div className="text-center text-sm text-gray-600">
            © 2025 Pluxity. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
