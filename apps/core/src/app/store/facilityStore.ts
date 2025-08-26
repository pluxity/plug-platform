import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { facilityService } from '@plug/common-services'
import type { FacilityResponse, FacilityType } from '@plug/common-services'

interface FacilityState {
  facilities: FacilityResponse[]
  error: string | null
  selectedFacility: FacilityResponse | null
  facilitiesFetched: boolean
  isLoading: boolean
}

interface FacilityActions {
  setFacilities: (facilities: FacilityResponse[]) => void
  setError: (error: string | null) => void
  setSelectedFacility: (facility: FacilityResponse | null) => void
  setFacilitiesFetched: (fetched: boolean) => void
  getAllFacilities: () => FacilityResponse[]
  getFacilityById: (id: number) => FacilityResponse | undefined
  getFacilitiesByType: (type: FacilityType) => FacilityResponse[]
  loadFacilities: () => Promise<void>
}

type FacilityStore = FacilityState & FacilityActions

let loadFacilitiesPromise: Promise<void> | null = null

export const useFacilityStore = create<FacilityStore>()(
  devtools(
    (set, get) => ({
      facilities: [],
      error: null,
      selectedFacility: null,
      facilitiesFetched: false,
      isLoading: false,

      setFacilities: (facilities) => set({ facilities }),
      setError: (error) => set({ error }),
      setSelectedFacility: (selectedFacility) => set({ selectedFacility }),
      setFacilitiesFetched: (facilitiesFetched) => set({ facilitiesFetched }),

      getAllFacilities: () => get().facilities,
      getFacilityById: (id) => get().facilities.find(f => f.id === id),
      getFacilitiesByType: (type: FacilityType) => get().facilities.filter(f => (f as FacilityResponse & { type?: FacilityType }).type === type),

      loadFacilities: async () => {
        const { facilitiesFetched, isLoading } = get()
        if (facilitiesFetched) return
        if (isLoading && loadFacilitiesPromise) return loadFacilitiesPromise

        set({ isLoading: true, error: null })

        loadFacilitiesPromise = (async () => {
          try {
            const response = await facilityService.getAllFacilities()
            const list = Array.isArray(response.data) ? (response.data as FacilityResponse[]) : []
            set({ facilities: list, facilitiesFetched: true })
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to load facilities' })
          } finally {
            set({ isLoading: false })
            loadFacilitiesPromise = null
          }
        })()

        return loadFacilitiesPromise
      }
    }),
    { name: 'facility-store' }
  )
)

