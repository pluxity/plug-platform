import { create } from 'zustand';

import { getCctvsByFacility, getFeaturesByFacility, getDevices } from '@plug/common-services';
import type { FeatureResponse, DeviceResponse, CctvResponse } from '@plug/common-services';
export interface IndoorState {
  facilityId: number | null;
  features: FeatureResponse[];
  devices: DeviceResponse[];
  cctvs: CctvResponse[];
  loading: boolean;
  error: string | null;
}

export interface IndoorActions {
  loadFacilityData: (facilityId: number) => Promise<void>;
  loadFeatures: (facilityId: number) => Promise<void>;
  loadDevices: (facilityId: number, options?: { force?: boolean }) => Promise<void>;
  loadCctvs: (facilityId: number, options?: { force?: boolean }) => Promise<void>;

  setDevices: (devices: DeviceResponse[]) => void;
  setFeatures: (features: FeatureResponse[]) => void;
  setCctvs: (cctvs: CctvResponse[]) => void;

  findDeviceByFeatureId: (featureId: string) => DeviceResponse | undefined;
  findFeatureByDeviceId: (deviceId: string) => FeatureResponse | undefined;
  findCctvByFeatureId: (featureId: string) => CctvResponse | undefined;
  findByCategoryId: (categoryId: number | null) => IndoorSearchItem[];
  searchDevices: (query: string) => { category: string; items: IndoorSearchItem[] }[];
  
  reset: () => void;
}

export type IndoorSearchItem = (DeviceResponse & { __kind?: 'device' }) | (CctvResponse & { __kind: 'cctv' });

export type IndoorStore = IndoorState & IndoorActions;

let loadingPromise: Promise<void> | null = null;
let devicesLoadingPromise: Promise<void> | null = null;
let cctvsLoadingPromise: Promise<void> | null = null;

export const useIndoorStore = create<IndoorStore>()((set, get) => ({
  facilityId: null,
  features: [],
  devices: [],
  cctvs: [],
  loading: false,
  error: null,

  async loadFacilityData(facilityId: number) {
    const { facilityId: current, loading } = get();
    if (loading && loadingPromise) return loadingPromise;
    if (current === facilityId && get().features.length) return;
    set({ loading: true, error: null, facilityId });
    loadingPromise = (async () => {
      const featuresPromise = getFeaturesByFacility(facilityId);
      const devicesPromise = getDevices(facilityId);
      const combinedError: string[] = [];
      try {
        const features = await featuresPromise;
        set({ features });
      } catch (e) {
        combinedError.push(e instanceof Error ? e.message : 'Failed to load features');
      }
      try {
        const devices = await devicesPromise;
        set({ devices });
      } catch (e) {
        combinedError.push(e instanceof Error ? e.message : 'Failed to load devices');
      }
      if (combinedError.length) {
        set({ error: combinedError.join('; ') });
      }
      set({ loading: false });
      loadingPromise = null;
    })();
    return loadingPromise;
  },
  async loadFeatures(facilityId: number) {
    if (get().facilityId !== facilityId) set({ facilityId });
    if (get().features.length && get().facilityId === facilityId) return;
    try {
      const features = await getFeaturesByFacility(facilityId);
      set({ features });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Failed to load features' });
    }
  },
  async loadDevices(facilityId: number, options?: { force?: boolean }) {
    const { force } = options || {};
    const state = get();
    if (devicesLoadingPromise) return devicesLoadingPromise;
    if (!force && state.facilityId === facilityId && state.devices.length) return;
    if (state.facilityId !== facilityId) set({ facilityId });
    devicesLoadingPromise = (async () => {
      try {
        const devices = await getDevices(facilityId);
        set({ devices });
      } catch (e) {
        set({ error: e instanceof Error ? e.message : 'Failed to load devices' });
      } finally {
        devicesLoadingPromise = null;
      }
    })();
    return devicesLoadingPromise;
  },
  async loadCctvs(facilityId: number, options?: { force?: boolean }) {
    const { force } = options || {};
    const state = get();
    if (cctvsLoadingPromise) return cctvsLoadingPromise;
    if (!force && state.facilityId === facilityId && state.cctvs.length) return;
    if (state.facilityId !== facilityId) set({ facilityId });
    cctvsLoadingPromise = (async () => {
      try {
        const cctvs = await getCctvsByFacility(facilityId);
        set({ cctvs });
      } catch (e) {
        set({ error: e instanceof Error ? e.message : 'Failed to load cctvs' });
      } finally {
        cctvsLoadingPromise = null;
      }
    })();
    return cctvsLoadingPromise;
  },
  setDevices: (devices) => set({ devices }),
  setFeatures: (features) => set({ features }),
  setCctvs: (cctvs) => set({ cctvs }),
  findDeviceByFeatureId: (featureId) => get().devices.find((d) => d.feature?.id === featureId),
  findFeatureByDeviceId: (deviceId) => {
    if (!deviceId) return undefined;
    const devices = get().devices.filter((d) => d.id === deviceId);
    if (!devices.length) return undefined;
    for (const dev of devices) {
      const fid = dev.feature?.id;
      if (!fid) continue;
      const feature = get().features.find((f) => f.id === fid);
      if (feature) return feature;
    }
    return undefined;
  },
  findCctvByFeatureId: (featureId) => get().cctvs.find((c) => c.feature?.id === featureId),
  searchDevices: (query: string) => {
    const normalizeText = (value: unknown) => (value ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFC');
    const q = normalizeText(query);
    if (q.length < 1) return [];
    const deviceList = get().devices;
    const cctvList = get().cctvs;
    const filteredDevices = deviceList.filter((device) => {
      const name = normalizeText(device.name);
      const id = normalizeText(device.id);
      const category = normalizeText(device.deviceCategory?.name);
      return name.includes(q) || id.includes(q) || category.includes(q);
    });
    const filteredCctvs = cctvList.filter((cctv) => {
      const name = normalizeText(cctv.name);
      const id = normalizeText(cctv.id);
      return name.includes(q) || id.includes(q);
    });

    const grouped = new Map<string, IndoorSearchItem[]>();
    for (const device of filteredDevices) {
      const category = device.deviceCategory?.name || '미분류';
      if (!grouped.has(category)) grouped.set(category, []);
      grouped.get(category)!.push({ ...device, __kind: 'device' });
    }
    if (filteredCctvs.length) {
      grouped.set('CCTV', filteredCctvs.map((c) => ({ ...c, __kind: 'cctv' as const })));
    }
    for (const list of grouped.values()) {
      list.sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)));
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({ category, items }));
  },
  findByCategoryId: (categoryId: number | null) => {
    if (categoryId == null) return [];
    if (categoryId === -1) {
      return get().cctvs.map((c) => ({ ...c, __kind: 'cctv' as const }));
    }
    return get().devices
      .filter((d) => d.deviceCategory?.id === categoryId)
      .map((d) => ({ ...d, __kind: 'device' as const }));
  },
  reset: () => set({ facilityId: null, features: [], devices: [], cctvs: [], error: null, loading: false }),
}))

