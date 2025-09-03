import { useCallback, useEffect, useRef } from 'react'
import { Camera, Poi, Interfaces, Event } from '@plug/engine'
import type { FeatureResponse } from '@plug/common-services'
import { useIndoorStore } from '@/app/store/indoorStore'

interface UseIndoorEngineParams {
  facilityId?: number | null
  features?: FeatureResponse[] // Optional external override (e.g., pre-fetched)
  assets: { id: number; file?: { url?: string } }[] | undefined
  autoExtendView?: boolean
  onPoiPointerUp?: ((evt: unknown) => void) | Array<(evt: unknown) => void>
}

interface UseIndoorEngineReturn { handleLoadComplete: () => void }

export function useIndoorEngine({
  facilityId,
  features: externalFeatures,
  assets,
  autoExtendView = true,
  onPoiPointerUp
}: UseIndoorEngineParams): UseIndoorEngineReturn {
  const importedRef = useRef(false)
  const engineReadyRef = useRef(false)
  const poiPointerUpCallbacksRef = useRef<Array<(evt: unknown) => void>>([])
  const listenerRegisteredRef = useRef(false)
  const storeFeatures = useIndoorStore(s => s.features)
  const loadFeatures = useIndoorStore(s => s.loadFeatures)
  // Note: device & CCTV 로딩은 외부(UI) 컴포넌트에서 수행 (검색/임베딩 용도)
  
  useEffect(() => {
    if (!onPoiPointerUp) {
      poiPointerUpCallbacksRef.current = []
    } else {
      poiPointerUpCallbacksRef.current = Array.isArray(onPoiPointerUp) ? onPoiPointerUp : [onPoiPointerUp]
    }
  }, [onPoiPointerUp])
  
  const poiPointerUpListener = useCallback((event: unknown) => {
    for (const callback of poiPointerUpCallbacksRef.current) {
      try { 
        callback(event) 
      } catch (e) { 
        console.error('Error in onPoiPointerUp callback:', e) 
      }
    }
  }, [])

  const activeFeatures = externalFeatures && externalFeatures.length ? externalFeatures : storeFeatures

  const buildPoiData = useCallback((): Interfaces.PoiImportOption[] => {
    if (!activeFeatures?.length || !assets?.length) return []
    const assetById = new Map(assets.map(assetItem => [assetItem.id, assetItem]))
    return activeFeatures.map(feature => {
      const assetRecord = assetById.get(feature.assetId)
      return {
        id: feature.id,
        iconUrl: '',
        modelUrl: assetRecord?.file?.url || '',
        htmlString: '',
        floorId: feature.floorId,
        property: { assetId: feature.assetId },
        position: { x: feature.position?.x ?? 0, y: feature.position?.y ?? 0, z: feature.position?.z ?? 0 },
        rotation: { x: feature.rotation?.x ?? 0, y: feature.rotation?.y ?? 0, z: feature.rotation?.z ?? 0 },
        scale: { x: feature.scale?.x ?? 1, y: feature.scale?.y ?? 1, z: feature.scale?.z ?? 1 }
      }
    })
  }, [activeFeatures, assets])

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
    tryImportPois()
  }, [autoExtendView, tryImportPois])

  useEffect(() => {
    if (!listenerRegisteredRef.current) {
      Event.AddEventListener('onPoiPointerUp', poiPointerUpListener)
      listenerRegisteredRef.current = true
    }
    return () => {
      if (listenerRegisteredRef.current) {
        Event.RemoveEventListener('onPoiPointerUp', poiPointerUpListener)
        listenerRegisteredRef.current = false
      }
    }
  }, [poiPointerUpListener])

  useEffect(() => {
    importedRef.current = false
    tryImportPois()
  }, [activeFeatures, assets, tryImportPois])

  // Ensure features loaded before attempting import
  useEffect(() => {
    if (!facilityId) return
    if (!externalFeatures?.length && !storeFeatures.length) {
      loadFeatures(facilityId)
    }
  }, [facilityId, externalFeatures, storeFeatures.length, loadFeatures])
  
  // (cleanup moved into listener registration effect above)

  return { handleLoadComplete }
}
