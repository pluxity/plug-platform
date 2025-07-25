import { facilityServices, FacilityType } from "./facilities";

const hooks = [
  'useList',
  'useDetail',
  'useCreate',
  'useUpdate',
  'useDelete',
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
  'useDelete': [id: number];
  'useListSWR': [];
  'useDetailSWR': [id: number];
  'useHistorySWR': [id: number];
};

const exports = {} as Record<HookName, any>;

hooks.forEach((hookName) => {
  exports[hookName] = function<T extends FacilityType>(...args: [facilityType: T, ...params: HookParams[typeof hookName]]) {
    const [facilityType, ...params] = args;

    if (facilityType in facilityServices) {
      return (facilityServices[facilityType][hookName] as Function)(...params);
    }

    throw new Error(`Unknown facility type: ${facilityType}`);
  };
});

export const {
  useList,
  useDetail,
  useCreate,
  useUpdate,
  useDelete,
  useListSWR,
  useDetailSWR,
  useHistorySWR
} = exports;

export function useFacilityService<T extends FacilityType>(facilityType: T) {
  if (facilityType in facilityServices) {
    return facilityServices[facilityType];
  }
  throw new Error(`Unknown facility type: ${facilityType}`);
}
// TODO: 사용 예시 import 후 const { data: building, isLoading } = useDetail('buildings', id);