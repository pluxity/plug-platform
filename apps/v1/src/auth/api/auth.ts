import { signIn, UserProfile } from '@plug/common-services';
import {api, DataResponseBody} from '@plug/api-hooks';

export const logIn = async (data: { username: string; password: string }): Promise<DataResponseBody<UserProfile>> => {
    const response = await signIn(data);

    const location = response.headers?.get?.('Location')
    if (!location) {
        throw new Error('Location header not found');
    }

    const user = await api.get<UserProfile>(location, {
        requireAuth: true,
    });

    return user;
};
