import { useGet, usePost, usePatch, useSWRApi } from '@plug/api-hooks';
import { api } from '@plug/api-hooks/core';
import type { 
  Label3DResponse, 
  Label3DCreateRequest, 
  Label3DUpdateRequest
} from '../types/label3d';

const END_POINT = `label-3d`;

// Label3D 목록 조회
export const useLabel3Ds = () => {
  return useGet<Label3DResponse[]>(END_POINT, { requireAuth: true });
};

// Label3D 상세 조회
export const useLabel3DDetail = (id: string) => {
  return useGet<Label3DResponse>(`${END_POINT}/${id}`, { requireAuth: true });
};

// Label3D 생성
export const useCreateLabel3D = () => {
  return usePost<Label3DCreateRequest>(END_POINT, { requireAuth: true });
};

// Label3D 수정
export const useUpdateLabel3D = (id: string) => {
  return usePatch<Label3DUpdateRequest>(`${END_POINT}/${id}`, { requireAuth: true });
};

// Label3D 삭제
export const deleteLabel3D = async (id: string) => {
  return api.delete(`${END_POINT}/${id}`, { requireAuth: true });
};

// Facility별 Label3D 조회
export const useFacilityLabel3Ds = (facilityId: string) => {
  return useGet<Label3DResponse[]>(`${END_POINT}/facility/${facilityId}`, { requireAuth: true });
};

// SWR 기반 훅들
export const useLabel3DsSWR = () => {
  return useSWRApi<Label3DResponse[]>(END_POINT, 'GET', { requireAuth: true });
};

export const useLabel3DDetailSWR = (id: string) => {
  return useSWRApi<Label3DResponse>(`${END_POINT}/${id}`, 'GET', { requireAuth: true });
};

export const useFacilityLabel3DsSWR = (facilityId: string) => {
  return useSWRApi<Label3DResponse[]>(`${END_POINT}/facility/${facilityId}`, 'GET', { requireAuth: true });
};
