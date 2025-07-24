import { api } from '@plug/api-hooks/core';
import { useGet, usePost, useSWRApi, usePatch } from '@plug/api-hooks';
import type { UserResponse, UserCreateRequest, UserUpdateRequest } from '@plug/common-services';

const END_POINT = `admin/users`;

export const useUsers = () => {
  return useGet<UserResponse[]>(END_POINT, { requireAuth: true });
};

export const useUserDetail = (userId: number) => {
  return useGet<UserResponse>(`${END_POINT}/${userId}`, { requireAuth: true });
};

export const useCreateUser = () => {
  return usePost<UserCreateRequest>(END_POINT, { requireAuth: true });
};

export const useUpdateUser = (userId: number) => {
  return usePatch<UserUpdateRequest>(`${END_POINT}/${userId}`, { requireAuth: true });
};

export const deleteUser = async (userId: number) => {
  return api.delete(`${END_POINT}/${userId}`, { requireAuth: true });
};

export const initUserPassword = async (userId: number) => {
  return api.patch(`${END_POINT}/${userId}/password-init`, null, { requireAuth: true });
};

// SWR 기반 훅
export const useUsersSWR = () => {
  return useSWRApi<UserResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useUserDetailSWR = (userId: number | undefined) => {
  const url = userId ? `${END_POINT}/${userId}` : '';
  return useSWRApi<UserResponse>(url, 'GET', { requireAuth: true }, {
    isPaused: () => !userId, // userId가 없으면 요청 중단
  });
};