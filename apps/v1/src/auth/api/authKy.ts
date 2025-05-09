import ky, {Options} from 'ky';
import {logOut, refreshToken} from '@plug/v1/auth/api/auth';
import { useProfileStore } from '@plug/v1/auth/controller/useProfileStore';
import {baseKy} from "@plug/api-hooks";

type ExtendedOptions = Options & {
    _refreshed?: boolean;
    requireAuth?: boolean;
};

export const buildKy = (options: ExtendedOptions = {}) => {
    const { requireAuth = true, ...restOptions } = options;
    const { expiresAt } = useProfileStore.getState();

    if (requireAuth && expiresAt && Date.now() > expiresAt) {
        throw new Error('세션이 만료되었습니다. 다시 로그인 해주세요.');
    }

    return baseKy.extend({
        ...restOptions,
        hooks: {
            ...restOptions.hooks,
            afterResponse: [
                async (request, options, response) => {
                    const customOptions = options as ExtendedOptions;

                    if (response.status === 401 && !customOptions._refreshed) {
                        try {
                            await refreshToken();
                            return await ky(request, {
                                ...customOptions,
                                _refreshed: true,
                                retry: { limit: 0 }
                            } as ExtendedOptions);
                        } catch {
                            await logOut();
                            throw new Error('세션이 만료되어 로그아웃되었습니다.');
                        }
                    }

                    return response;
                }
            ]
        }
    });
};
