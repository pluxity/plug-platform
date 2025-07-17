import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
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
  return usePut<UserUpdateRequest>(`${END_POINT}/${userId}`, { requireAuth: true });
};

export const useDeleteUser = (userId: number) => {
  return useDelete(`${END_POINT}/${userId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useUsersSWR = () => {
  return useSWRApi<UserResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useUserDetailSWR = (userId: number) => {
  return useSWRApi<UserResponse>(`${END_POINT}/${userId}`, 'GET', { requireAuth: true });
};