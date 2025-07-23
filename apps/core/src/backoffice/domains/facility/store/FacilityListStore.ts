import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

export type FacilityType = 'facilities' | 'buildings' | 'stations';

export const FACILITY_TYPE_LABELS: Record<FacilityType, string> = {
  'facilities': '시설 전체',
  'buildings': '건물',
  'stations': '역사',
};

export const FACILITY_BUTTON_LABELS: Record<FacilityType, string> = {
  'facilities': '시설 추가',
  'buildings': '건물 추가',
  'stations': '역사 추가',
};

interface FacilityListState {
  selectedType: FacilityType;
  selectedId: string | null;
  previousRoute: { path: string; } | null;
  setSelectedType: (type: FacilityType) => void;
  setSelectedId: (id: string | null) => void;
  setSelected: (type: FacilityType, id: string | null) => void;
  setPreviousRoute: (path: string) => void;
  reset: () => void;
}

export const useFacilityListStore = create<FacilityListState>()(
  devtools(
    persist(
      (set) => ({
        selectedType: 'facilities',
        selectedId: null,
        previousRoute: null,
        setSelectedType: (type) => set({ selectedType: type }, false, 'setSelectedType'),
        setSelectedId: (id) => set({ selectedId: id }, false, 'setSelectedId'),
        setSelected: (type, id) => set({ selectedType: type, selectedId: id }, false, 'setSelected'),
        setPreviousRoute: (path) =>
          set({ previousRoute: { path} }, false, 'setPreviousRoute'),
        reset: () => set({
          selectedType: 'facilities',
          selectedId: null,
          previousRoute: null
        }, false, 'reset'),
      }),
      { name: 'facility-list-storage' }
    ),
    { name: 'facility-list-store' }
  )
);