import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useFacilityStore } from '@/app/store/facilityStore'
import type { FacilityResponse } from '@plug/common-services'
import * as Cesium from 'cesium'

interface FacilitySearchFormProps {
  viewer: Cesium.Viewer | null
}

const FacilitySearchForm: React.FC<FacilitySearchFormProps> = ({ viewer }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FacilityResponse[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  
  // facilities만 선택적으로 구독 (리렌더 최소화)
  const facilities = useFacilityStore(s => s.facilities)
  const allFacilities = useMemo(() => {
    return Object.values(facilities).filter(Array.isArray).flat() as FacilityResponse[]
  }, [facilities])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.trim()) {
      const q = value.toLowerCase()
      const filtered = allFacilities.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        (f.description && f.description.toLowerCase().includes(q))
      )
      setResults(filtered)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }

  const handleSelectFacility = (facility: FacilityResponse) => {
  // 로컬 상태 정리
  setIsOpen(false)
  setQuery('')
  setResults([])
    
    if (!viewer) return

    // Prefer flying to the POI entity created for this facility to keep camera/POI consistent
    const entityId = `facility-${facility.id}`
    const entity = viewer.entities.getById(entityId)
    if (entity && entity.position) {
      const pos = entity.position.getValue(Cesium.JulianDate.now())
      if (pos) {
        viewer.camera.flyToBoundingSphere(
          new Cesium.BoundingSphere(pos, 1000),
          {
            duration: 2.0,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-15), 2000)
          }
        )
        return
      }
    }

    // Fallback to lat/lon if entity not found yet
    if (facility.lat && facility.lon) {
      const targetPosition = Cesium.Cartesian3.fromDegrees(facility.lon, facility.lat, 0)
      viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(targetPosition, 1000),
        {
          duration: 2.0,
          offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-15), 2000)
        }
      )
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleInputFocus = () => {
    if (query.trim().length > 0 && results.length > 0) {
      setIsOpen(true)
    }
  }

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
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="시설명 또는 코드를 검색하세요..."
          className="w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {query ? (
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

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
            {results.length}개의 시설을 찾았습니다
          </div>
          {results.map((facility) => (
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

      {isOpen && query && results.length === 0 && (
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
