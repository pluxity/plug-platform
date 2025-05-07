import { api } from '@plug/api-hooks/core'

export const authApi = {
    login: (data: { username: string; password: string }) => {
        return api.post('auth/sign-in', data, { requireAuth: false });
    }
};