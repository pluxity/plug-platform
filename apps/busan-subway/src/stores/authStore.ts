// stores/authStore.ts
import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  userName: string | null;
  userCode: string | null;
  login: (token: string, name: string, code: string) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userName: null,
  userCode: null,
  login: (token, name, code) =>
    set({ accessToken: token, userName: name, userCode: code }),
  logout: () => set({ accessToken: null, userName: null, userCode: null }),
}));

export default useAuthStore;
