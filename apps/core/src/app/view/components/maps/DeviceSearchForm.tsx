import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import type { GsDeviceResponse, FeatureResponse } from '@plug/common-services'
import { useDeviceStore } from '@/app/store/deviceStore'
import { GroupSearchForm } from '@/app/view/components/group-search-form'
import type { GroupSearchGroup, GroupSearchFormRef } from '@/app/view/components/group-search-form'
import { Camera } from '@plug/engine'

interface DeviceSearchFormProps {
  className?: string
  features?: FeatureResponse[]
  onDeviceSelect?: (device: GsDeviceResponse) => void
}

const DeviceSearchForm: React.FC<DeviceSearchFormProps> = ({ className, features = [], onDeviceSelect }) => {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<GroupSearchFormRef>(null)

  const loadAllDevices = useDeviceStore(s => s.loadAll)
  const searchDevices = useDeviceStore(s => s.searchDevices)

  useEffect(() => {
    loadAllDevices()
  }, [loadAllDevices])

  const groups = useMemo<GroupSearchGroup<GsDeviceResponse>[]>(() => {
    const result = searchDevices(query)
    return result.map(({ category, items }) => ({ heading: category, items }))
  }, [searchDevices, query])

  const handleSelect = useCallback((device: GsDeviceResponse) => {
    setQuery('')
    formRef.current?.close()
    // feature 중 deviceId 매칭되는 poi(feature.id) 찾기
    const matchedFeature = features.find(f => f.deviceId === device.id)
    if (matchedFeature) {
      try {
        Camera.MoveToPoi(String(matchedFeature.id), 0.5, 3)
      } catch {
        /* swallow */
      }
    }
    onDeviceSelect?.(device)
  }, [features, onDeviceSelect])

  return (
    <div ref={searchRef} className={['relative w-96', className || ''].join(' ').trim()}>
      <GroupSearchForm<GsDeviceResponse>
        ref={formRef}
        value={query}
        onValueChange={setQuery}
        groups={groups}
        placeholder="카테고리, 디바이스명, 또는 ID로 검색..."
        getItemKey={(item) => String(item.id)}
        renderItem={(device) => (
          <div className="flex w-full items-center justify-between">
            <span className="truncate max-w-[70%]">{String(device.name ?? device.id)}</span>
            <span className="text-xs text-blue-600">{String(device.id)}</span>
          </div>
        )}
        onSelect={handleSelect}
      />
    </div>
  )
}

export default DeviceSearchForm
