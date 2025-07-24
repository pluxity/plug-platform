import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { FacilityRegistry } from "@/backoffice/domains/facility/create/FacilityRegistry";

export type FacilityType = 'facilities' | 'buildings' | 'stations';

export const getFacilityTypeLabels = (): Record<FacilityType, string> => {
  const labels: Record<string, string> = {
    'facilities': '시설 전체',
  };

  FacilityRegistry.getAll().forEach(def => {
    labels[def.type] = def.displayName;
  });

  return labels;
};

export const getFacilityButtonLabels = (): Record<FacilityType, string> => {
  const labels: Record<string, string> = {
    'facilities': '시설 추가',
  };

  FacilityRegistry.getAll().forEach(def => {
    labels[def.type] = `${def.displayName} 추가`;
  });

  return labels;
};

export const FACILITY_TYPE_LABELS = getFacilityTypeLabels();
export const FACILITY_BUTTON_LABELS = getFacilityButtonLabels();

interface FacilityListState {
  selectedType: FacilityType;
  selectedId: string | null;
  previousRoute: { path: string; scrollPosition: number } | null;
  setSelectedType: (type: FacilityType) => void;
  setSelectedId: (id: string | null) => void;
  setSelected: (type: FacilityType, id: string | null) => void;
  setPreviousRoute: (path: string, scrollPosition: number) => void;
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
        setPreviousRoute: (path, scrollPosition = 0) =>
          set({ previousRoute: { path, scrollPosition } }, false, 'setPreviousRoute'),
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