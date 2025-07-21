import React, { useState } from 'react'
import { Profile, Badge, SearchForm } from '@plug/ui'

const AppHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    console.log('검색:', query)
  }

  const handleSelect = (selectedItem: string) => {
    console.log('선택됨:', selectedItem)
  }

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
            <div className="w-64">
              <SearchForm
                value={searchQuery}
                onChange={setSearchQuery}
                onSelect={handleSelect}
                onSearch={handleSearch}
                placeholder="전체 검색..."
              />
            </div>
            <Profile>
              🏢 Admin
            </Profile>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
