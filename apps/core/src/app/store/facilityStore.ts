import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useEffect } from 'react'
import { getFacilitiesAll } from '@plug/common-services'
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
  loadFacilities: () => Promise<void>
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
        const allFacilities = Object.values(facilities).flat().filter(Boolean) as BaseFacilityResponse[]
        
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
        return Object.values(facilities).flat().filter(Boolean) as BaseFacilityResponse[]
      },

      getFacilityById: (id) => {
        const { facilities } = get()
        const allFacilities = Object.values(facilities).flat().filter(Boolean) as BaseFacilityResponse[]
        return allFacilities.find(facility => facility.id === id)
      },

      loadFacilities: async () => {
        const { facilitiesFetched } = get()
        
        // 이미 로드된 경우 재로드하지 않음
        if (facilitiesFetched) {
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const facilities = await getFacilitiesAll()
          set({ 
            facilities, 
            facilitiesFetched: true, 
            isLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load facilities',
            isLoading: false 
          })
        }
      }
    }),
    {
      name: 'facility-store',
    }
  )
)

export const useFacilities = () => {
  const { facilities, isLoading, error, facilitiesFetched, loadFacilities } = useFacilityStore()
  
  // 컴포넌트 마운트 시 한 번만 로드
  useEffect(() => {
    if (!facilitiesFetched && !isLoading) {
      loadFacilities()
    }
  }, [facilitiesFetched, isLoading, loadFacilities])
  
  return {
    data: facilities,
    isLoading,
    error,
    mutate: loadFacilities // 수동으로 재로드가 필요한 경우
  }
}
