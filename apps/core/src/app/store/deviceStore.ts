import { create } from 'zustand'
import type { GsDeviceResponse } from '@plug/common-services'
import { getDevices } from '@plug/common-services'

interface DeviceState {
  devices: GsDeviceResponse[]
}

interface DeviceActions {
  setDevices: (devices: GsDeviceResponse[]) => void
  loadAll: () => Promise<void>
  searchDevices: (query: string) => { category: string; items: GsDeviceResponse[] }[]
}

type DeviceStore = DeviceState & DeviceActions

export const useDeviceStore = create<DeviceStore>()((set, get) => ({
  devices: [],
  setDevices: (devices) => set({ devices }),
  loadAll: async () => {
    const list = await getDevices()
    set({ devices: list ?? [] })
  },
  searchDevices: (query: string) => {
    const normalizeText = (value: unknown) => (value ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFC')

    const q = normalizeText(query)
    if (!q) return []

    const deviceList = get().devices

    const filtered = deviceList.filter((device) => {
      const name = normalizeText(device.name)
      const id = normalizeText(device.id)
      const category = normalizeText(device.deviceCategory?.name)
      return name.includes(q) || id.includes(q) || category.includes(q)
    })

    const grouped = new Map<string, GsDeviceResponse[]>()
    for (const device of filtered) {
      const category = device.deviceCategory?.name || '미분류'
      if (!grouped.has(category)) grouped.set(category, [])
      grouped.get(category)!.push(device)
    }

    for (const list of grouped.values()) {
      list.sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)))
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({ category, items }))
  },
}))
