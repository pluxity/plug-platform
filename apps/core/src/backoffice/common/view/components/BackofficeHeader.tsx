import React from 'react'
import { Button, Badge } from '@plug/ui'

const BackofficeHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Control Center
            </h1>
            <Badge variant="secondary" className="text-xs">
              LIVE
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Profile
            </Button>
            <Button size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default BackofficeHeader
