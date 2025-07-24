import { FacilityRegistry } from "../plugin/registry/FacilityRegistry";
import { FacilityType } from "../store/FacilityListStore";
import * as services from "@plug/common-services";
import { FacilityData } from "../types/facilityData";

export type ServiceHook<TRequest = unknown, TResponse = unknown> = (...args: unknown[]) => {
  execute: (data: TRequest) => Promise<TResponse>;
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

  static getService<K extends keyof typeof services>(serviceName: K): typeof services[K] | null {
    if (serviceName in services) {
      return services[serviceName];
    }
    return null;
  }

  static getFacilityServices(type: FacilityType) {
    return {
      create: this.getCreateService(type),
      detail: this.getDetailService(type),
      update: this.getUpdateService(type),
      delete: this.getDeleteService(type)
    };
  }

  static async fetchFacilityDetail<T extends FacilityData>(type: FacilityType, id: number): Promise<T | null> {
    const detailService = this.getDetailService(type);
    if (!detailService) return null;

    try {
      const response = await detailService(id).execute({});
      return response as unknown as T;
    } catch (error) {
      console.error(`시설물 상세 정보 조회 실패 (${type}, ID: ${id}):`, error);
      return null;
    }
  }

  static async updateFacility<T extends FacilityData>(type: FacilityType, id: number, data: Partial<T>): Promise<boolean> {
    const updateService = this.getUpdateService(type);
    if (!updateService) return false;

    try {
      await updateService(id).execute(data);
      return true;
    } catch (error) {
      console.error(`시설물 업데이트 실패 (${type}, ID: ${id}):`, error);
      return false;
    }
  }

  static async deleteFacility(type: FacilityType, id: number): Promise<boolean> {
    const deleteService = this.getDeleteService(type);
    if (!deleteService) return false;

    try {
      await deleteService(id).execute({});
      return true;
    } catch (error) {
      console.error(`시설물 삭제 실패 (${type}, ID: ${id}):`, error);
      return false;
    }
  }
}