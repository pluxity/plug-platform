import { create } from 'zustand';

export interface StationState {
  stationCode: string;
  currentFloor: string;
  selectedDeviceId: string | null;
  setStationCode: (id: string) => void;
  setCurrentFloor: (floorId: string) => void;
  setSelectedDeviceId: (deviceId: string | null) => void;
}

const useStationStore = create<StationState>((set) => ({
  stationCode: '',
  currentFloor: 'ALL',
  selectedDeviceId: null,
  setStationCode: (code) => set({ stationCode: code }),
  setCurrentFloor: (floorId) => set({ currentFloor: floorId }),
  setSelectedDeviceId: (deviceId) => set({ selectedDeviceId: deviceId }),
}));

export default useStationStore;
