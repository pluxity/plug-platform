import { create } from 'zustand';
import { TrainData } from '@plug/v1/app/modules/view/types/stream';

interface StreamStore {
  streamData: TrainData | null;
  setStreamData: (data: TrainData) => void;
}

const useStreamStore = create<StreamStore>((set) => ({
  streamData: null,
  setStreamData: (data) => set({ streamData: data }),
}));

export default useStreamStore;