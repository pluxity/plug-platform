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
  
  useEffect(() => {
    if (!onPoiPointerUp) {
      poiPointerUpCallbacksRef.current = []
    } else {
      poiPointerUpCallbacksRef.current = Array.isArray(onPoiPointerUp) ? onPoiPointerUp : [onPoiPointerUp]
    }
  }, [onPoiPointerUp])
  
  const poiPointerUpListener = useCallback((event: unknown) => {
    for (const callback of poiPointerUpCallbacksRef.current) {
      try { callback(event) } catch { void 0 }
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
  
  useEffect(() => () => {
    if (listenerRegisteredRef.current) {
      Event.RemoveEventListener('onPoiPointerUp', poiPointerUpListener)
      listenerRegisteredRef.current = false
    }
  }, [poiPointerUpListener])

  return { handleLoadComplete }
}
