import { create } from 'zustand';

type AuthStoreState = {
  accessToken: string | null;
  userName: string | null;
  userCode: string | null;
};

type AuthStoreAction = {
  login: (token: string, name: string, code: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
};

type AuthStore = AuthStoreState & AuthStoreAction;

const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  userName: null,
  userCode: null,

  login: (token, name, code) =>
    set({
      accessToken: token,
      userName: name,
      userCode: code,
    }),

  logout: () =>
    set({
      accessToken: null,
      userName: null,
      userCode: null,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),
}));

export default useAuthStore;
