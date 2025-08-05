import { api } from '@plug/api-hooks';
import { DataResponseBody } from '@plug/api-hooks';
import {
  FacilityCategoryResponse,
  FacilityCategoryAllResponse,
  FacilityCategoryCreateRequest,
  FacilityCategoryUpdateRequest
} from '../types';

export const facilityCategoryService = {
  // 시설 카테고리 목록 조회 (전체 계층 구조)
  getAll: async (): Promise<DataResponseBody<FacilityCategoryAllResponse>> => {
    return api.get<FacilityCategoryAllResponse>('/facility-categories');
  },

  // 시설 카테고리 상세 조회
  getById: async (id: number): Promise<DataResponseBody<FacilityCategoryResponse>> => {
    return api.get<FacilityCategoryResponse>(`/facility-categories/${id}`);
  },

  // 시설 카테고리 생성
  create: async (data: FacilityCategoryCreateRequest): Promise<void> => {
    await api.post('/facility-categories', data);
  },

  // 시설 카테고리 수정
  update: async (id: number, data: FacilityCategoryUpdateRequest): Promise<void> => {
    return api.patch(`/facility-categories/${id}`, data);
  },

  // 시설 카테고리 삭제
  delete: async (id: number): Promise<void> => {
    return api.delete(`/facility-categories/${id}`);
  },
};
