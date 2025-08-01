import { FacilityType } from "../types/facilityTypes";
import { FacilityData } from "../types/facilityTypeGuard";
import { BuildingService } from "./definitions/BuildingService";
import { StationService } from "./definitions/StationService";

export interface IFacilityService {
  fetchDetail(id: number): Promise<FacilityData | null>;
  create(data: any): Promise<boolean>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  updateDrawing?(id: number, data: any): Promise<boolean>;
  getHook?(resourceType: string, hookName: string, id: number | null): any;
  registerHook?(resourceType: string, hookName: string, id: number | null, hook: any): void;
  clearHook?(resourceType: string, hookName: string, id: number | null): void;
  executeApiHook?(hook: any, params: any): Promise<any>;
}

export class FacilityServiceFactory {
  private static serviceRegistry: Map<FacilityType, IFacilityService> = new Map();
  private static instance: FacilityServiceFactory;

  private constructor() {}

  public static getInstance(): FacilityServiceFactory {
    if (!FacilityServiceFactory.instance) {
      FacilityServiceFactory.instance = new FacilityServiceFactory();
    }
    return FacilityServiceFactory.instance;
  }

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

  public static supportsFacilityType(type: FacilityType): boolean {
    return this.serviceRegistry.has(type);
  }

  public static getSupportedTypes(): FacilityType[] {
    return Array.from(this.serviceRegistry.keys());
  }

  public static initialize(): void {
    this.registerService('buildings', new BuildingService());
    this.registerService('stations', new StationService());
  }
}

FacilityServiceFactory.initialize();