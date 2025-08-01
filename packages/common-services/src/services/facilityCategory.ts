import { useDelete, useGet, usePatch, usePost, useSWRApi } from "@plug/api-hooks";
import { FacilityCategory, FacilityCategoryResponse, FacilityCategoryRequest } from "@plug/common-services";

const FACILITY_CATEGORY_API = 'facility-category';

export const useFacilityCategories = () => {
  return useGet<FacilityCategoryResponse>(FACILITY_CATEGORY_API, { requireAuth: true });
}

export const useFacilityCategoryDetail = (facilityId: number) => {
  return useGet<FacilityCategory>(`${FACILITY_CATEGORY_API}/${facilityId}`, { requireAuth: true });
}

export const useCreateFacilityCategory = () => {
  return usePost<FacilityCategoryRequest>(FACILITY_CATEGORY_API, { requireAuth: true });
}

export const useUpdateFacilityCategory = (facilityId: number) => {
  return usePatch<FacilityCategoryRequest>(`${FACILITY_CATEGORY_API}/${facilityId}`, { requireAuth: true });
}

export const useDeleteFacilityCategory = (facilityId: number) => {
  return useDelete(`${FACILITY_CATEGORY_API}/${facilityId}`, { requireAuth: true });
}

// swr 기반 훅
export const useFacilityCategorySWR = () => {
  return useSWRApi<FacilityCategoryResponse[]>(FACILITY_CATEGORY_API, 'GET', { requireAuth: true });
}

export const useFacilityCategoryDetailSWR = (facilityId: number) => {
  return useSWRApi<FacilityCategory>(`${FACILITY_CATEGORY_API}/${facilityId}`, 'GET', { requireAuth: true });
}