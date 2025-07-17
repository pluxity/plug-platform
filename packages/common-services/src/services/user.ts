import { useGet, usePut, useSWRApi } from '@plug/api-hooks';
import type { UserUpdateRequest, UserResponse } from '@plug/common-services';

const END_POINT = `users/me`;

export const useGetUserProfile = () => {
  return useGet<UserResponse>(END_POINT, { requireAuth: true });
};

export const useUpdateUserProfile = () => {
  return usePut<UserUpdateRequest>(END_POINT, { requireAuth: true });
};

export const useUserProfileSWR = () => {
  return useSWRApi<UserResponse>(END_POINT, 'GET', { requireAuth: true });
};
