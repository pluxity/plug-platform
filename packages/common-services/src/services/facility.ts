import { usePatch, useSWRApi } from "@plug/api-hooks";
import {FacilitiesAllResponse, FacilityDrawingUpdateRequest} from "../types";

const END_POINT = 'facilities';

// path
export const useCreateFacilitiesPath = () => {
  return usePatch(`${END_POINT}/path`, { requireAuth: true });
}

export const useUpdateFacilitiesPath = (facilityId: number, pathId: number) => {
  return usePatch(`${END_POINT}/${facilityId}/path/${pathId}`, { requireAuth: true });
}

export const useDeleteFacilitiesPath = (facilityId: number, pathId: number) => {
  return usePatch(`${END_POINT}/${facilityId}/path/${pathId}`, { requireAuth: true });
}

export const useUpdateFacilitiesDrawing = (facilityId: number) => {
  return usePatch<FacilityDrawingUpdateRequest>(`${END_POINT}/${facilityId}/drawing`, { requireAuth: true });
}

export const useFacilitiesAllSWR = () => {
  return useSWRApi<FacilitiesAllResponse>(END_POINT, 'GET', { requireAuth: true })}