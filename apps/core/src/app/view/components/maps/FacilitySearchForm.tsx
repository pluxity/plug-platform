import React, { useState, useRef, useEffect } from 'react'
import { useFacilityStore } from '@/app/store/facilityStore'
import type { BaseFacilityResponse } from '@plug/common-services'
import * as Cesium from 'cesium'

interface FacilitySearchFormProps {
  viewer: Cesium.Viewer | null
}

const FacilitySearchForm: React.FC<FacilitySearchFormProps> = ({ viewer }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BaseFacilityResponse[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const { facilities } = useFacilityStore()

  // 검색 함수
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsOpen(false)
      return
    }
    
    const searchTerm = query.toLowerCase()
    const allFacilities = Object.values(facilities).flat().filter(Boolean) as BaseFacilityResponse[]
    
    const results = allFacilities.filter((facility: BaseFacilityResponse) =>
      facility.name.toLowerCase().includes(searchTerm) ||
      facility.code.toLowerCase().includes(searchTerm) ||
      (facility.description && facility.description.toLowerCase().includes(searchTerm))
    )
    
    setSearchResults(results)
    setIsOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    performSearch(query)
  }

  const handleSelectFacility = (facility: BaseFacilityResponse) => {
    // 검색창 비우기
    setSearchQuery('')
    setSearchResults([])
    setIsOpen(false)
    
    // 카메라 이동 - 시설을 바라보도록 위치 설정
    if (viewer && facility.lat && facility.lon) {
      // 시설 위치
      const targetPosition = Cesium.Cartesian3.fromDegrees(facility.lon, facility.lat, 0)
      
      // 카메라를 시설 위치로 향하도록 설정 (거리와 각도 지정)
      viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(targetPosition, 1000), // 목표 지점 중심으로 반경 1000m
        {
          duration: 2.0,
          offset: new Cesium.HeadingPitchRange(
            0, // heading: 북쪽 방향
            Cesium.Math.toRadians(-30), // pitch: 30도 아래를 바라봄  
            2000 // range: 2000m 거리
          )
        }
      )
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleInputFocus = () => {
    if (searchQuery.trim().length > 0 && searchResults.length > 0) {
      setIsOpen(true)
    }
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className="relative w-80">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="시설명 또는 코드를 검색하세요..."
          className="w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {/* 검색 아이콘 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searchQuery ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
            {searchResults.length}개의 시설을 찾았습니다
          </div>
          {searchResults.map((facility) => (
            <button
              key={facility.id}
              onClick={() => handleSelectFacility(facility)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-900">{facility.name}</div>
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {facility.code}
                </div>
              </div>
              {facility.description && (
                <div className="text-sm text-gray-500 mt-1">{facility.description}</div>
              )}
              <div className="text-xs text-blue-600 mt-1">
                위도: {facility.lat?.toFixed(6)}, 경도: {facility.lon?.toFixed(6)}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 검색 결과가 없을 때 */}
      {isOpen && searchQuery && searchResults.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            검색 결과가 없습니다.
          </div>
        </div>
      )}
    </div>
  )
}

export default FacilitySearchForm
