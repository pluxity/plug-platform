import { useGet, usePatch, useSWRApi, api } from '@plug/api-hooks';
import type { UserUpdateRequest, UserProfile } from '@plug/common-services';

const END_POINT = `users/me`;

// 사용자 프로필 조회
export const useGetUserProfile = () => {
  return useGet<UserProfile>(END_POINT, { requireAuth: true });
};

// 사용자 프로필 수정
export const useUpdateUserProfile = () => {
  return usePatch<UserUpdateRequest>(END_POINT, { requireAuth: true });
};

// 사용자 비밀번호 변경
export const useChangePassword = () => {
  return usePatch<{ newPassword: string, currentPassword: string }>(`${END_POINT}/password`, { requireAuth: true });
};

// SWR 기반 훅
export const useUserProfileSWR = () => {
  return useSWRApi<UserProfile>(END_POINT, 'GET', { requireAuth: true });
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>(END_POINT, { requireAuth: true });
  return response.data;
};
