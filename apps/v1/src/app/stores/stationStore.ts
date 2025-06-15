import { create } from 'zustand';

export interface StationState {
  stationCode: string;
  externalCode: string;
  currentFloor: string;
  selectedDeviceId: string | null;
  setStationCode: (code: string) => void;
  setExternalCode: (code: string | undefined) => void;
  setCurrentFloor: (floorId: string) => void;
  setSelectedDeviceId: (deviceId: string | null) => void;
}

const useStationStore = create<StationState>((set) => ({
  stationCode: '',
  externalCode: '1_STATION_SM',
  currentFloor: 'ALL',
  selectedDeviceId: null,
  setStationCode: (code) => set({ stationCode: code }),
  setExternalCode: (code) => set({ externalCode: code}),
  setCurrentFloor: (floorId) => set({ currentFloor: floorId }),
  setSelectedDeviceId: (deviceId) => set({ selectedDeviceId: deviceId }),
}));

export default useStationStore;
