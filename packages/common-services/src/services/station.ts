import { useSWRApi } from "@plug/api-hooks";
import { BuildingResponse } from "../types";

export const useStationsSWR = () => {
  return useSWRApi<BuildingResponse[]>('building', 'GET', { requireAuth: true });
};

export const useStationDetailSWR = (buildingId: number) => {
  return useSWRApi<BuildingResponse>(`building/${buildingId}`, 'GET', { requireAuth: true });
};