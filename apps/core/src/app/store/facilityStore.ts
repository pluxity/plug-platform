import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { facilityService } from '@plug/common-services'
import type { FacilityResponse, FacilityType } from '@plug/common-services'

// 시설 데이터 저장 타입 - 그룹화된 구조로 저장 (동적 확장 가능)
type FacilitiesData = Record<string, FacilityResponse[]>

interface FacilityState {
  facilities: FacilitiesData
  error: string | null
  selectedFacility: FacilityResponse | null
  facilitiesFetched: boolean
  
  setFacilities: (facilities: FacilitiesData) => void
  setError: (error: string | null) => void
  setSelectedFacility: (facility: FacilityResponse | null) => void
  setFacilitiesFetched: (fetched: boolean) => void
  
  getAllFacilities: () => FacilityResponse[]
  getFacilityById: (id: number) => FacilityResponse | undefined
  getFacilitiesByType: (type: FacilityType) => FacilityResponse[]
  loadFacilities: () => Promise<void>
}

export const useFacilityStore = create<FacilityState>()(
  devtools(
    (set, get) => ({
      facilities: {},
      error: null,
      selectedFacility: null,
      facilitiesFetched: false,

      setFacilities: (facilities) => set({ facilities }),
      setError: (error) => set({ error }),
      setSelectedFacility: (selectedFacility) => set({ selectedFacility }),
      setFacilitiesFetched: (facilitiesFetched) => set({ facilitiesFetched }),

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
        
        try {
          // facilityService를 사용해서 모든 시설 목록 가져오기
          const response = await facilityService.getAllFacilities()
          
          // API 응답이 그룹화된 구조인지 확인하고 OutdoorMap이 기대하는 복수형 키로 정규화(buildings/stations/parks)
          let facilitiesData: FacilitiesData = {}
          
          if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            const raw = response.data as Record<string, FacilityResponse[]>
            const normalizeKey = (key: string) => {
              if (key === 'building') return 'buildings'
              if (key === 'station') return 'stations'
              if (key === 'park') return 'parks'
              return key
            }
            const normalized: FacilitiesData = {}
            Object.entries(raw).forEach(([key, list]) => {
              normalized[normalizeKey(key)] = Array.isArray(list) ? list : []
            })
            facilitiesData = normalized
          } else if (Array.isArray(response.data)) {
            // 배열인 경우 기본적으로 buildings로 분류
            facilitiesData.buildings = response.data
          }
          
          set({ 
            facilities: facilitiesData, 
            facilitiesFetched: true
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load facilities'
          })
        }
      }
    }),
    {
      name: 'facility-store',
    }
  )
)

