import { useEffect } from 'react';
import { useProfileStore } from './useProfileStore';
import {logOut, refreshToken} from "@plug/v1/auth/api/auth";


export const useSessionWatcher = () => {
    const { expiresAt, clearUser } = useProfileStore();

    useEffect(() => {
        if (!expiresAt) return;

        const now = Date.now();
        const remainingTime = expiresAt - now;

        if (remainingTime <= 0) {
            logOut();
            alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
            return;
        }

        const expireTimer = setTimeout(() => {
            logOut()
            alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
        }, remainingTime);

        const refreshMargin = 60 * 1000;
        const refreshTime = remainingTime - refreshMargin;

        const refreshTimer = refreshTime > 0
            ? setTimeout(async () => {
                try {
                    await refreshToken();
                    console.log('refresh 성공');
                } catch {
                    logOut();
                    alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
                }
            }, refreshTime)
            : null;

        return () => {
            clearTimeout(expireTimer);
            if (refreshTimer) clearTimeout(refreshTimer);
        };
    }, [expiresAt, clearUser]);
};
