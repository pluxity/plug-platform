import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
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

export const useDeleteRole = (roleId: number) => {
  return useDelete(`${END_POINT}/${roleId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useRolesSWR = () => {
  return useSWRApi<RoleResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useRoleDetailSWR = (roleId: number) => {
  return useSWRApi<RoleResponse>(`${END_POINT}/${roleId}`, 'GET', { requireAuth: true });
};