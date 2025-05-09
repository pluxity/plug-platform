import { signIn, signOut } from '@plug/common-services';
import { api, DataResponseBody } from '@plug/api-hooks';
import { AuthUserProfile } from "@plug/v1/auth/model/profile";
import { useProfileStore } from "@plug/v1/auth/controller/useProfileStore";

export const logIn = async (data: { username: string; password: string }): Promise<DataResponseBody<AuthUserProfile>> => {
    const response = await signIn(data);

    const location = response.headers?.get?.('Location')
    if (!location) {
        throw new Error('Location header not found');
    }

    const user = await api.get<AuthUserProfile>(location, {
        requireAuth: true,
    });
    const expirySeconds = parseInt(document.cookie.split('; ').find(row => row.startsWith('expiry='))?.split('=')[1] || '0', 10);
    useProfileStore.getState().setUser(user.data, expirySeconds);

    return user;
};

export const logOut = async (): Promise<Response> => {
    const response = await signOut();
    useProfileStore.getState().clearUser();
    return response;
};