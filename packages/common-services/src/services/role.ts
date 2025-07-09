import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { BaseResponseBody } from '@plug/api-hooks';
import type { RoleResponse, RoleCreateRequest, RoleUpdateRequest } from '@plug/common-services';

const ROLE_API = `roles`;

export const useRoles = () => {
  return useGet<RoleResponse[]>(ROLE_API, { requireAuth: true });
};

export const useRoleDetail = (roleId: number) => {
  return useGet<RoleResponse>(`${ROLE_API}/${roleId}`, { requireAuth: true });
};

export const useCreateRole = () => {
  return usePost<BaseResponseBody, RoleCreateRequest>(ROLE_API, { requireAuth: true });
};

export const useUpdateRole = (roleId: number) => {
  return usePut<BaseResponseBody, RoleUpdateRequest>(`${ROLE_API}/${roleId}`, { requireAuth: true });
};

export const useDeleteRole = (roleId: number) => {
  return useDelete(`${ROLE_API}/${roleId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useRolesSWR = () => {
  return useSWRApi<RoleResponse[]>(ROLE_API, 'GET', { requireAuth: true });
};

export const useRoleDetailSWR = (roleId: number) => {
  return useSWRApi<RoleResponse>(`${ROLE_API}/${roleId}`, 'GET', { requireAuth: true });
};