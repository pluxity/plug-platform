import { useGet, usePost, useDelete, useSWRApi, usePut } from "@plug/api-hooks";
import { FacilityHistoryResponse, FacilityUpdateRequest } from "../../types";

export function createFacilityService<
  TResponse,
  TCreateRequest,
  TUpdateRequest = FacilityUpdateRequest
>(endPoint: string) {
  return {
    useList: () => useGet<TResponse[]>(endPoint, { requireAuth: true }),

    useDetail: (id: number) => useGet<TResponse>(`${endPoint}/${id}`, { requireAuth: true }),

    useCreate: () => usePost<TCreateRequest>(endPoint, { requireAuth: true }),

    useUpdate: (id: number) => usePut<TUpdateRequest>(`${endPoint}/${id}`, { requireAuth: true }),

    useDelete: (id: number) => useDelete(`${endPoint}/${id}`, { requireAuth: true }),

    useListSWR: () => useSWRApi<TResponse[]>(endPoint, 'GET', { requireAuth: true }),

    useDetailSWR: (id: number) => useSWRApi<TResponse>(`${endPoint}/${id}`, 'GET', { requireAuth: true }),

    useHistorySWR: (id: number) =>
      useSWRApi<FacilityHistoryResponse[]>(`${endPoint}/${id}/history`, 'GET', { requireAuth: true }),
  };
}