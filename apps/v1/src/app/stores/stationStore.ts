import { create } from 'zustand';

export interface StationState {
  facilityCode: string;
  currentFloor: string;
  selectedDeviceCode: string | null;
  setStationCode: (id: string) => void;
  setCurrentFloor: (floorId: string) => void;
  setSelectedDeviceCode: (deviceCode: string | null) => void;
}

const useStationStore = create<StationState>((set) => ({
  facilityCode: '',
  currentFloor: 'ALL',
  selectedDeviceCode: null,
  setStationCode: (code) => set({ facilityCode: code }),
  setCurrentFloor: (floorId) => set({ currentFloor: floorId }),
  setSelectedDeviceCode: (deviceCode) => set({ selectedDeviceCode: deviceCode }),
}));

export default useStationStore;
