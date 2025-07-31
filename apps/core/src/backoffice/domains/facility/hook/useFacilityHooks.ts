import { useEffect } from "react";
import { useDetail, useCreate, useUpdate, useDeletion } from "@plug/common-services";
import { FacilityService } from "../services/facilityService";
import { FacilityType } from "@/backoffice/domains/facility/store/FacilityListStore";

export function useFacilityDetail<T = any>(type: FacilityType, id: number) {
  const hookResult = useDetail(type, id);

  useEffect(() => {
    if (!type) return;

    const facilityService = FacilityService.getInstance();
    facilityService.registerHook(type, 'useDetail', id, hookResult);

    return () => {
      if (type) facilityService.clearHook(type, 'useDetail', id);
    };
  }, [type, id, hookResult]);

  return hookResult;
}

export function useFacilityCreate<T = any>(type: FacilityType) {
  const hookResult = useCreate(type);

  useEffect(() => {
    if (!type) return;

    const facilityService = FacilityService.getInstance();
    facilityService.registerHook(type, 'useCreate', null, hookResult);

    return () => {
      if (type) facilityService.clearHook(type, 'useCreate', null);
    };
  }, [type, hookResult]);

  return hookResult;
}

export function useFacilityUpdate<T = any>(type: FacilityType, id: number) {
  const hookResult = useUpdate(type, id);

  useEffect(() => {
    if (!type) return; // null 타입 처리

    const facilityService = FacilityService.getInstance();
    facilityService.registerHook(type, 'useUpdate', id, hookResult);

    return () => {
      if (type) facilityService.clearHook(type, 'useUpdate', id);
    };
  }, [type, id, hookResult]);

  return hookResult;
}

export function useFacilityDeletion(type: FacilityType, id: number) {
  const hookResult = useDeletion(type, id);

  useEffect(() => {
    if (!type) return;

    const facilityService = FacilityService.getInstance();
    facilityService.registerHook(type, 'useDeletion', id, hookResult);

    return () => {
      if (type) facilityService.clearHook(type, 'useDeletion', id);
    };
  }, [type, id, hookResult]);

  return hookResult;
}