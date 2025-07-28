import React from 'react'
import { Outlet } from 'react-router-dom'

const ViewLayout: React.FC = () => {
  return (
    <div className="h-full p-6 overflow-auto">
      <Outlet />
    </div>
  )
}

export default ViewLayout
