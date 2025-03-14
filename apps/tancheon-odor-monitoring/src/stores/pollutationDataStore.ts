// stores/pollutionDataStore.ts
import { create } from 'zustand';
import { HeatmapDataPoint } from '@/lib/heatmap_data';

interface PollutionDataState {
  // 고도별 데이터 저장
  dataByHeight: Record<number, HeatmapDataPoint[]>;
  // 마지막 업데이트 시간 추적
  lastUpdated: Date | null;
  // 데이터 업데이트 함수
  updateData: (height: number, data: HeatmapDataPoint[]) => void;
  updateAllData: (data: Array<{ height: number, data: HeatmapDataPoint[] }>) => void;
  // 초기화 함수
  resetData: () => void;
  // 데이터 로딩 상태
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const usePollutionDataStore = create<PollutionDataState>((set) => ({
  dataByHeight: {},
  lastUpdated: null,
  isLoading: false,
  
  updateData: (height, data) => set((state) => ({
    dataByHeight: {
      ...state.dataByHeight,
      [height]: data
    },
    lastUpdated: new Date()
  })),
  
  updateAllData: (dataArray) => {
    const newDataByHeight: Record<number, HeatmapDataPoint[]> = {};
    
    dataArray.forEach(({ height, data }) => {
      newDataByHeight[height] = data;
    });
    
    set({
      dataByHeight: newDataByHeight,
      lastUpdated: new Date()
    });
  },
  
  resetData: () => set({
    dataByHeight: {},
    lastUpdated: null
  }),
  
  setLoading: (loading) => set({ isLoading: loading })
}));