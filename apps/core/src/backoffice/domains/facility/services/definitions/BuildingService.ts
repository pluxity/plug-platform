import { FacilityServiceBase } from "../facilityServiceBase";
import { FacilityData, FacilityFormData } from "../../types/facilityTypeGuard";
import { Floor } from "@plug/common-services";
import { IFacilityService } from "../facilityServiceFactory";
import { DrawingUpdateOptions } from "@/backoffice/domains/facility/types/facilityTypes";

export class BuildingService extends FacilityServiceBase implements IFacilityService {
  async fetchDetail(id: number): Promise<FacilityData | null> {
    const detailHook = this.getHook('buildings', 'useDetail', id);
    if (!detailHook) {
      console.error(`Building detail hook not found for ID: ${id}`);
      return null;
    }
    const result = await this.executeApiHook(detailHook, {});
    return result as FacilityData | null;
  }

  async create(data: FacilityFormData): Promise<boolean> {
    const createHook = this.getHook('buildings', 'useCreate', null);
    if (!createHook) {
      console.error('Building create hook not found');
      return false;
    }

    try {
      await this.executeApiHook(createHook, data);
      return true;
    } catch (error) {
      console.error("건물 생성 실패:", error);
      return false;
    }
  }

  async update(id: number, data: Partial<FacilityFormData>): Promise<boolean> {
    const updateHook = this.getHook('buildings', 'useUpdate', id);
    if (!updateHook) {
      console.error(`Building update hook not found for ID: ${id}`);
      return false;
    }

    try {
      await this.executeApiHook(updateHook, data);
      return true;
    } catch (error) {
      console.error(`건물 업데이트 실패 (ID: ${id}):`, error);
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    const deleteHook = this.getHook('buildings', 'useDeletion', id);
    if (!deleteHook) {
      console.error(`Building delete hook not found for ID: ${id}`);
      return false;
    }

    try {
      await this.executeApiHook(deleteHook, {});
      return true;
    } catch (error) {
      console.error(`건물 삭제 실패 (ID: ${id}):`, error);
      return false;
    }
  }

  async updateDrawing(id: number, data: DrawingUpdateOptions): Promise<boolean> {
    const updateDrawingHook = this.getHook('buildings', 'useUpdateDrawing', id);
    if (!updateDrawingHook) {
      console.error(`Building drawing update hook not found for ID: ${id}`);
      return false;
    }

    try {
      const params = { ...data } as Record<string, unknown>;
      await this.executeApiHook(updateDrawingHook, params);
      return true;
    } catch (error) {
      console.error(`건물 도면 업데이트 실패 (ID: ${id}):`, error);
      return false;
    }
  }


  async updateFloors(id: number, floors: Floor[]): Promise<boolean> {
    const updateHook = this.getHook('buildings', 'useUpdate', id);
    if (!updateHook) {
      console.error(`Building update hook not found for ID: ${id}`);
      return false;
    }

    try {
      await this.executeApiHook(updateHook, { floors });
      return true;
    } catch (error) {
      console.error(`건물 층 정보 업데이트 실패 (ID: ${id}):`, error);
      return false;
    }
  }
}