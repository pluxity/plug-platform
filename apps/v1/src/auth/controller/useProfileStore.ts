import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {AuthUserProfile} from "@plug/v1/auth/model/profile";

interface AuthStore {
    user: AuthUserProfile | null;
    setUser: (user: AuthUserProfile) => void;
    clearUser: () => void;
}

export const useProfileStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => {
                set({ user });
            },
            clearUser: () => set(
                { user: null }),
        }),
        {
            name: 'user-profile',
        }
    )
);
