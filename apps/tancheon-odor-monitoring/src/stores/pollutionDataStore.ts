import { create } from 'zustand';
import { HeatmapDataPoint, getHeatmapDataPointsByHeight } from '@/lib/heatmap_data';

interface PollutionDataState {
  // 고도별 데이터 저장
  dataByHeight: Record<number, HeatmapDataPoint[]>;
  // 마지막 업데이트 시간 추적
  lastUpdated: Date | null;
  // 데이터 업데이트 함수
  updateData: (height: number, data: HeatmapDataPoint[]) => void;
  updateDataPoints: (height: number, data: HeatmapDataPoint[]) => void;
  updateAllData: (data: Array<{ height: number, data: HeatmapDataPoint[] }>) => void;
  // 랜덤 데이터 생성 및 업데이트 (테스트용)
  generateRandomData: (heights: number[]) => void;
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
  
  updateDataPoints: (height, data) => set((state) => ({
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
  
  // 랜덤 데이터 생성 (테스트용)
  generateRandomData: (heights) => {
    set({ isLoading: true });
    
    try {
      const dataArray = heights.map(height => {
        // 원본 데이터 가져오기
        const originalData = getHeatmapDataPointsByHeight(height);
        
        // 값 무작위 변경 (0~100 범위 유지)
        const modifiedData = originalData.map(point => ({
          ...point,
          value: Math.min(100, Math.max(1, point.value * (0.7 + Math.random() * 0.6)))
        }));
        
        return { height, data: modifiedData };
      });
      
      const newDataByHeight: Record<number, HeatmapDataPoint[]> = {};
      dataArray.forEach(({ height, data }) => {
        newDataByHeight[height] = data;
      });
      
      set({
        dataByHeight: newDataByHeight,
        lastUpdated: new Date(),
        isLoading: false
      });
      
      console.log(`${heights.length}개 고도에 대한 랜덤 데이터 생성 완료`);
    } catch (error) {
      console.error('랜덤 데이터 생성 오류:', error);
      set({ isLoading: false });
    }
  },
  
  resetData: () => set({
    dataByHeight: {},
    lastUpdated: null
  }),
  
  setLoading: (loading) => set({ isLoading: loading })
})); 