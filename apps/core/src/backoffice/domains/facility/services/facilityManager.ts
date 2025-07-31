import { FacilityData, FacilityFormData } from "../types/facilityTypeGuard";
import { FacilityService } from "./facilityService";
import { FacilityType } from "@/backoffice/domains/facility/store/FacilityListStore";

export class FacilityManager {
  static async fetchFacilityDetail<T extends FacilityData>(
    type: FacilityType,
    id: number,
  ): Promise<T | null> {
    const facilityService = FacilityService.getInstance();
    return facilityService.fetchFacilityDetail<T>(type, id);
  }

  static async createFacility(
    type: FacilityType,
    data: FacilityFormData,
  ): Promise<boolean> {
    const facilityService = FacilityService.getInstance();
    return facilityService.createFacility(type, data);
  }

  static async updateFacility(
    type: FacilityType,
    id: number,
    data: Partial<FacilityFormData>,
  ): Promise<boolean> {
    const facilityService = FacilityService.getInstance();
    return facilityService.updateFacility(type, id, data);
  }

  static async deleteFacility(
    type: FacilityType,
    id: number,
  ): Promise<boolean> {
    const facilityService = FacilityService.getInstance();
    return facilityService.deleteFacility(type, id);
  }
}