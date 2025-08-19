import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { FeatureResponse } from '@plug/common-services/types'
import type { GsDeviceResponse } from '@plug/common-services'
import { Camera, Model } from '@plug/engine/src'
import { useDeviceStore } from '@/app/store/deviceStore'

interface DeviceSearchFormProps {
  features: FeatureResponse[]
}

const DeviceSearchForm: React.FC<DeviceSearchFormProps> = ({ features }) => {
  type DeviceFeatureRef = { id?: string; floorId?: string }
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GsDeviceResponse[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  const devices = useDeviceStore(deviceState => deviceState.devices)
  const devicesFetched = useDeviceStore(deviceState => deviceState.devicesFetched)
  const loadDevices = useDeviceStore(deviceState => deviceState.loadOnce)

  useEffect(() => {
    if (!devicesFetched) {
      loadDevices()
    }
  }, [devicesFetched, loadDevices])

  const inFacilityDevices = useMemo(() => {
    if (!devices || devices.length === 0) return [] as GsDeviceResponse[]
    const deviceIdsInFeatures = new Set((features ?? []).map(feature => feature.deviceId).filter(Boolean) as string[])
    const featureIdsInFeatures = new Set((features ?? []).map(feature => feature.id).filter(Boolean) as string[])
    if (deviceIdsInFeatures.size === 0 && featureIdsInFeatures.size === 0) {
      return devices
    }
    return devices.filter(device => {
      const deviceIdMatch = device.id && deviceIdsInFeatures.has(device.id)
      const featureIdMatch = !!device.feature && !!device.feature.id && featureIdsInFeatures.has(device.feature.id)
      return deviceIdMatch || featureIdMatch
    })
  }, [devices, features])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.trim()) {
      const normalizedQuery = value.toLowerCase()
      const filtered = inFacilityDevices.filter((device) => {
        const nameMatch = device.name && device.name.toLowerCase().includes(normalizedQuery)
        const idMatch = device.id && device.id.toLowerCase().includes(normalizedQuery)
        const featureIdMatch = device.feature?.id && device.feature.id.toLowerCase().includes(normalizedQuery)
        return !!(nameMatch || idMatch || featureIdMatch)
      })
      setResults(filtered)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (query.trim()) {
      const normalizedQuery = query.toLowerCase()
      const filtered = inFacilityDevices.filter((device) => {
        const nameMatch = device.name && device.name.toLowerCase().includes(normalizedQuery)
        const idMatch = device.id && device.id.toLowerCase().includes(normalizedQuery)
        const featureIdMatch = device.feature?.id && device.feature.id.toLowerCase().includes(normalizedQuery)
        return !!(nameMatch || idMatch || featureIdMatch)
      })
      setResults(filtered)
      if (filtered.length > 0) setIsOpen(true)
    }
  }, [inFacilityDevices, query])

  const handleSelectDevice = (device: GsDeviceResponse) => {
    setIsOpen(false)
    setQuery('')
    setResults([])

    const featureIdFromDevice = device.feature?.id
    const targetFeatureId = featureIdFromDevice ?? features.find(feature => feature.deviceId === device.id)?.id
    if (!targetFeatureId) return

  const floorIdFromDevice = (device.feature as DeviceFeatureRef | undefined)?.floorId
    const targetFloorId = floorIdFromDevice
      ?? features.find(feature => feature.id === targetFeatureId)?.floorId

    try {
      if (targetFloorId) {
        Model.HideAll()
        Model.Show(targetFloorId)
      }
      Camera.MoveToPoi(targetFeatureId, 1.5)
    } catch (error) {
      console.debug('MoveToPoi failed', error)
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
          placeholder="디바이스명 또는 ID를 검색하세요..."
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
            {results.length}개의 디바이스를 찾았습니다
          </div>
    {results.map((device) => (
            <button
              key={device.id}
              onClick={() => handleSelectDevice(device)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-900">{device.name || device.id}</div>
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
      {device.feature?.id || device.id}
                </div>
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

export default DeviceSearchForm
