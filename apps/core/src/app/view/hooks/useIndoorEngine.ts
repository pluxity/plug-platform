import { useCallback, useEffect, useRef } from 'react'
import { Camera, Poi, Interfaces, Event } from '@plug/engine'
import type { FeatureResponse } from '@plug/common-services'

interface UseIndoorEngineParams {
  features: FeatureResponse[]
  assets: { id: number; file?: { url?: string } }[] | undefined
  autoExtendView?: boolean
  onPoiPointerUp?: ((evt: unknown) => void) | Array<(evt: unknown) => void>
}

interface UseIndoorEngineReturn { handleLoadComplete: () => void }

export function useIndoorEngine({
  features,
  assets,
  autoExtendView = true,
  onPoiPointerUp
}: UseIndoorEngineParams): UseIndoorEngineReturn {
  const importedRef = useRef(false)
  const engineReadyRef = useRef(false)
  const poiPointerUpCallbacksRef = useRef<Array<(evt: unknown) => void>>([])
  const listenerRegisteredRef = useRef(false)

  // 최신 콜백 배열 유지
  useEffect(() => {
    if (!onPoiPointerUp) {
      poiPointerUpCallbacksRef.current = []
    } else {
      poiPointerUpCallbacksRef.current = Array.isArray(onPoiPointerUp) ? onPoiPointerUp : [onPoiPointerUp]
    }
  }, [onPoiPointerUp])

  // 단일 리스너 (엔진 이벤트 그대로 전달)
  const poiPointerUpListener = useCallback((evt: unknown) => {
    for (const cb of poiPointerUpCallbacksRef.current) {
      try { cb(evt) } catch { /* ignore single callback failure */ }
    }
  }, [])

  const buildPoiData = useCallback((): Interfaces.PoiImportOption[] => {
    if (!features?.length || !assets?.length) return []
    const assetById = new Map(assets.map(assetItem => [assetItem.id, assetItem]))
    return features.map(feature => {
      const assetRecord = assetById.get(feature.assetId)
      return {
        id: feature.id,
        iconUrl: '',
        modelUrl: assetRecord?.file?.url || '',
        displayText: feature.id,
        floorId: feature.floorId,
        property: { assetId: feature.assetId, deviceId: feature.deviceId ?? null },
        position: { x: feature.position?.x ?? 0, y: feature.position?.y ?? 0, z: feature.position?.z ?? 0 },
        rotation: { x: feature.rotation?.x ?? 0, y: feature.rotation?.y ?? 0, z: feature.rotation?.z ?? 0 },
        scale: { x: feature.scale?.x ?? 1, y: feature.scale?.y ?? 1, z: feature.scale?.z ?? 1 }
      }
    })
  }, [features, assets])

  const tryImportPois = useCallback(() => {
    if (importedRef.current) return
    if (!engineReadyRef.current) return
    const poiData = buildPoiData()
    if (!poiData.length) return
    try {
      Poi.Import(poiData)
      importedRef.current = true
  } catch {
      return
    }
  }, [buildPoiData])

  const handleLoadComplete = useCallback(() => {
    engineReadyRef.current = true
    if (autoExtendView) Camera.ExtendView(1)
    if (!listenerRegisteredRef.current) {
      Event.AddEventListener('onPoiPointerUp', poiPointerUpListener)
      listenerRegisteredRef.current = true
    }
    tryImportPois()
  }, [autoExtendView, tryImportPois, poiPointerUpListener])

  useEffect(() => {
    importedRef.current = false
    tryImportPois()
  }, [features, assets, tryImportPois])

  // 언마운트 시 리스너 제거
  useEffect(() => () => {
    if (listenerRegisteredRef.current) {
      Event.RemoveEventListener('onPoiPointerUp', poiPointerUpListener)
      listenerRegisteredRef.current = false
    }
  }, [poiPointerUpListener])

  return { handleLoadComplete }
}
