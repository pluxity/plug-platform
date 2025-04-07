import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import type { RoleResponse, RoleCreateRequest, RoleUpdateRequest } from '@plug/common-services';

const ROLE_API = `/roles`;

export const useRoles = () => {
  return useGet<RoleResponse[]>(ROLE_API);
};

export const useRoleDetail = (roleId: number) => {
  return useGet<RoleResponse>(`${ROLE_API}/${roleId}`);
};

export const useCreateRole = () => {
  return usePost<CreatedResponseBody, RoleCreateRequest>(ROLE_API);
};

export const useUpdateRole = (roleId: number) => {
  return usePut<BaseResponseBody, RoleUpdateRequest>(`${ROLE_API}/${roleId}`);
};

export const useDeleteRole = (roleId: number) => {
  return useDelete(`${ROLE_API}/${roleId}`);
};

// SWR 기반 훅
export const useRolesSWR = () => {
  return useSWRApi<RoleResponse[]>(ROLE_API);
};

export const useRoleDetailSWR = (roleId: number) => {
  return useSWRApi<RoleResponse>(`${ROLE_API}/${roleId}`);
};