import { useCallback, useMemo } from 'react'
import type { FeatureResponse } from '@plug/common-services'

export interface PoiPointerContext {
  rawEvent: unknown
  poiId: string
  deviceId?: string | number | null
  feature?: FeatureResponse
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

  const onPoiPointerUp = useCallback((evt: unknown) => {
    const target = (evt as { target?: unknown } | null | undefined)?.target as { id?: string; property?: { deviceId?: string | number | null; deviceID?: string | number | null } } | undefined
    const poiId: string | undefined = target?.id
    if (!poiId) return
    const deviceId = target?.property?.deviceId ?? target?.property?.deviceID ?? null
    const feature = featureMap.get(poiId)
    const context: PoiPointerContext = { rawEvent: evt, poiId, deviceId, feature }
    for (const listener of listeners) {
      let matched = false
      try { matched = listener.test(context) } catch { continue }
      if (!matched) continue
  try { listener.run(context) } catch (err) { console.error(`poi listener ${listener.id} error`, err) }
      if (listener.stopOnHandled !== false) break
    }
  }, [listeners, featureMap])

  return { onPoiPointerUp }
}

export default usePoiPointerUpListeners
