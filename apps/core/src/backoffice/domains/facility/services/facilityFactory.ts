import { FacilityType } from "../store/FacilityListStore";
import { FacilityData } from "../types/facilityTypeGuard";
import { BuildingService } from "@/backoffice/domains/facility/services/definitions/BuildingService";
import { StationService } from "@/backoffice/domains/facility/services/definitions/StationService";

export interface IFacilityService {
  fetchDetail(id: number): Promise<FacilityData | null>;
  create(data: any): Promise<boolean>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

export class FacilityServiceFactory {
  private static serviceRegistry: Map<FacilityType, IFacilityService> = new Map();

  public static registerService(type: FacilityType, service: IFacilityService): void {
    this.serviceRegistry.set(type, service);
  }

  public static getService(type: FacilityType): IFacilityService {
    const service = this.serviceRegistry.get(type);
    if (!service) {
      throw new Error(`지원되지 않는 시설 타입입니다: ${type}`);
    }
    return service;
  }

  public static initialize(): void {
    this.registerService('buildings', new BuildingService());
    this.registerService('stations', new StationService());
  }
}

FacilityServiceFactory.initialize();