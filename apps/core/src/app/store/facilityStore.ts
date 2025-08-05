import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useEffect } from 'react'
import { facilityService } from '@plug/common-services'
import type { FacilityResponse, FacilityType } from '@plug/common-services'

// 시설 데이터 저장 타입 - 그룹화된 구조로 저장 (동적 확장 가능)
type FacilitiesData = Record<string, FacilityResponse[]>

interface FacilityState {
  facilities: FacilitiesData
  isLoading: boolean
  error: string | null
  selectedFacility: FacilityResponse | null
  searchSelectedFacility: FacilityResponse | null
  facilitiesFetched: boolean
  
  searchQuery: string
  searchResults: FacilityResponse[]
  
  setFacilities: (facilities: FacilitiesData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedFacility: (facility: FacilityResponse | null) => void
  setSearchSelectedFacility: (facility: FacilityResponse | null) => void
  setFacilitiesFetched: (fetched: boolean) => void
  
  setSearchQuery: (query: string) => void
  performSearch: (query: string) => void
  clearSearch: () => void
  selectSearchResult: () => void
  
  getAllFacilities: () => FacilityResponse[]
  getFacilityById: (id: number) => FacilityResponse | undefined
  getFacilitiesByType: (type: FacilityType) => FacilityResponse[]
  loadFacilities: () => Promise<void>
}

export const useFacilityStore = create<FacilityState>()(
  devtools(
    (set, get) => ({
      facilities: {},
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
        // Object.values를 사용해서 모든 시설 타입을 동적으로 합치기
        const allFacilities = Object.values(facilities)
          .filter(Array.isArray)
          .flat() as FacilityResponse[]
        
        const searchResults = allFacilities.filter((facility: FacilityResponse) =>
          facility.name.toLowerCase().includes(searchQuery) ||
          facility.code.toLowerCase().includes(searchQuery) ||
          (facility.description && facility.description.toLowerCase().includes(searchQuery))
        )
        
        set({ searchResults, searchQuery: query })
      },
      
      clearSearch: () => set({ 
        searchQuery: '', 
        searchResults: [], 
        searchSelectedFacility: null 
      }),
      
      selectSearchResult: () => {
        // 검색 결과만 정리
        set({ 
          searchQuery: '',
          searchResults: []
        })
      },

      getAllFacilities: () => {
        const { facilities } = get()
        // Object.values를 사용해서 모든 시설 타입을 동적으로 합치기
        return Object.values(facilities)
          .filter(Array.isArray)
          .flat() as FacilityResponse[]
      },

      getFacilityById: (id) => {
        const { facilities } = get()
        // Object.values를 사용해서 모든 시설 타입에서 동적으로 찾기
        const allFacilities = Object.values(facilities)
          .filter(Array.isArray)
          .flat() as FacilityResponse[]
        return allFacilities.find(facility => facility.id === id)
      },

      getFacilitiesByType: (type: FacilityType) => {
        const { facilities } = get()
        // 동적으로 타입에 해당하는 키 찾기
        const typeKey = Object.keys(facilities).find(key => {
          // 타입 매핑: building -> buildings, station -> stations, park -> parks
          const mappedType = type === 'building' ? 'buildings' : 
                            type === 'station' ? 'stations' : 
                            type === 'park' ? 'parks' : type
          return key === mappedType || key === type
        })
        
        return typeKey && Array.isArray(facilities[typeKey]) ? facilities[typeKey] : []
      },

      loadFacilities: async () => {
        const { facilitiesFetched } = get()
        
        // 이미 로드된 경우 재로드하지 않음
        if (facilitiesFetched) {
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          // facilityService를 사용해서 모든 시설 목록 가져오기
          const response = await facilityService.getAllFacilities()
          
          // API 응답이 그룹화된 구조인지 확인
          let facilitiesData: FacilitiesData = {}
          
          if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            // 이미 그룹화된 객체인 경우 - 그대로 사용
            facilitiesData = response.data as Record<string, FacilityResponse[]>
          } else if (Array.isArray(response.data)) {
            // 배열인 경우 기본적으로 buildings로 분류
            facilitiesData.buildings = response.data
          }
          
          set({ 
            facilities: facilitiesData, 
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
