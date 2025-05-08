import { api } from '@plug/api-hooks/core';
import { buildKy } from '@plug/api-hooks';

export const authApi = {
    login: async (data: { username: string; password: string }) => {
        const response = await buildKy({ requireAuth: false }).post('auth/sign-in', {
            json: data
        });

        const location = response.headers.get('Location');
        if (!location) {
            throw new Error('Location header not found');
        }

        const path = new URL(location).pathname;
        const userInfo = await api.get(path);
        return userInfo;
    }
};
