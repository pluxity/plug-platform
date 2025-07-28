import { FacilityRegistry } from "../plugin/registry/FacilityRegistry";
import { FacilityType } from "../store/FacilityListStore";
import * as services from "@plug/common-services";
import { FacilityData } from "../types/facilityTypeGuard";

export type ServiceHook<TRequest = unknown, TResponse = unknown> = (...args: unknown[]) => {
  execute: (data: TRequest) => Promise<TResponse>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
};

export class FacilityManager {
  static getCreateService(_type:FacilityType): ServiceHook | null {
    return services.useCreate as ServiceHook;
  }

  static getUpdateService(_type:FacilityType): ServiceHook | null {
    return services.useUpdate as ServiceHook;
  }

  static getDetailService(_type: FacilityType): ServiceHook | null {
    return services.useDetail as ServiceHook;
  }

  static getDeleteService(_type: FacilityType): ServiceHook | null {
    return services.useDeletion as ServiceHook;
  }

  static validateData(type: FacilityType, data: FacilityData): string | null {
    const definition = FacilityRegistry.get(type);
    if (!definition) return "지원되지 않는 시설 유형입니다";

    return definition.validateData ? definition.validateData(data) : null;
  }

  static getService<K extends keyof typeof services>(
    serviceName: K,
  ): (typeof services)[K] | null {
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
      delete: this.getDeleteService(type),
    };
  }

  static async fetchFacilityDetail<T extends FacilityData>(
    type: FacilityType,
    id: number,
  ): Promise<T | null> {
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

  static async updateFacility<T extends FacilityData>(
    type: FacilityType,
    id: number,
    data: Partial<T>,
  ): Promise<boolean> {
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

  static async deleteFacility(
    type: FacilityType,
    id: number,
  ): Promise<boolean> {
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