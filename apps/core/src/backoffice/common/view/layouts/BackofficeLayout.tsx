import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toast } from '@plug/ui'
import { BackofficeHeader } from '@/backoffice/common/view/layouts'

const BackofficeLayout: React.FC = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <BackofficeHeader />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      <Toast />
    </div>
  )
}

export default BackofficeLayout
