import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {AuthUserProfile} from "@plug/v1/auth/model/profile";

interface AuthStore {
    user: AuthUserProfile | null;
    setUser: (user: AuthUserProfile, expirySeconds: number) => void;
    expiresAt: number | null;
    clearUser: () => void;
}

export const useProfileStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            expiresAt: null,
            setUser: (user, expirySeconds) => {
                const now = Date.now();
                const expiresAt = now + expirySeconds * 1000;
                set({ user, expiresAt });
            },
            clearUser: () => set({ user: null, expiresAt: null })
        }),
        {
            name: 'user-profile'
        }
    )
);
