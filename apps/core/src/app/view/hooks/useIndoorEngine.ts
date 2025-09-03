import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Camera, Poi, Interfaces, Event } from '@plug/engine'
import type { FeatureResponse, DeviceResponse, CctvResponse } from '@plug/common-services'
import { useIndoorStore } from '@/app/store/indoorStore'

interface UseIndoorEngineParams {
  facilityId?: number | null
  features?: FeatureResponse[] // Optional external override (e.g., pre-fetched)
  assets: { id: number; file?: { url?: string } }[] | undefined
  autoExtendView?: boolean
  // onShowCctv: full enriched target( feature / device / cctv 포함 )을 그대로 전달
  onShowCctv?: (target: PoiTarget & { feature?: FeatureResponse; device?: DeviceResponse | null; cctv?: CctvResponse | null }) => void
  onShowDevice?: (device: DeviceResponse, context: { poiId: string; feature?: FeatureResponse }) => void
}

interface UseIndoorEngineReturn {
  handleLoadComplete: () => void
  handlePoiSelect: (target: PoiTarget | undefined | null) => void
}

interface PoiTargetProperty {
  deviceId?: string | number | null
  deviceID?: string | number | null
  [k: string]: unknown
}

interface PoiTarget { id?: string; property?: PoiTargetProperty }

export function useIndoorEngine({
  facilityId,
  features: externalFeatures,
  assets,
  autoExtendView = true,
  onShowCctv,
  onShowDevice
}: UseIndoorEngineParams): UseIndoorEngineReturn {
  const importedRef = useRef(false)
  const engineReadyRef = useRef(false)
  const storeFeatures = useIndoorStore(s => s.features)
  const loadFeatures = useIndoorStore(s => s.loadFeatures)
  const devices = useIndoorStore(s => s.devices)
  const cctvs = useIndoorStore(s => s.cctvs)

  const activeFeatures = externalFeatures && externalFeatures.length ? externalFeatures : storeFeatures

  // Precompute maps for quick lookup
  const featureMap = useMemo(() => new Map(activeFeatures.map(f => [f.id, f])), [activeFeatures])
  const deviceByFeatureId = useMemo(() => new Map(devices.filter(d => d.feature?.id).map(d => [d.feature!.id, d])), [devices])
  const cctvByFeatureId = useMemo(() => new Map(cctvs.filter(c => c.feature?.id).map(c => [c.feature!.id, c])), [cctvs])

  const handlePoiSelect = useCallback((target: PoiTarget | undefined | null) => {
    const poiId = target?.id
    if (!poiId) return
    const feature = featureMap.get(poiId)
    const device = feature ? deviceByFeatureId.get(feature.id) || null : null
    const cctv = feature ? cctvByFeatureId.get(feature.id) || null : null
    // 사용 path 결정 (deviceId 우선, 없으면 CCTV id)
    const explicitDeviceId = target?.property?.deviceId ?? target?.property?.deviceID ?? null
    const path = explicitDeviceId != null ? String(explicitDeviceId) : (cctv ? String(cctv.id) : null)
    // onShowCctv 우선 처리: path 가 확보되었으면 target.property.deviceId 로 보정
    if (cctv && onShowCctv && path) {
      const enriched: PoiTarget & { feature?: FeatureResponse; device?: DeviceResponse | null; cctv?: CctvResponse | null } = {
        ...(target || {}),
        id: poiId,
        property: { ...(target?.property || {}), deviceId: path },
        feature,
        device,
        cctv
      }
      try { onShowCctv(enriched) } catch (e) { console.error('onShowCctv error', e) }
      return
    }
    if (device && onShowDevice) {
      try { onShowDevice(device, { poiId, feature }) } catch (e) { console.error('onShowDevice error', e) }
    }
  }, [featureMap, deviceByFeatureId, cctvByFeatureId, onShowCctv, onShowDevice])

  const poiPointerUpListener = useCallback((event: unknown) => {
    const target = (event as { target?: PoiTarget } | null | undefined)?.target
    handlePoiSelect(target)
  }, [handlePoiSelect])

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
    // 동일한 함수 참조를 등록/해제해야 누적되지 않음
    Event.AddEventListener('onPoiPointerUp', poiPointerUpListener)
    return () => {
      Event.RemoveEventListener('onPoiPointerUp', poiPointerUpListener)
    }
  }, [poiPointerUpListener])

  useEffect(() => {
    importedRef.current = false
    tryImportPois()
  }, [activeFeatures, assets, tryImportPois])

  useEffect(() => {
    if (!facilityId) return
    if (!externalFeatures?.length && !storeFeatures.length) {
      loadFeatures(facilityId)
    }
  }, [facilityId, externalFeatures, storeFeatures.length, loadFeatures])
  
  return { handleLoadComplete, handlePoiSelect }
}
