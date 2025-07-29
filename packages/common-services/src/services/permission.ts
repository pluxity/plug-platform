import { useGet, usePost, usePatch, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';

import type{
    PermissionCreateRequest,
    PermissionUpdateRequest,
    PermissionResponse
} from '@plug/common-services';

const END_POINT = `permissions`;

// 권한 목록 조회
export const usePermissions = () => {
    return useGet<PermissionResponse[]>(END_POINT, { requireAuth: true });
}

// 권한 상세 조회
export const usePermissionDetail = (permissionId: number) => {
    return useGet<PermissionResponse>(`${END_POINT}/${permissionId}`, { requireAuth: true });
}

// 권한 생성
export const useCreatePermission = () => {
    return usePost<PermissionCreateRequest>(END_POINT, { requireAuth: true });
}

// 권한 수정
export const useUpdatePermission = (permissionId: number) => {
    return usePatch<PermissionUpdateRequest>(`${END_POINT}/${permissionId}`, { requireAuth: true });
}

// 권한 삭제
export const deletePermission = async (permissionId: number) => {
    return api.delete(`${END_POINT}/${permissionId}`, { requireAuth: true });
}

// SWR 기반 훅
export const usePermissionsSWR = () => {
    return useSWRApi<PermissionResponse[]>(END_POINT, 'GET', { requireAuth: true });
}

export const usePermissionDetailSWR = (permissionId: number) => {
    const url = permissionId ? `${END_POINT}/${permissionId}` : '';
    return useSWRApi<PermissionResponse>(url, 'GET', { requireAuth: true }, {
        isPaused: () => !permissionId, // permissionId가 없으면 요청 중단
    });
}

// 권한 설정 가능 리소스 타입 목록 조회
export const useResourceTypesSWR = () => {
    return useSWRApi<string[]>(`${END_POINT}/resource-types`, 'GET', { requireAuth: true });
}


