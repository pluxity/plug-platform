import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import type { DeviceResponse } from '@plug/common-services'
import { useDeviceStore } from '@/app/store/deviceStore'
import { GroupSearchForm } from '@/app/view/components/group-search-form'
import type { GroupSearchGroup, GroupSearchFormRef } from '@/app/view/components/group-search-form'
import { Camera } from '@plug/engine'

interface DeviceSearchFormProps {
  className?: string
  onDeviceSelect?: (device: DeviceResponse) => void
}

const DeviceSearchForm: React.FC<DeviceSearchFormProps> = ({ className, onDeviceSelect }) => {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<GroupSearchFormRef>(null)

  const loadAllDevices = useDeviceStore(s => s.loadAll)
  const searchDevices = useDeviceStore(s => s.searchDevices)

  useEffect(() => {
    loadAllDevices()
  }, [loadAllDevices])

  const groups = useMemo<GroupSearchGroup<DeviceResponse>[]>(() => {
    const result = searchDevices(query)
    return result.map(({ category, items }) => ({ heading: category, items }))
  }, [searchDevices, query])

  const handleSelect = useCallback((device: DeviceResponse) => {
    setQuery('')
    formRef.current?.close()
    if (device.feature?.id) {
      Camera.MoveToPoi(String(device.feature.id), 0.5, 1)
    }
    onDeviceSelect?.(device)
  }, [onDeviceSelect])

  return (
    <div ref={searchRef} className={['relative w-96', className || ''].join(' ').trim()}>
      <GroupSearchForm<DeviceResponse>
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
