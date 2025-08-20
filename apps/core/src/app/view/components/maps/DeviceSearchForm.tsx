import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { GsDeviceResponse } from '@plug/common-services'
import { useDeviceStore } from '@/app/store/deviceStore'
import { GroupSearchForm } from '@/app/view/components/GroupSearchForm'
import type { GroupSearchGroup } from '@/app/view/components/GroupSearchForm'

interface DeviceSearchFormProps {
  className?: string
}

const DeviceSearchForm: React.FC<DeviceSearchFormProps> = ({ className }) => {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)

  const loadAllDevices = useDeviceStore(s => s.loadAll)
  const searchDevices = useDeviceStore(s => s.searchDevices)

  useEffect(() => {
    loadAllDevices()
  }, [loadAllDevices])

  const groups = useMemo<GroupSearchGroup<GsDeviceResponse>[]>(() => {
    const result = searchDevices(query)
    return result.map(({ category, items }) => ({ heading: category, items }))
  }, [searchDevices, query])

  return (
  <div ref={searchRef} className={["relative w-96", className || ''].join(' ').trim()}>
      <GroupSearchForm<GsDeviceResponse>
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
    onSelect={() => setQuery('')}
      />
    </div>
  )
}

export default DeviceSearchForm
