import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { facilityService, domainUtils } from '@plug/common-services'
import type { FacilityResponse, FacilityType } from '@plug/common-services'

type FacilitiesData = Record<string, FacilityResponse[]>

interface FacilityState {
  facilities: FacilitiesData
  error: string | null
  selectedFacility: FacilityResponse | null
  facilitiesFetched: boolean
  isLoading: boolean
}

interface FacilityActions {
  setFacilities: (facilities: FacilitiesData) => void
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
      facilities: {},
      error: null,
      selectedFacility: null,
  facilitiesFetched: false,
  isLoading: false,

      setFacilities: (facilities) => set({ facilities }),
      setError: (error) => set({ error }),
      setSelectedFacility: (selectedFacility) => set({ selectedFacility }),
      setFacilitiesFetched: (facilitiesFetched) => set({ facilitiesFetched }),

      getAllFacilities: () => {
        const { facilities } = get()
        return Object.values(facilities)
          .filter(Array.isArray)
          .flat() as FacilityResponse[]
      },

      getFacilityById: (id) => {
        const { facilities } = get()
        const allFacilities = Object.values(facilities)
          .filter(Array.isArray)
          .flat() as FacilityResponse[]
        return allFacilities.find(facility => facility.id === id)
      },

      getFacilitiesByType: (type: FacilityType) => {
        const { facilities } = get()
        const endpointKey = domainUtils.getConfig(type).endpoint
        const list = facilities[endpointKey]
        return Array.isArray(list) ? list : []
      },

      loadFacilities: async () => {
        const { facilitiesFetched, isLoading } = get()
        if (facilitiesFetched) return
        if (isLoading && loadFacilitiesPromise) return loadFacilitiesPromise

        set({ isLoading: true, error: null })

        loadFacilitiesPromise = (async () => {
          try {
            const response = await facilityService.getAllFacilities()

            const flatList = Array.isArray(response.data) ? response.data : []
            const groupedByEndpoint: FacilitiesData = {}

            flatList.forEach((item) => {
              const itemType = (item as FacilityResponse & { type?: FacilityType }).type
              const endpoint = itemType ? domainUtils.getConfig(itemType).endpoint : domainUtils.getConfig('BUILDING').endpoint
              if (!groupedByEndpoint[endpoint]) groupedByEndpoint[endpoint] = []
              groupedByEndpoint[endpoint].push(item)
            })

            set({ facilities: groupedByEndpoint, facilitiesFetched: true })
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
    {
      name: 'facility-store',
    }
  )
)

