import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AuthStoreState = {
  accessToken: string | null
  userName: string | null
  userCode: string | null
}

type AuthStoreAction = {
  login: (token: string, name: string, code: string) => void
  logout: () => void
  setAccessToken: (token: string) => void
}

type AuthStore = AuthStoreState & AuthStoreAction

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'access-token',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore