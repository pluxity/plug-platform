import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {AuthUserProfile} from "@plug/v1/auth/model/profile";

interface AuthStore {
    user: AuthUserProfile | null;
    setUser: (user: AuthUserProfile, expiresAt: number) => void;
    expiresAt: number | null;
    clearUser: () => void;
}

export const useProfileStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            expiresAt: null,
            setUser: (user, expiresAt) => {
                set({ user, expiresAt });
            },
            clearUser: () => set(
                { user: null, expiresAt: null })
        }),
        {
            name: 'user-profile',
        }
    )
);
