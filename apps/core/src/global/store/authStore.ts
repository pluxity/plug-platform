import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '@plug/common-services/types'

interface AuthStore {
  user: UserProfile | null
  isAuthenticated: boolean
  setUser: (user: UserProfile | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  clearAuth: () => void
  // 사용자 정보 조회용 getter들
  getUserProfile: () => UserProfile | null
  isUserLoggedIn: () => boolean
  getUserId: () => string | number | undefined
  getUsername: () => string | undefined
  getUserRoles: () => string[]
  hasRole: (roleName: string) => boolean
  // 간단한 사용자 정보 업데이트 (로컬 상태만)
  updateLocalUserInfo: (updates: Partial<UserProfile>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
      
      // Getter 함수들
      getUserProfile: () => get().user,
      isUserLoggedIn: () => get().isAuthenticated && get().user !== null,
      getUserId: () => get().user?.id,
      getUsername: () => get().user?.username,
      getUserRoles: () => Array.from(get().user?.roles || []).map(role => role.name) || [],
      hasRole: (roleName: string) => {
        const roles = get().getUserRoles()
        return roles.includes(roleName)
      },
      
      // 로컬 상태 업데이트 (서버 동기화는 별도 처리)
      updateLocalUserInfo: (updates: Partial<UserProfile>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
