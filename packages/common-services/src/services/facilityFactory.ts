import { useGet, usePost, useDelete, useSWRApi, usePut } from "@plug/api-hooks";
import { FacilityInterfaces, FacilityFactory } from "../types";
import { FacilityHistoryResponse } from "../types/facility";

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

    useDeletion: (id: number) =>
      useDelete(`${endPoint}/${id}`, { requireAuth: true }),

    useListSWR: () =>
      useSWRApi<RES[]>(endPoint, 'GET', { requireAuth: true }),

    useDetailSWR: (id: number) =>
      useSWRApi<RES>(`${endPoint}/${id}`, 'GET', { requireAuth: true }),

    useHistorySWR: (id: number) =>
      useSWRApi<FacilityHistoryResponse>(`${endPoint}/${id}/history`, 'GET', { requireAuth: true }),
  };
}

export const facilityServices: Record<FacilityFactory, ReturnType<typeof createFacilityService<any>>> = {
  'buildings': createFacilityService<FacilityInterfaces<any, any, any>>('buildings'),
  'stations': createFacilityService<FacilityInterfaces<any, any, any>>('stations')
};

const hooks = [
  'useList',
  'useDetail',
  'useCreate',
  'useUpdate',
  'useDeletion',
  'useListSWR',
  'useDetailSWR',
  'useHistorySWR'
] as const;

type HookName = typeof hooks[number];

type HookParams = {
  'useList': [];
  'useDetail': [id: number];
  'useCreate': [];
  'useUpdate': [id: number];
  'useDeletion': [id: number];
  'useListSWR': [];
  'useDetailSWR': [id: number];
  'useHistorySWR': [id: number];
};

const exports = {} as Record<HookName, any>;

hooks.forEach((hookName) => {
  exports[hookName] = function<T extends FacilityFactory>(...args: [facilityType: T, ...params: HookParams[typeof hookName]]) {
    const [facilityType, ...params] = args;

    if (facilityType in facilityServices) {
      return (facilityServices[facilityType][hookName] as Function)(...params);
    }

    throw new Error(`알 수 없는 시설 타입입니다: ${facilityType}`);
  };
});

export const {
  useList,
  useDetail,
  useCreate,
  useUpdate,
  useDeletion,
  useListSWR,
  useDetailSWR,
  useHistorySWR
} = exports;

export function useFacilityService<T extends FacilityFactory>(facilityType: T) {
  if (facilityType in facilityServices) {
    return facilityServices[facilityType];
  }
  throw new Error(`알 수 없는 시설 타입입니다: ${facilityType}`);
}

// 사용 예시:
// import { useDetail } from '@plug/common-services';
// const { data: building, isLoading } = useDetail('buildings', id);