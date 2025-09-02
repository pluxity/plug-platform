import { create } from 'zustand'
import { useEffect } from 'react'
import type { FeatureResponse, DeviceResponse, CctvResponse } from '@plug/common-services'
import { getFeaturesByFacility } from '@plug/common-services'
import { getDevices } from '@plug/common-services'
import { useCctvSWR } from '@plug/common-services'

// Indoor related aggregated data (features + devices + cctvs) per facility

export interface IndoorState {
  facilityId: number | null
  features: FeatureResponse[]
  devices: DeviceResponse[]
  cctvs: CctvResponse[]
  loading: boolean
  error: string | null
}

export interface IndoorActions {
  loadFacilityData: (facilityId: number) => Promise<void>
  setDevices: (devices: DeviceResponse[]) => void
  setFeatures: (features: FeatureResponse[]) => void
  setCctvs: (cctvs: CctvResponse[]) => void
  findDeviceByFeatureId: (featureId: string) => DeviceResponse | undefined
  findFeatureByDeviceId: (deviceId: string) => FeatureResponse | undefined
  findCctvByFeatureId: (featureId: string) => CctvResponse | undefined
  searchDevices: (query: string) => { category: string; items: IndoorSearchItem[] }[]
  findByCategoryId: (categoryId: number | null) => IndoorSearchItem[]
  reset: () => void
}

export type IndoorSearchItem = (DeviceResponse & { __kind?: 'device' }) | (CctvResponse & { __kind: 'cctv' })

export type IndoorStore = IndoorState & IndoorActions

let loadingPromise: Promise<void> | null = null

export const useIndoorStore = create<IndoorStore>()((set, get) => ({
  facilityId: null,
  features: [],
  devices: [],
  cctvs: [],
  loading: false,
  error: null,

  async loadFacilityData(facilityId: number) {
    const { facilityId: current, loading } = get()
    if (loading && loadingPromise) return loadingPromise
    if (current === facilityId && get().features.length) return
    set({ loading: true, error: null, facilityId })
    loadingPromise = (async () => {
      try {
        const [features, devices] = await Promise.all([
          getFeaturesByFacility(facilityId),
          getDevices(facilityId),
        ])
        set({ features: features, devices: devices })

      } catch (e) {
        set({ error: e instanceof Error ? e.message : 'Failed to load indoor data' })
      } finally {
        set({ loading: false })
        loadingPromise = null
      }
    })()
    return loadingPromise
  },
  setDevices: (devices) => set({ devices }),
  setFeatures: (features) => set({ features }),
  setCctvs: (cctvs) => set({ cctvs }),
  findDeviceByFeatureId: (featureId) => get().devices.find(d => d.feature?.id === featureId),
  findFeatureByDeviceId: (deviceId) => {
    if (!deviceId) return undefined
    const devices = get().devices.filter(d => d.id === deviceId)
    if (!devices.length) return undefined
    for (const dev of devices) {
      const fid = dev.feature?.id
      if (!fid) continue
      const feature = get().features.find(f => f.id === fid)
      if (feature) return feature
    }
    return undefined
  },
  findCctvByFeatureId: (featureId) => get().cctvs.find(c => c.feature?.id === featureId),
  searchDevices: (query: string) => {
    const normalizeText = (value: unknown) => (value ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFC')
    const q = normalizeText(query)
  if (q.length < 1) return []
    const deviceList = get().devices
    const cctvList = get().cctvs
    const filteredDevices = deviceList.filter(device => {
      const name = normalizeText(device.name)
      const id = normalizeText(device.id)
      const category = normalizeText(device.deviceCategory?.name)
      return name.includes(q) || id.includes(q) || category.includes(q)
    })
    const filteredCctvs = cctvList.filter(cctv => {
      const name = normalizeText(cctv.name)
      const id = normalizeText(cctv.id)
      return name.includes(q) || id.includes(q)
    })

    const grouped = new Map<string, IndoorSearchItem[]>()
    for (const device of filteredDevices) {
      const category = device.deviceCategory?.name || '미분류'
      if (!grouped.has(category)) grouped.set(category, [])
      grouped.get(category)!.push({ ...device, __kind: 'device' })
    }
    if (filteredCctvs.length) {
      grouped.set('CCTV', filteredCctvs.map(c => ({ ...c, __kind: 'cctv' as const })))
    }
    for (const list of grouped.values()) {
      list.sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)))
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({ category, items }))
  },
  findByCategoryId: (categoryId: number | null) => {
    if (categoryId == null) return []
    // Sentinel -1 => CCTV 전체
    if (categoryId === -1) {
      return get().cctvs.map(c => ({ ...c, __kind: 'cctv' as const }))
    }
    return get().devices
      .filter(d => d.deviceCategory?.id === categoryId)
      .map(d => ({ ...d, __kind: 'device' as const }))
  },
  reset: () => set({ facilityId: null, features: [], devices: [], cctvs: [], error: null, loading: false })
}))

// Optional helper hook to sync CCTV list via SWR when needed
export const useSyncCctvs = () => {
  const { data } = useCctvSWR()
  const setCctvs = useIndoorStore(s => s.setCctvs)
  useEffect(() => {
    const normalize = (input: unknown): CctvResponse[] => {
      if (Array.isArray(input)) return input as CctvResponse[]
      if (input && typeof input === 'object') {
        const inner = (input as { data?: unknown }).data
        if (Array.isArray(inner)) return inner as CctvResponse[]
      }
      return []
    }
    if (data !== undefined) {
      setCctvs(normalize(data))
    }
  }, [data, setCctvs])
}
