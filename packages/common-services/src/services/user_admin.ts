import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import type { UserResponse, UserCreateRequest, UserUpdateRequest } from '@plug/common-services';

const USER_API = `/admin/users`;

export const useUsers = () => {
  return useGet<UserResponse[]>(USER_API, { requireAuth: true });
};

export const useUserDetail = (userId: number) => {
  return useGet<UserResponse>(`${USER_API}/${userId}`, { requireAuth: true });
};

export const useCreateUser = () => {
  return usePost<CreatedResponseBody, UserCreateRequest>(USER_API, { requireAuth: true });
};

export const useUpdateUser = (userId: number) => {
  return usePut<BaseResponseBody, UserUpdateRequest>(`${USER_API}/${userId}`, { requireAuth: true });
};

export const useDeleteUser = (userId: number) => {
  return useDelete(`${USER_API}/${userId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useUsersSWR = () => {
  return useSWRApi<UserResponse[]>(USER_API, 'GET', { requireAuth: true });
};

export const useUserDetailSWR = (buildingId: number) => {
  return useSWRApi<UserResponse>(`${USER_API}/${buildingId}`, 'GET', { requireAuth: true });
};