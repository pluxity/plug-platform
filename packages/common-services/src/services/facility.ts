import { FacilitiesAllResponse, FacilityDrawingUpdateRequest } from "../types";
import { usePatch, useSWRApi } from "@plug/api-hooks";

export const useUpdateFacilitiesDrawing = (facilityId: number) => {
  return usePatch<FacilityDrawingUpdateRequest>(`facilities/drawing/${facilityId}`, { requireAuth: true });
}

export const useFacilitiesAllSWR = () => {
  return useSWRApi<FacilitiesAllResponse>('facilities', 'GET', { requireAuth: true })}