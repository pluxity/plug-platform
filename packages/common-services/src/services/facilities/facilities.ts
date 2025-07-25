import { useGet, usePost, useDelete, useSWRApi, usePut } from "@plug/api-hooks";
import { FacilityInterfaces } from "../../types/facility";

export function createFacilityService<F extends FacilityInterfaces<any, any, any>>(endPoint: string) {

  type C_REQ = F['CREATE_REQUEST'];
  type U_REQ = F['UPDATE_REQUEST'];
  type RES = F['RESPONSE'];

  return {
    useList: () =>
      useGet<RES[]>(endPoint, { requireAuth: true }),

    useDetail: (id: number) =>
      useGet<RES>(`${endPoint}/${id}`, { requireAuth: true }),

    useCreate: () =>
      usePost<C_REQ>(endPoint, { requireAuth: true }),

    useUpdate: (id: number) =>
      usePut<U_REQ>(`${endPoint}/${id}`, { requireAuth: true }),

    useDelete: (id: number) =>
      useDelete(`${endPoint}/${id}`, { requireAuth: true }),

    useListSWR: () =>
      useSWRApi<RES[]>(endPoint, 'GET', { requireAuth: true }),

    useDetailSWR: (id: number) =>
      useSWRApi<RES>(`${endPoint}/${id}`, 'GET', { requireAuth: true }),

  };
}

