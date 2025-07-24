import { FacilityRegistry } from "@/backoffice/domains/facility/plugin/registry/FacilityRegistry";
import { FacilityType } from "../store/FacilityListStore";
import * as services from "@plug/common-services";
import { FacilityData } from "../types/facilityData";

type ServiceHook = (...args: unknown[]) => {
  execute: (data: unknown) => Promise<unknown>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
};

export class FacilityManager {
  static getCreateService(type: FacilityType): ServiceHook | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return null;

    const hookName = definition.createServiceHook;
    return hookName && hookName in services
      ? (services[hookName as keyof typeof services] as ServiceHook)
      : null;
  }

  static getDetailService(type: FacilityType): ServiceHook | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return null;

    const hookName = definition.detailServiceHook;
    return hookName && hookName in services
      ? (services[hookName as keyof typeof services] as ServiceHook)
      : null;
  }

  static getUpdateService(type: FacilityType): ServiceHook | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return null;

    const hookName = definition.updateServiceHook;
    return hookName && hookName in services
      ? (services[hookName as keyof typeof services] as ServiceHook)
      : null;
  }

  static getDeleteService(type: FacilityType): ServiceHook | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return null;

    const hookName = definition.deleteServiceHook;
    return hookName && hookName in services
      ? (services[hookName as keyof typeof services] as ServiceHook)
      : null;
  }

  static validateData(type: FacilityType, data: FacilityData): string | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return '지원되지 않는 시설 유형입니다';

    return definition.validateData ? definition.validateData(data) : null;
  }
}