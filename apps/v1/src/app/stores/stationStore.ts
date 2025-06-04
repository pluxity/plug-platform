import { create } from 'zustand';

export interface StationState {
  stationId: number | null;
  currentFloor: string;
  selectedDeviceId: string | null;
  setStationId: (id: number | null) => void;
  setCurrentFloor: (floorId: string) => void;
  setSelectedDeviceId: (deviceId: string | null) => void;
}

const useStationStore = create<StationState>((set) => ({
  stationId: null,
  currentFloor: 'ALL',
  selectedDeviceId: null,
  setStationId: (id) => set({ stationId: id }),
  setCurrentFloor: (floorId) => set({ currentFloor: floorId }),
  setSelectedDeviceId: (deviceId) => set({ selectedDeviceId: deviceId }),
}));

export default useStationStore;
