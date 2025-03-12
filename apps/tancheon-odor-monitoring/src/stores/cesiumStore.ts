import { create } from "zustand";
import type { Viewer } from "cesium";


type CesiumStateStore = {
  viewer: Viewer | null;
}

type CesiumActionStore = {
  setViewer: (viewer: Viewer) => void;
  clearViewer: () => void;
}

type CesiumStore = CesiumStateStore & CesiumActionStore;

const useCesiumStore = create<CesiumStore>((set) => ({
  viewer: null,
  setViewer: (viewer) => set({ viewer }),
  clearViewer: () => set({ viewer: null }),
}));

export default useCesiumStore;