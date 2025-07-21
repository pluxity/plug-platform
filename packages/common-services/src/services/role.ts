import { api } from '@plug/api-hooks/core';
import { useGet, usePost, usePut, useSWRApi } from '@plug/api-hooks';
import type { RoleResponse, RoleCreateRequest, RoleUpdateRequest } from '@plug/common-services';

const END_POINT = `roles`;

export const useRoles = () => {
  return useGet<RoleResponse[]>(END_POINT, { requireAuth: true });
};

export const useRoleDetail = (roleId: number) => {
  return useGet<RoleResponse>(`${END_POINT}/${roleId}`, { requireAuth: true });
};

export const useCreateRole = () => {
  return usePost<RoleCreateRequest>(END_POINT, { requireAuth: true });
};

export const useUpdateRole = (roleId: number) => {
  return usePut<RoleUpdateRequest>(`${END_POINT}/${roleId}`, { requireAuth: true });
};

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