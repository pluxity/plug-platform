import { create } from 'zustand'
import { api, type DataResponseBody } from '@plug/api-hooks'
import type { GsDeviceResponse } from '@plug/common-services'

export type DeviceLite = { id: string; name?: string | null }

interface DeviceState {
  devices: GsDeviceResponse[]
  devicesFetched: boolean
  isLoading: boolean
  error: string | null
  setDevices: (devices: GsDeviceResponse[]) => void
  setFetched: (fetched: boolean) => void
  loadOnce: () => Promise<void>
}

export const useDeviceStore = create<DeviceState>()((set, get) => ({
  devices: [],
  devicesFetched: false,
  isLoading: false,
  error: null,
  setDevices: (devices) => set({ devices }),
  setFetched: (devicesFetched) => set({ devicesFetched }),
  loadOnce: async () => {
    const { devicesFetched, isLoading } = get()
    if (devicesFetched || isLoading) return
    set({ isLoading: true, error: null })
    try {
  const resp = await api.get<GsDeviceResponse[]>('devices', { requireAuth: true }) as unknown as DataResponseBody<GsDeviceResponse[]>
  const list = resp?.data ?? []
  set({ devices: list, devicesFetched: true, isLoading: false })
    } catch (e) {
      set({ error: (e as Error)?.message ?? 'Failed to load devices', isLoading: false })
    }
  }
}))
