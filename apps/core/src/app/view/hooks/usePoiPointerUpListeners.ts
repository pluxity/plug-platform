import { useCallback, useMemo } from 'react'
import type { FeatureResponse, DeviceResponse, CctvResponse } from '@plug/common-services'
import { useIndoorStore } from '@/app/store/indoorStore'

export interface PoiPointerContext {
  rawEvent: unknown
  poiId: string
  deviceId?: string | number | null
  feature?: FeatureResponse
  device?: DeviceResponse | null
  cctv?: CctvResponse | null
}

export interface PoiPointerUpListener {
  id: string
  test: (context: PoiPointerContext) => boolean
  run: (context: PoiPointerContext) => void | Promise<void>
  stopOnHandled?: boolean
}

export function usePoiPointerUpListeners(params: { features: FeatureResponse[]; listeners: PoiPointerUpListener[] }) {
  const { features, listeners } = params
  const featureMap = useMemo(() => new Map(features.map(f => [f.id, f])), [features])
  const devices = useIndoorStore(s => s.devices)
  const cctvs = useIndoorStore(s => s.cctvs)
  // Maps for quick lookup by featureId (poiId)
  const deviceByFeatureId = useMemo(() => new Map(devices.filter(d => d.feature?.id).map(d => [d.feature!.id, d])), [devices])
  const cctvByFeatureId = useMemo(() => new Map(cctvs.filter(c => c.feature?.id).map(c => [c.feature!.id, c])), [cctvs])

  const onPoiPointerUp = useCallback((evt: unknown) => {
    const target = (evt as { target?: unknown } | null | undefined)?.target as { id?: string; property?: { deviceId?: string | number | null; deviceID?: string | number | null } } | undefined
    const poiId: string | undefined = target?.id
    if (!poiId) return
    const deviceId = target?.property?.deviceId ?? target?.property?.deviceID ?? null
    const feature = featureMap.get(poiId)
    const context: PoiPointerContext = {
      rawEvent: evt,
      poiId,
      deviceId,
      feature,
      device: feature ? (deviceByFeatureId.get(feature.id) || null) : null,
      cctv: feature ? (cctvByFeatureId.get(feature.id) || null) : null,
    }
    for (const listener of listeners) {
      let matched = false
      try { matched = listener.test(context) } catch { continue }
      if (!matched) continue
      try { listener.run(context) } catch (err) { console.error(`poi listener ${listener.id} error`, err) }
      if (listener.stopOnHandled !== false) break
    }
  }, [listeners, featureMap, deviceByFeatureId, cctvByFeatureId])

  return { onPoiPointerUp }
}

export default usePoiPointerUpListeners
