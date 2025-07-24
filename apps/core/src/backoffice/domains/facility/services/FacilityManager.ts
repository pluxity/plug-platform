import { FacilityRegistry } from "../create/FacilityRegistry";
import { FacilityType } from "../store/FacilityListStore";
import * as services from "@plug/common-services";

export class FacilityManager {

  static getCreateService(type: FacilityType): Function | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return null;

    const hookName = definition.createServiceHook;
    return hookName ? (services as any)[hookName] : null;
  }

  static getDetailService(type: FacilityType): Function | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return null;

    const hookName = definition.detailServiceHook;
    return hookName ? (services as any)[hookName] : null;
  }

  static getUpdateService(type: FacilityType): Function | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return null;

    const hookName = definition.updateServiceHook;
    return hookName ? (services as any)[hookName] : null;
  }

  static validateData(type: FacilityType, data: any): string | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return '지원되지 않는 시설 유형입니다';

    return definition.validateData ? definition.validateData(data) : null;
  }
}