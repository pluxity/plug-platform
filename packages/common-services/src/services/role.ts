import { api } from '@plug/api-hooks/core';
import { useGet, usePost, usePatch, useSWRApi } from '@plug/api-hooks';
import type { RoleResponse, RoleCreateRequest, RoleUpdateRequest } from '@plug/common-services';

const END_POINT = `roles`;

// 역할 목록 조회
export const useRoles = () => {
  return useGet<RoleResponse[]>(END_POINT, { requireAuth: true });
};

// 역할 상세 조회
export const useRoleDetail = (roleId: number) => {
  return useGet<RoleResponse>(`${END_POINT}/${roleId}`, { requireAuth: true });
};

// 역할 생성
export const useCreateRole = () => {
  return usePost<RoleCreateRequest>(END_POINT, { requireAuth: true });
};

// 역할 수정
export const useUpdateRole = (roleId: number) => {
  return usePatch<RoleUpdateRequest>(`${END_POINT}/${roleId}`, { requireAuth: true });
};

// 역할 삭제
export const deleteRole = async (roleId: number) => {
  return api.delete(`${END_POINT}/${roleId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useRolesSWR = () => {
  return useSWRApi<RoleResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useRoleDetailSWR = (roleId: number | undefined) => {
  const url = roleId ? `${END_POINT}/${roleId}` : '';
  return useSWRApi<RoleResponse>(url, 'GET', { requireAuth: true }, {
    isPaused: () => !roleId, // roleId가 없으면 요청 중단
  });
};