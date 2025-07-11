import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Badge } from '@plug/ui'

const AppHeader: React.FC = () => {
  const navigate = useNavigate()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-point-blue">Pluxity</span> Map Control
            </h1>
            <Badge variant="secondary" className="text-xs">
              LIVE
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              🔍 Search
            </Button>
            <Button className="w-full">
              📍 My Location 2312312323
            </Button>
            <Button size="sm" onClick={() => navigate('/admin')}>
              🏢 Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
