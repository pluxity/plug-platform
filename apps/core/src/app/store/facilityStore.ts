import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useGet } from '@plug/api-hooks'
import type { Facility, FacilityAllResponse } from '@plug/common-services'

interface FacilityState {
  facilities: FacilityAllResponse
  isLoading: boolean
  error: string | null
  selectedFacility: Facility | null
  searchSelectedFacility: Facility | null
  facilitiesFetched: boolean
  
  searchQuery: string
  searchResults: Facility[]
  
  setFacilities: (facilities: FacilityAllResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedFacility: (facility: Facility | null) => void
  setSearchSelectedFacility: (facility: Facility | null) => void
  setFacilitiesFetched: (fetched: boolean) => void
  
  setSearchQuery: (query: string) => void
  performSearch: (query: string) => void
  clearSearch: () => void
  selectSearchResult: (facility: Facility) => void
  
  getAllFacilities: () => Facility[]
  getFacilityById: (id: number) => Facility | undefined
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
        
        const searchResults = Object.values(facilities).flat().filter(facility =>
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
        // buildings와 stations의 facility 배열을 합치기
        return [
          ...facilities.buildings.map(item => item.facility),
          ...facilities.stations.map(item => item.facility)
        ]
      },

      getFacilityById: (id) => {
        const { facilities } = get()
        const allFacilities = [
          ...facilities.buildings.map(item => item.facility),
          ...facilities.stations.map(item => item.facility)
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
  return useGet<FacilityAllResponse>('facilities')
}
