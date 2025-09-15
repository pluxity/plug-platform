import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { UserProfile } from '@plug/common-services/types';
interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  clearAuth: () => void;
  // 사용자 정보 조회용 getter들
  getUserProfile: () => UserProfile | null;
  isUserLoggedIn: () => boolean;
  getUserId: () => string | number | undefined;
  getUsername: () => string | undefined;
  getUserRoles: () => string[];
  hasRole: (roleName: string) => boolean;
  isAdmin: () => boolean;
  updateLocalUserInfo: (updates: Partial<UserProfile>) => void;
  getUserPermissions: () => Array<{ resourceType: string; resourceIds: string[] }>;
  hasPermission: (resourceType: string, resourceId?: string) => boolean;
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
      getUserRoles: () => Array.from(get().user?.roles || []).map((role) => role.name) || [],
      hasRole: (roleName: string) => {
        const roles = get().getUserRoles();
        return roles.includes(roleName);
      },
      isAdmin: () => get().hasRole('ADMIN'),
      updateLocalUserInfo: (updates: Partial<UserProfile>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      getUserPermissions: () => {
        const user = get().user;
        if (!user?.roles) return [];

        const merged = new Map<string, Set<string>>();

        for (const role of user.roles) {
          for (const permission of role.permissions) {
            for (const p of permission.permissions) {
              if (!merged.has(p.resourceType)) {
                merged.set(p.resourceType, new Set<string>());
              }
              const ids = merged.get(p.resourceType)!;

              if (ids.has('ALL')) continue;

              if (p.resourceIds.includes('ALL')) {
                ids.clear();
                ids.add('ALL');
              } else {
                for (const id of p.resourceIds) ids.add(id);
              }
            }
          }
        }

        return Array.from(merged.entries()).map(([resourceType, resourceIds]) => ({
          resourceType,
          resourceIds: Array.from(resourceIds),
        }));
      },
      hasPermission: (resourceType: string, resourceId?: string) => {
        const user = get().user;
        if (user?.roles && Array.from(user.roles).some(r => r.name === 'ADMIN')) {
          return true; // ADMIN 은 모든 권한 보유
        }
        const permissions = get().getUserPermissions();
        const permission = permissions.find(p => p.resourceType === resourceType);
        if (!permission) return false;
        if (!resourceId) return true;
        return permission.resourceIds.includes('ALL') || permission.resourceIds.includes(resourceId);
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
