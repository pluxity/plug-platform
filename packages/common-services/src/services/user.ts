import { useGet, usePut, usePatch, useSWRApi, api } from '@plug/api-hooks';
import type { UserUpdateRequest, UserProfile } from '@plug/common-services';

const END_POINT = `users/me`;

export const useGetUserProfile = () => {
  return useGet<UserProfile>(END_POINT, { requireAuth: true });
};

export const useUpdateUserProfile = () => {
  return usePut<UserUpdateRequest>(END_POINT, { requireAuth: true });
};

export const useChangePassword = () => {
  return usePatch<{ password: string }>(`${END_POINT}/password`, { requireAuth: true });
};

export const useUserProfileSWR = () => {
  return useSWRApi<UserProfile>(END_POINT, 'GET', { requireAuth: true });
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>(END_POINT, { requireAuth: true });
  return response.data;
};
