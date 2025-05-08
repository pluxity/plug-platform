import { signIn } from '@plug/common-services';
import { api, DataResponseBody } from '@plug/api-hooks';
import { AuthUserProfile } from "@plug/v1/auth/model/types";
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
    useProfileStore.getState().setUser(user.data);

    return user;
};

export const signOut = async (): Promise<Response> => {
    return api.post('auth/sign-out', {}, { requireAuth: true });
};