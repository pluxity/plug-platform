import { create } from 'zustand';

export interface DeviceModalState {
  isOpen: boolean;
  deviceId: string | null;
  deviceType: string;
  stationId: string;
  openModal: (deviceId: string, deviceType: string, stationId: string) => void;
  closeModal: () => void;
}

const useDeviceModalStore = create<DeviceModalState>((set) => ({
  isOpen: false,
  deviceId: null,
  deviceType: '',
  stationId: '',
  openModal: (deviceId, deviceType, stationId) => 
    set({ 
      isOpen: true, 
      deviceId, 
      deviceType, 
      stationId 
    }),
  closeModal: () => 
    set({ 
      isOpen: false, 
      deviceId: null, 
      deviceType: '', 
      stationId: '' 
    }),
}));

export default useDeviceModalStore;
