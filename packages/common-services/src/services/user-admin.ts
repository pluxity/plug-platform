import { api } from '@plug/api-hooks/core';
import { useGet, usePost, useSWRApi, usePatch } from '@plug/api-hooks';
import type { UserProfile, UserCreateRequest, UserUpdateRequest, UserRoleUpdateRequest } from '@plug/common-services';

const END_POINT = `admin/users`;

// 사용자 목록 조회
export const useUsers = () => {
  return useGet<UserProfile[]>(END_POINT, { requireAuth: true });
};

export const useUsersWithIsLoggedIn = () => {
  return useGet<UserProfile[]>(`${END_POINT}/with-is-logged-in`, { requireAuth: true });
};

// 사용자 상세 조회
export const useUserDetail = (userId: number) => {
  return useGet<UserProfile>(`${END_POINT}/${userId}`, { requireAuth: true });
};

// 사용자 생성
export const useCreateUser = () => {
  return usePost<UserCreateRequest>(END_POINT, { requireAuth: true });
};

// 사용자 수정
export const useUpdateUser = (userId: number) => {
  return usePatch<UserUpdateRequest>(`${END_POINT}/${userId}`, { requireAuth: true });
};

// 사용자 역할 수정
export const useUpdateUserRole = (userId: number) => {
  return usePatch<UserRoleUpdateRequest>(`${END_POINT}/${userId}/roles`, { requireAuth: true });
};

// 사용자 삭제
export const deleteUser = async (userId: number) => {
  return api.delete(`${END_POINT}/${userId}`, { requireAuth: true });
};

// 사용자 비밀번호 초기화
export const initUserPassword = async (userId: number) => {
  return api.patch(`${END_POINT}/${userId}/password-init`, null, { requireAuth: true });
};

// SWR 기반 훅
export const useUsersSWR = () => {
  return useSWRApi<UserProfile[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useUserDetailSWR = (userId: number | undefined) => {
  const url = userId !== undefined ? `${END_POINT}/${userId}` : '';
  return useSWRApi<UserProfile>(url, 'GET', { requireAuth: true }, {
    isPaused: () => userId === undefined, // userId가 없으면 요청 중단
  });
};