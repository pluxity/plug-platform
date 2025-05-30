import { create } from 'zustand';

export interface StationState {
  stationId: number | null;
  setStationId: (id: number | null) => void;
}

const useStationStore = create<StationState>((set) => ({
  stationId: null,
  setStationId: (id) => set({ stationId: id }),
}));

export default useStationStore;
