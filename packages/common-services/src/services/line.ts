import { usePost, useSWRApi } from "@plug/api-hooks";
import { LineResponse, LineRequest } from "../types";

const END_POINT = 'lines';

export const useCreateLine = () => {
  return usePost<LineRequest>(END_POINT, { requireAuth: true });
}

export const useUpdateLine = (lineId: number) => {
  return usePost<LineRequest>(`${END_POINT}/${lineId}`, { requireAuth: true });
}

export const useDeleteLine = (lineId: number) => {
  return usePost(`${END_POINT}/${lineId}`, { requireAuth: true });
}

export const useLineAddStation = (lineId: number) => {
  return usePost(`${END_POINT}/${lineId}/stations`, { requireAuth: true });
}

// swr 기반 훅
export const useLinesSWR = () => {
  return useSWRApi<LineResponse[]>(END_POINT, 'GET', { requireAuth: true });
}

export const useLineDetailSWR = (lineId: number) => {
  return useSWRApi<LineResponse>(`${END_POINT}/${lineId}`, 'GET', { requireAuth: true });
}

export const useLineStationsSWR = (lineId: number) => {
  return useSWRApi<LineResponse>(`${END_POINT}/${lineId}/stations`, 'GET', { requireAuth: true });
}