import { useEffect } from "react";
import { useDetail, useCreate, useUpdate, useDeletion } from "@plug/common-services";
import { FacilityServiceFactory } from "../services/facilityServiceFactory";
import { FacilityType } from "@/backoffice/domains/facility/store/FacilityListStore";

interface HookResult {
  data?: any;
  execute?: (...args: any[]) => Promise<any>;
  isLoading: boolean;
  error?: Error;
}

export function useFacilityDetail(type: FacilityType, id: number): HookResult {
  const hookResult = useDetail(type, id);

  useEffect(() => {
    if (!type) return;

    const facilityService = FacilityServiceFactory.getService(type);
    if (facilityService?.registerHook) {
      facilityService.registerHook(type, 'useDetail', id, hookResult);
    }

    return () => {
      if (type && facilityService?.clearHook) {
        facilityService.clearHook(type, 'useDetail', id);
      }
    };
  }, [type, id, hookResult]);

  return hookResult;
}

export function useFacilityCreate(type: FacilityType): HookResult {
  const hookResult = useCreate(type);

  useEffect(() => {
    if (!type) return;

    const facilityService = FacilityServiceFactory.getService(type);
    if (facilityService?.registerHook) {
      facilityService.registerHook(type, 'useCreate', null, hookResult);
    }

    return () => {
      if (type && facilityService?.clearHook) {
        facilityService.clearHook(type, 'useCreate', null);
      }
    };
  }, [type, hookResult]);

  return hookResult;
}

export function useFacilityUpdate(type: FacilityType, id: number): HookResult {
  const hookResult = useUpdate(type, id);

  useEffect(() => {
    if (!type) return;

    const facilityService = FacilityServiceFactory.getService(type);
    if (facilityService?.registerHook) {
      facilityService.registerHook(type, 'useUpdate', id, hookResult);
    }

    return () => {
      if (type && facilityService?.clearHook) {
        facilityService.clearHook(type, 'useUpdate', id);
      }
    };
  }, [type, id, hookResult]);

  return hookResult;
}

export function useFacilityDeletion(type: FacilityType, id: number): HookResult {
  const hookResult = useDeletion(type, id);

  useEffect(() => {
    if (!type) return;

    const facilityService = FacilityServiceFactory.getService(type);
    if (facilityService?.registerHook) {
      facilityService.registerHook(type, 'useDeletion', id, hookResult);
    }

    return () => {
      if (type && facilityService?.clearHook) {
        facilityService.clearHook(type, 'useDeletion', id);
      }
    };
  }, [type, id, hookResult]);

  return hookResult;
}