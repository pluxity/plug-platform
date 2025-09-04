import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { facilityService } from '@plug/common-services';
import type { FacilityResponse, FacilityType } from '@plug/common-services';

const isValidFacility = (f: unknown): f is FacilityResponse => {
  if (!f || typeof f !== 'object') return false;
  const obj = f as Record<string, unknown>;
  return typeof obj.id === 'number' && typeof obj.name === 'string';
};
interface FacilityState {
  facilities: FacilityResponse[];
  error: string | null;
  selectedFacility: FacilityResponse | null;
  facilitiesFetched: boolean;
  isLoading: boolean;
  lastFetched: number | null;
  staleAfterMs: number;
}

interface LoadFacilitiesOptions {
  force?: boolean;
  ignoreStale?: boolean;
}

interface FacilityActions {
  setFacilities: (facilities: FacilityResponse[]) => void;
  setError: (error: string | null) => void;
  setSelectedFacility: (facility: FacilityResponse | null) => void;
  setFacilitiesFetched: (fetched: boolean) => void;
  
  getAllFacilities: () => FacilityResponse[];
  getFacilityById: (id: number) => FacilityResponse | undefined;
  getFacilitiesByType: (type: FacilityType) => FacilityResponse[];
  loadFacilities: (options?: LoadFacilitiesOptions) => Promise<void> | undefined;
  
  refreshFacilities: () => Promise<void> | undefined;
  isStale: () => boolean;
}

type FacilityStore = FacilityState & FacilityActions;

let loadFacilitiesPromise: Promise<void> | null = null;

export const useFacilityStore = create<FacilityStore>()(
  devtools(
    (set, get) => ({
      facilities: [],
      error: null,
      selectedFacility: null,
      facilitiesFetched: false,
      isLoading: false,
      lastFetched: null,
      staleAfterMs: 5 * 60 * 1000,

      setFacilities: (facilities) => set({ facilities }),
      setError: (error) => set({ error }),
      setSelectedFacility: (selectedFacility) => set({ selectedFacility }),
      setFacilitiesFetched: (facilitiesFetched) => set({ facilitiesFetched }),

      getAllFacilities: () => get().facilities,
      getFacilityById: (id) => get().facilities.find((f) => f.id === id),
      getFacilitiesByType: (type: FacilityType) =>
        get().facilities.filter((f): f is FacilityResponse & { type: FacilityType } => f.type === type),
      isStale: () => {
        const { lastFetched, staleAfterMs, facilitiesFetched } = get();
        if (!facilitiesFetched || !lastFetched) return true;
        return Date.now() - lastFetched > staleAfterMs;
      },

      loadFacilities: async (options?: LoadFacilitiesOptions) => {
        const { facilitiesFetched, isLoading } = get();
        const stale = get().isStale();
        const force = options?.force === true;
        const ignoreStale = options?.ignoreStale === true;

        if (!force) {
          if (facilitiesFetched && (!stale || ignoreStale)) return;
        }
        if (isLoading && loadFacilitiesPromise) return loadFacilitiesPromise;

        set({ isLoading: true, error: null });

        loadFacilitiesPromise = (async () => {
          try {
            const response = await facilityService.getAllFacilities();
            const raw = Array.isArray(response.data) ? response.data : [];
            const list = raw.filter(isValidFacility);
            set({ facilities: list, facilitiesFetched: true, lastFetched: Date.now() });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to load facilities' });
          } finally {
            set({ isLoading: false });
            loadFacilitiesPromise = null;
          }
        })();

        return loadFacilitiesPromise;
      },
      refreshFacilities: () => get().loadFacilities({ force: true }),
    }),
    { name: 'facility-store' },
  ),
);

