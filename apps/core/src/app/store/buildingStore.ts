import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { BuildingResponse } from '@plug/common-services'

interface BuildingState {
  buildings: BuildingResponse[]
  isLoading: boolean
  error: string | null
  selectedBuilding: BuildingResponse | null  // Entity 클릭으로 선택된 빌딩 (실내 지도 전환용)
  searchSelectedBuilding: BuildingResponse | null  // 검색으로 선택된 빌딩 (카메라 이동용)
  buildingsFetched: boolean // 페칭 완료 상태
  
  // Actions
  setBuildings: (buildings: BuildingResponse[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedBuilding: (building: BuildingResponse | null) => void  // Entity 클릭용
  setSearchSelectedBuilding: (building: BuildingResponse | null) => void  // 검색 선택용
  setBuildingsFetched: (fetched: boolean) => void
  
  // Selectors
  getBuildingNames: () => string[]
  getBuildingById: (id: number) => BuildingResponse | undefined
  searchBuildings: (query: string) => BuildingResponse[]
}

export const useBuildingStore = create<BuildingState>()(
  devtools(
    (set, get) => ({
      buildings: [],
      isLoading: false,
      error: null,
      selectedBuilding: null,
      searchSelectedBuilding: null,
      buildingsFetched: false,

      setBuildings: (buildings) => set({ buildings }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSelectedBuilding: (selectedBuilding) => set({ selectedBuilding }),
      setSearchSelectedBuilding: (searchSelectedBuilding) => set({ searchSelectedBuilding }),
      setBuildingsFetched: (buildingsFetched) => set({ buildingsFetched }),

      getBuildingNames: () => {
        const { buildings } = get()
        return buildings.map(building => building.facility.name)
      },

      getBuildingById: (id) => {
        const { buildings } = get()
        return buildings.find(building => building.facility.id === id)
      },

      searchBuildings: (query) => {
        const { buildings } = get()
        if (!query.trim()) return []
        
        return buildings.filter(building =>
          building.facility.name.toLowerCase().includes(query.toLowerCase())
        )
      }
    }),
    {
      name: 'building-store',
    }
  )
)
