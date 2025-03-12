import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInfo {
  user_name: string;
  role: string;
}
type UserState = {
  user: UserInfo | null;
}

type UserAction = {
  setUser: (user: UserInfo | null) => void;
  clearUser: () => void;
}

type UserStore = UserState & UserAction;

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
); 