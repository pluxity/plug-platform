import { api } from '@plug/api-hooks/core';
import { useGet, usePut, usePost, useSWRApi } from '@plug/api-hooks';
import type { CctvResponse, CctvUpdateRequest, CctvCreateRequest } from '@plug/common-services';

const END_POINT = `cctvs`;

// CCTV 상세 조회 
export const useCctvDetail = (cctvId: string) => {
    return useGet<CctvResponse>(`${END_POINT}/${cctvId}`, { requireAuth: true });
};

// CCTV 목록 조회 
export const useCctv = () => {
    return useGet<CctvResponse[]>(END_POINT, { requireAuth: true });
}

// CCTV 수정 
export const useUpdateCctv = (cctvId: string) => {
    return usePut<CctvUpdateRequest>(`${END_POINT}/${cctvId}`, { requireAuth: true });
}

// CCTV 삭제 
export const deleteCctv = async (cctvId: string) => {
    return api.delete(`${END_POINT}/${cctvId}`, { requireAuth: true });
}

// CCTV 생성 
export const useCreateCctv = () => {
    return usePost<CctvCreateRequest>(END_POINT, { requireAuth: true });
}

// SWR 기반 훅 
export const useCctvSWR = () => {
    return useSWRApi<CctvResponse[]>(END_POINT, 'GET', { requireAuth: true });
}

export const useCctvDetailSWR = (cctvId: string) => {
    const url = cctvId ? `${END_POINT}/${cctvId}` : '';
    return useSWRApi<CctvResponse>(url, 'GET', { requireAuth: true }, {
        isPaused: () => !cctvId,
    });
}