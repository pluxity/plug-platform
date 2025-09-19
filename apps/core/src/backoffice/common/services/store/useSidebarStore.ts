import { create } from "zustand";
import { devtools } from 'zustand/middleware';

interface SidebarState {
  activeItem: string | null;
  expandedItems: string[];
  setActiveItem: (id: string | null) => void;
  toggleExpandedItem: (id: string) => void;
  expandItem: (id: string) => void;
  setExpandedItems: (updater: (prev: string[]) => string[]) => void;
}

export const useSidebarStore = create<SidebarState>()(
  devtools((set) => ({
    activeItem: null,
    expandedItems: [],
    setActiveItem: (id) => set({ activeItem: id }),
    toggleExpandedItem: (id) =>
      set((state) => ({
        expandedItems: state.expandedItems.includes(id)
          ? state.expandedItems.filter((item) => item !== id)
          : [...state.expandedItems, id],
      })),
    expandItem: (id) =>
      set((s) =>
        s.expandedItems.includes(id)
          ? s
          : { expandedItems: [...s.expandedItems, id] }
      ),
    setExpandedItems: (updater) =>
      set((s) => ({ expandedItems: updater(s.expandedItems) })),
  }))
);