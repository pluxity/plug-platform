import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import type { UserResponse, UserCreateRequest, UserUpdateRequest } from '@plug/common-services';

const USER_API = `/admin/users`;

// 사용자 목록 조회
export const useUsers = () => {
  return useGet<UserResponse[]>(USER_API, { requireAuth: true });
};

// 사용자 상세 조회
export const useUserDetail = (userId: number) => {
  return useGet<UserResponse>(`${USER_API}/${userId}`, { requireAuth: true });
};

// 사용자 생성
export const useCreateUser = () => {
  return usePost<CreatedResponseBody, UserCreateRequest>(USER_API, { requireAuth: true });
};

// 사용자 정보 수정
export const useUpdateUser = (userId: number) => {
  return usePut<BaseResponseBody, UserUpdateRequest>(`${USER_API}/${userId}`, { requireAuth: true });
};

// 사용자 삭제
export const useDeleteUser = (userId: number) => {
  return useDelete(`${USER_API}/${userId}`, { requireAuth: true });
};

// SWR 기반 사용자 목록 조회
export const useUsersSWR = () => {
  return useSWRApi<UserResponse[]>(USER_API, 'GET', { requireAuth: true });
};

// SWR 기반 사용자 상세 조회
export const useUserDetailSWR = (buildingId: number) => {
  return useSWRApi<UserResponse>(`${USER_API}/${buildingId}`, 'GET', { requireAuth: true });
};

// TODO: Admin user role 파트 추가 필요(역할 할당, 역할 수정, 역할 제거)