import { create } from 'zustand';

export interface StationState {
  facilityCode: string;
  currentFloor: string;
  selectedDeviceId: string | null;
  setStationCode: (id: string) => void;
  setCurrentFloor: (floorId: string) => void;
  setSelectedDeviceId: (deviceId: string | null) => void;
}

const useStationStore = create<StationState>((set) => ({
  facilityCode: '',
  currentFloor: 'ALL',
  selectedDeviceId: null,
  setStationCode: (code) => set({ facilityCode: code }),
  setCurrentFloor: (floorId) => set({ currentFloor: floorId }),
  setSelectedDeviceId: (deviceId) => set({ selectedDeviceId: deviceId }),
}));

export default useStationStore;
