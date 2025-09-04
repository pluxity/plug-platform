import React, { useEffect, useCallback, useState, useRef } from 'react'
import type { DeviceResponse, FacilityType } from '@plug/common-services'
import { Poi } from '@plug/engine'

import { MapScene } from '@/global/components/indoor-map'
import { useAssets } from '@/global/store/assetStore'

import { useFacilityStore } from '@/app/store/facilityStore'
import { useIndoorStore } from '@/app/store/indoorStore'
import type { IndoorSearchItem } from '@/app/store/indoorStore'

import { useIndoorEngine, useIndoorFacilityData, usePoiEmbeddedWebRTC } from '@/app/view/hooks'
import { getDeviceLatestNormalized } from '@/global/services'

import IndoorSearchForm from './IndoorSearchForm'
import DeviceCategoryChips from './DeviceCategoryChips'
import { DeviceInfoDialog } from '../dialogs'

interface IndoorMapProps { facilityId: number; facilityType: FacilityType; onGoOutdoor?: () => void }

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityId, facilityType, onGoOutdoor }) => {
  const facilitiesFetched = useFacilityStore(s => s.facilitiesFetched)
  const { assets } = useAssets()
  const { features, floors, has3DDrawing, isLoading, countdown, modelUrl, handleOutdoor } = useIndoorFacilityData({ facilityId, facilityType, onGoOutdoor })
  const loadCctvs = useIndoorStore(s => s.loadCctvs)
  const loadDevices = useIndoorStore(s => s.loadDevices)
  useEffect(() => {
    if (facilityId) {
      loadDevices(facilityId)
      loadCctvs(facilityId)
    }
  }, [facilityId, loadDevices, loadCctvs])

  const { onPoiPointerUp: embeddedHandler } = usePoiEmbeddedWebRTC({
  onError: () => {},
    resolvePath: evt => {
      const target = (evt as { target?: { property?: { deviceId?: string | number | null; deviceID?: string | number | null } } }).target
      const raw = target?.property?.deviceId ?? target?.property?.deviceID
      return raw != null ? String(raw) : undefined
    }
  })

  const { handleLoadComplete, handlePoiSelect } = useIndoorEngine({
    facilityId,
  features,
    assets,
    autoExtendView: true,
  onShowCctv: (target) => { embeddedHandler({ target }) },
    onShowDevice: (device) => {
      setSelectedDevice(device)
    }
  })

  const handleOutdoorClick = useCallback(() => { handleOutdoor() }, [handleOutdoor])

  useEffect(() => () => { handleOutdoor() }, [handleOutdoor])

  const [selectedDevice, setSelectedDevice] = useState<DeviceResponse | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const findByCategoryId = useIndoorStore(s => s.findByCategoryId)
  const highlightedFeatureIdsRef = useRef<string[]>([])
  const latestCacheRef = useRef<Record<string, { metrics: Record<string, { value: number | string | null; unit?: string }>; ts: number }>>({})

  interface DeviceLatestLike { value?: number | string | null; val?: number | string | null; unit?: string }
  interface DeviceLike extends Partial<DeviceResponse> { data?: { latest?: DeviceLatestLike; latestValue?: number | string | null }; latest?: DeviceLatestLike; latestValue?: number | string | null; unit?: string }
  const buildDeviceLabelHtml = useCallback((device: DeviceLike) => {
    const cache = device.id ? latestCacheRef.current[device.id] : undefined
    const metrics = cache?.metrics && Object.keys(cache.metrics).length ? cache.metrics : null
    if (!metrics) {
      const fallback = (device.name || '—').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `<span class="inline-block select-none pointer-events-none transform -translate-y-6 text-[11px] font-medium tracking-wide text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] whitespace-nowrap px-1.5 py-0.5 rounded bg-black/20 backdrop-blur-[2px]">${fallback}</span>`
    }
    const entries = Object.entries(metrics)
    const picked = entries.slice(0, 3)
    const parts = picked.map(([, v]) => {
      const val = v.value == null ? '-' : (typeof v.value === 'number' ? (Number.isFinite(v.value) ? v.value.toFixed(1).replace(/\.0$/, '') : String(v.value)) : String(v.value))
      const unit = v.unit ? v.unit : ''
      return (val + unit).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    })
    const label = parts.join(' / ') || (device.name || '—')
    return `<span class="inline-block select-none pointer-events-none transform -translate-y-6 text-[11px] font-medium tracking-wide text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] whitespace-nowrap px-1.5 py-0.5 rounded bg-black/30 backdrop-blur-[2px]">${label}</span>`
  }, [])

  const clearHighlights = useCallback(() => {
    highlightedFeatureIdsRef.current.forEach(fid => {
      Poi.SetTextInnerHtml(fid, '')
    })
    highlightedFeatureIdsRef.current = []
  }, [])

  const fetchLatestForDevices = useCallback(async (devices: DeviceLike[]) => {
    const now = Date.now()
  const freshThreshold = 55_000
    const toFetch = devices.filter(d => {
      const id = d.id || ''
      if (!id) return false
      const cached = latestCacheRef.current[id]
      return !cached || (now - cached.ts) > freshThreshold
    })
    if (!toFetch.length) return
    const limit = 5
    let index = 0
    const runBatch = async () => {
      while (index < toFetch.length) {
        const slice = toFetch.slice(index, index + limit)
        index += limit
        await Promise.all(slice.map(async d => {
          if (!d.id || !d.companyType || !d.deviceType) return
          try {
            const latestMap = await getDeviceLatestNormalized(d.companyType, d.deviceType, d.id)
      const prev = latestCacheRef.current[d.id]
            // shallow compare first three metric entries to decide if changed
            let changed = false
            const newKeys = Object.keys(latestMap)
            if (!prev) {
              changed = true
            } else {
              const prevMetrics = prev.metrics
              for (let i = 0; i < Math.min(newKeys.length, 3); i++) {
                const k = newKeys[i]
        const latestEntry = (latestMap as Record<string, { value: number | string | null; unit?: string } >)[k]
        if (!prevMetrics[k] || prevMetrics[k].value !== latestEntry?.value || prevMetrics[k].unit !== latestEntry?.unit) {
                  changed = true; break
                }
              }
              if (!changed && Object.keys(prevMetrics).length !== newKeys.length) changed = true
            }
            latestCacheRef.current[d.id] = { metrics: latestMap, ts: Date.now() }
            if (changed) {
              const featureId = d.feature?.id
              if (featureId) {
                try { Poi.SetTextInnerHtml(featureId, buildDeviceLabelHtml(d)) } catch { /* ignore */ }
              }
            }
          } catch { /* ignore fetch error */ }
        }))
      }
    }
    await runBatch()
  }, [buildDeviceLabelHtml])

  const applyCategoryHighlight = useCallback(async (categoryId: number | null) => {
    clearHighlights()
    if (categoryId == null) return
    const items = findByCategoryId(categoryId) as DeviceLike[]
    const featureIds: string[] = []
    items.forEach(item => {
      const featureId = item.feature?.id
      if (!featureId) return
      featureIds.push(featureId)
      Poi.SetTextInnerHtml(featureId, buildDeviceLabelHtml(item))
    })
    highlightedFeatureIdsRef.current = featureIds
    await fetchLatestForDevices(items)
    items.forEach(item => {
      const featureId = item.feature?.id
      if (!featureId) return
      Poi.SetTextInnerHtml(featureId, buildDeviceLabelHtml(item))
    })
  }, [findByCategoryId, clearHighlights, buildDeviceLabelHtml, fetchLatestForDevices])

  const handleCategorySelect = useCallback((id: number | null) => {
    setSelectedCategoryId(id)
    applyCategoryHighlight(id) // single immediate fetch + render
  }, [applyCategoryHighlight])

  const handleCategoryDeselect = useCallback(() => {
    setSelectedCategoryId(null)
    clearHighlights()
  }, [clearHighlights])

  useEffect(() => {
    if (selectedCategoryId == null) return
    const interval = setInterval(() => {
      applyCategoryHighlight(selectedCategoryId)
    }, 60_000)
    return () => clearInterval(interval)
  }, [selectedCategoryId, applyCategoryHighlight])

  const handleSearchSelect = useCallback((item: IndoorSearchItem) => {
    const featureId = item.feature?.id
    if (featureId) {
      handlePoiSelect({ id: featureId, property: { deviceId: item.id } })
      return
    }
    if (item.__kind === 'cctv') {
      console.warn('[IndoorMap] CCTV has no feature mapping; cannot embed stream:', item.id)
      return
    }
    setSelectedDevice(item as DeviceResponse)
  }, [handlePoiSelect])

  if (!facilitiesFetched || isLoading || has3DDrawing === null) {
    return (
      <div className='w-full h-full relative flex items-center justify-center bg-gray-900'>
        <div className='text-center text-white'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4'></div>
          <p className='text-lg'>{!facilitiesFetched || isLoading ? '시설 정보를 불러오는 중...' : '3D 도면을 확인하는 중...'}</p>
        </div>
      </div>
    )
  }

  if (!has3DDrawing) {
    return (
      <div className='w-full h-full relative flex items-center justify-center bg-gray-900'>
        <div className='text-center text-white'>
          <div className='mb-6'>
            <svg className='w-16 h-16 mx-auto mb-4 text-yellow-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z' />
            </svg>
            <h2 className='text-2xl font-bold mb-2'>3D 도면이 없습니다</h2>
            <p className='text-lg mb-6'>잠시 뒤에 실외로 전환됩니다...</p>
            <div className='text-4xl font-bold text-yellow-400 mb-4'>{countdown}</div>
          </div>
          <button onClick={handleOutdoorClick} title='실외 지도로 나가기' className='relative px-6 py-3 bg-blue-600 text-white rounded-xl font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-blue-900/20 pointer-events-auto' style={{ zIndex: 60 }}>
            <span className='inline-flex items-center gap-2'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2} aria-hidden>
                <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
              </svg>
              <span>지금 실외로 나가기</span>
            </span>
          </button>
        </div>
      </div>
    )
  }

  const overlays = (
    <div className='absolute top-4 left-4 z-20 flex flex-row gap-3 items-start'>
      <IndoorSearchForm
        className='pointer-events-auto'
        onDeviceSelect={handleSearchSelect}
      />
      <DeviceCategoryChips
        selectedId={selectedCategoryId}
        onSelect={handleCategorySelect}
        onDeselect={handleCategoryDeselect}
      />
    </div>
  )

  return (
    <>
  {/* 실외로 나가기 버튼은 MainMap 에서 커스텀 레이아웃과 함께 표시하기 위해 비활성화 */}
  <MapScene modelUrl={modelUrl} floors={floors} onLoadComplete={handleLoadComplete} onOutdoor={handleOutdoorClick} overlays={overlays} showOutdoorButton={false} />
      {selectedDevice && (
        <DeviceInfoDialog device={selectedDevice} hole={false} onClose={() => setSelectedDevice(null)} />
      )}
    </>
  )
};

export default IndoorMap;
