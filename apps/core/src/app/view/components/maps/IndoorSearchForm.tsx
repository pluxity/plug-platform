import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useIndoorStore, type IndoorSearchItem, useSyncCctvs } from '@/app/store/indoorStore'
import { GroupSearchForm } from '@/app/view/components/group-search-form'
import type { GroupSearchGroup, GroupSearchFormRef } from '@/app/view/components/group-search-form'
import { Camera } from '@plug/engine'

interface IndoorSearchFormProps {
  className?: string
  onDeviceSelect?: (item: IndoorSearchItem) => void
}

const IndoorSearchForm: React.FC<IndoorSearchFormProps> = ({ className, onDeviceSelect }) => {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<GroupSearchFormRef>(null)

  const searchDevices = useIndoorStore(s => s.searchDevices)
  const facilityId = useIndoorStore(s => s.facilityId)
  const loadFacilityData = useIndoorStore(s => s.loadFacilityData)

  // Keep CCTV list synced (no-op if already loaded)
  useSyncCctvs()

  // Ensure indoor data loaded if facility context exists but store empty
  useEffect(() => {
    if (facilityId && !useIndoorStore.getState().features.length) {
      loadFacilityData(facilityId)
    }
  }, [facilityId, loadFacilityData])

  const groups = useMemo<GroupSearchGroup<IndoorSearchItem>[]>(() => {
    const result = searchDevices(query)
    return result.map(({ category, items }) => ({ heading: category, items }))
  }, [searchDevices, query])

  const handleSelect = useCallback((item: IndoorSearchItem) => {
    setQuery('')
    formRef.current?.close()
    if (item.feature?.id) {
      Camera.MoveToPoi(String(item.feature.id), 0.5, 1)
    }
    // item may be device or cctv; ensure shape matches callback union
  onDeviceSelect?.(item)
  }, [onDeviceSelect])

  return (
    <div ref={searchRef} className={['relative w-96', className || ''].join(' ').trim()}>
      <GroupSearchForm<IndoorSearchItem>
        ref={formRef}
        value={query}
        onValueChange={setQuery}
        groups={groups}
        placeholder="카테고리, 디바이스/CCTV명, 또는 ID로 검색..."
        getItemKey={(item) => String(item.id)}
        renderItem={(item) => {
          const isCctv = item.__kind === 'cctv'
          return (
            <div className="flex w-full items-center justify-between">
              <span className="truncate max-w-[70%]">{String(item.name ?? item.id)}</span>
              <span className={['text-xs', isCctv ? 'text-red-500' : 'text-blue-600'].join(' ')}>
                {isCctv ? 'CCTV' : String(item.id)}
              </span>
            </div>
          )
        }}
        onSelect={handleSelect}
      />
    </div>
  )
}

export default IndoorSearchForm
