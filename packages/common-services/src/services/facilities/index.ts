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

function createHookFunction<H extends HookName>(hookName: H) {
  return function<T extends FacilityType>(...args: [facilityType: T, ...params: HookParams[H]]) {
    const [facilityType, ...params] = args;

    if (facilityType in facilityServices) {
      return (facilityServices[facilityType][hookName] as Function)(...params);
    }

    throw new Error(`Unknown facility type: ${facilityType}`);
  };
}

export const useList = createHookFunction('useList');
export const useDetail = createHookFunction('useDetail');
export const useCreate = createHookFunction('useCreate');
export const useUpdate = createHookFunction('useUpdate');
export const useDelete = createHookFunction('useDelete');
export const useListSWR = createHookFunction('useListSWR');
export const useDetailSWR = createHookFunction('useDetailSWR');
export const useHistorySWR = createHookFunction('useHistorySWR');

export function useFacilityService<T extends FacilityType>(facilityType: T) {
  if (facilityType in facilityServices) {
    return facilityServices[facilityType];
  }
  throw new Error(`Unknown facility type: ${facilityType}`);
}