import { FacilitiesAllResponse } from "../types";
import { useSWRApi } from "@plug/api-hooks";

export const useFacilitiesAllSWR = () => {
  return useSWRApi<FacilitiesAllResponse>('facilities', 'GET', { requireAuth: true })}