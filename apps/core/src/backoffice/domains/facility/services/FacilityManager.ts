import { FacilityRegistry } from "../plugin/registry/FacilityRegistry";
import { FacilityType } from "../store/FacilityListStore";
import * as services from "@plug/common-services";
import { FacilityData, FacilityFormData } from "../types/facilityTypeGuard";

export type ServiceHook<TRequest = unknown, TResponse = unknown> = (
  id?: number
) => {
  execute: (data: TRequest) => Promise<TResponse>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
};

export class FacilityManager {
  static getCreateService(type: FacilityType): ServiceHook | null {
    if (type === "buildings" || type === "stations") {
      return services.useCreate as ServiceHook;
    }
    return null;
  }

  static getUpdateService(type: FacilityType): ServiceHook | null {
    if (type === "buildings" || type === "stations") {
      return services.useUpdate as ServiceHook;
    }
    return null;
  }

  static getDetailService(type: FacilityType): ServiceHook | null {
    if (type === "buildings" || type === "stations") {
      return services.useDetail as ServiceHook;
    }
    return null;
  }

  static getDeleteService(type: FacilityType): ServiceHook | null {
    if (type === "buildings" || type === "stations") {
      return services.useDeletion as ServiceHook;
    }
    return null;
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

  static async createFacility(
    type: FacilityType,
    data: FacilityFormData,
  ): Promise<boolean> {
    const createService = this.getCreateService(type);
    if (!createService) return false;

    try {
      const service = createService();
      await service.execute(data);
      return true;
    } catch (error) {
      console.error(`시설물 생성 실패 (${type}):`, error);
      return false;
    }
  }

  static async fetchFacilityDetail<T extends FacilityData>(
    type: FacilityType,
    id: number,
  ): Promise<T | null> {
    const detailService = this.getDetailService(type);
    if (!detailService) return null;

    try {
      const service = detailService(id);
      const response = await service.execute({});
      return response as unknown as T;
    } catch (error) {
      console.error(`시설물 상세 정보 조회 실패 (${type}, ID: ${id}):`, error);
      return null;
    }
  }

  static async updateFacility(
    type: FacilityType,
    id: number,
    data: Partial<FacilityFormData>,
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