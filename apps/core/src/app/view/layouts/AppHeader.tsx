import React, { useState } from 'react'
import { Profile, Badge, SearchForm } from '@plug/ui'
import { useBuildingStore } from '../../store/buildingStore'

const AppHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])

  // Store에서 빌딩 데이터와 액션 가져오기 (API 호출은 제거)
  const { 
    buildings, 
    searchBuildings,
    setSearchSelectedBuilding  // 검색 선택용 액션
  } = useBuildingStore()

  const handleSearch = (query: string) => {
    console.log('검색:', query)
    
    if (query.trim() === '') {
      setSearchResults([])
      return
    }

    // Store의 searchBuildings 함수 사용
    const matchedBuildings = searchBuildings(query)
    const buildingNames = matchedBuildings.map(building => building.facility.name)
    
    setSearchResults(buildingNames)
  }

  const handleSelect = (selectedItem: string) => {
    console.log('선택됨:', selectedItem)
    
    // 선택된 빌딩 이름으로 빌딩 객체 찾기
    const selectedBuilding = buildings.find(building => building.facility.name === selectedItem)
    
    if (selectedBuilding) {
      // Store에 검색으로 선택된 빌딩 저장 (카메라 이동용)
      setSearchSelectedBuilding(selectedBuilding)
      console.log('Selected building for camera movement:', selectedBuilding.facility.name)
    }
    
    setSearchQuery(selectedItem)
    setSearchResults([])
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
                searchResult={searchResults}
                placeholder="빌딩 검색..."
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
