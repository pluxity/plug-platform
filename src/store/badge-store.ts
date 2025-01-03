import { create } from "zustand";

type BadgeStoreState = {
    unreadCount: number;
}

type BadgeStoreAction = {
    setUnreadCount: (count: number) => void;
    incrementUnread: () => void;
    decrementUnread: () => void;
}

type BadgeStore = BadgeStoreState & BadgeStoreAction;

const useBadgeStore = create<BadgeStore>((set) => ({
    unreadCount: 0, 
    setUnreadCount: (count: number) => set(({ unreadCount: count})),
    incrementUnread: () =>
        set((state) => ({
            unreadCount: state.unreadCount + 1
        })),
    decrementUnread: () =>
        set((state) => ({
            unreadCount: Math.max(0, state.unreadCount - 1)
        })),
}));

export default useBadgeStore;