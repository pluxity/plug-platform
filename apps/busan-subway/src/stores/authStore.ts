import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserResponse } from '@plug/common-services'

type AuthStoreState = {
  accessToken: string | null
  userName: string | null
  userCode: string | null
  user: UserResponse | null
  isAdmin: boolean
}

type AuthStoreAction = {
  login: (token: string, name: string, code: string) => void
  logout: () => void
  setAccessToken: (token: string) => void
  setUser: (user: UserResponse) => void
  hasRole: (roleName: string) => boolean
}

type AuthStore = AuthStoreState & AuthStoreAction

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      userName: null,
      userCode: null,
      user: null,
      isAdmin: false,

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
          user: null,
          isAdmin: false,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),
        
      setUser: (user) =>
        set({
          user,
          userName: user.name,
          userCode: user.code,
          isAdmin: true,
        }),
        
      hasRole: () => {
        const { user } = get();
        if (!user) return false;
        return true;
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore