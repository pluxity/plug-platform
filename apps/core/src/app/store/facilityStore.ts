import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useGet } from '@plug/api-hooks'
import type { BaseFacilityResponse, FacilitiesAllResponse } from '@plug/common-services'

interface FacilityState {
  facilities: FacilitiesAllResponse
  isLoading: boolean
  error: string | null
  selectedFacility: BaseFacilityResponse | null
  searchSelectedFacility: BaseFacilityResponse | null
  facilitiesFetched: boolean
  
  searchQuery: string
  searchResults: BaseFacilityResponse[]
  
  setFacilities: (facilities: FacilitiesAllResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedFacility: (facility: BaseFacilityResponse | null) => void
  setSearchSelectedFacility: (facility: BaseFacilityResponse | null) => void
  setFacilitiesFetched: (fetched: boolean) => void
  
  setSearchQuery: (query: string) => void
  performSearch: (query: string) => void
  clearSearch: () => void
  selectSearchResult: (facility: BaseFacilityResponse) => void
  
  getAllFacilities: () => BaseFacilityResponse[]
  getFacilityById: (id: number) => BaseFacilityResponse | undefined
}

export const useFacilityStore = create<FacilityState>()(
  devtools(
    (set, get) => ({
      facilities: { },
      isLoading: false,
      error: null,
      selectedFacility: null,
      searchSelectedFacility: null,
      facilitiesFetched: false,
      
      searchQuery: '',
      searchResults: [],

      setFacilities: (facilities) => set({ facilities }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSelectedFacility: (selectedFacility) => set({ selectedFacility }),
      setSearchSelectedFacility: (searchSelectedFacility) => set({ searchSelectedFacility }),
      setFacilitiesFetched: (facilitiesFetched) => set({ facilitiesFetched }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      performSearch: (query) => {
        const { facilities } = get()

        if (!query.trim()) {
          set({ searchResults: [], searchQuery: query })
          return
        }
        
        const searchQuery = query.toLowerCase()
        
        const allFacilities = [
          ...(facilities.buildings || []),
          ...(facilities.stations || [])
        ]
        
        const searchResults = allFacilities.filter((facility: BaseFacilityResponse) =>
          facility.name.toLowerCase().includes(searchQuery)
        )
        
        set({ searchResults, searchQuery: query })
      },
      
      clearSearch: () => set({ searchQuery: '', searchResults: [] }),
      
      selectSearchResult: (facility) => {
        set({ 
          searchSelectedFacility: facility,
          searchQuery: '',
          searchResults: []
        })
      },

      getAllFacilities: () => {
        const { facilities } = get()
        return [
          ...(facilities.buildings || []),
          ...(facilities.stations || [])
        ]
      },

      getFacilityById: (id) => {
        const { facilities } = get()
        const allFacilities = [
          ...(facilities.buildings || []),
          ...(facilities.stations || [])
        ]
        return allFacilities.find(facility => facility.id === id)
      }
    }),
    {
      name: 'facility-store',
    }
  )
)

export const useFacilities = () => {
  return useGet<FacilitiesAllResponse>('facilities')
}
