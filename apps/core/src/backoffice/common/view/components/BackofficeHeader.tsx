import React from 'react'
import { Button, Avatar, AvatarImage } from '@plug/ui'

const BackofficeHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Control Center
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hover:bg-transparent">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage />
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="text-gray-600">시설 관리팀</span>
                  <span>홍길동</span>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
 
export default BackofficeHeader
