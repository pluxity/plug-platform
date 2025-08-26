import { useCallback, useEffect, useRef } from 'react'
import { Camera, Poi, Interfaces } from '@plug/engine'
import type { FeatureResponse } from '@plug/common-services'

interface UseIndoorEngineParams {
  features: FeatureResponse[]
  assets: { id: number; file?: { url?: string } }[] | undefined
  autoExtendView?: boolean
}

interface UseIndoorEngineReturn { handleLoadComplete: () => void }

export function useIndoorEngine({ features, assets, autoExtendView = true }: UseIndoorEngineParams): UseIndoorEngineReturn {
  const importedRef = useRef(false)
  const engineReadyRef = useRef(false)

  const buildPoiData = useCallback((): Interfaces.PoiImportOption[] => {
    if (!features?.length || !assets?.length) return []
    const assetById = new Map(assets.map(a => [a.id, a]))
    return features.map(f => {
      const asset = assetById.get(f.assetId)
      return {
        id: f.id,
        iconUrl: '',
        modelUrl: asset?.file?.url || '',
        displayText: f.id,
        floorId: f.floorId,
        property: { assetId: f.assetId, deviceId: f.deviceId ?? null },
        position: { x: f.position?.x ?? 0, y: f.position?.y ?? 0, z: f.position?.z ?? 0 },
        rotation: { x: f.rotation?.x ?? 0, y: f.rotation?.y ?? 0, z: f.rotation?.z ?? 0 },
        scale: { x: f.scale?.x ?? 1, y: f.scale?.y ?? 1, z: f.scale?.z ?? 1 }
      }
    })
  }, [features, assets])

  const tryImportPois = useCallback(() => {
    if (importedRef.current) return
    if (!engineReadyRef.current) return
    const data = buildPoiData()
    if (!data.length) return
    try {
      Poi.Import(data)
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
    importedRef.current = false
    tryImportPois()
  }, [features, assets, tryImportPois])

  return { handleLoadComplete }
}
