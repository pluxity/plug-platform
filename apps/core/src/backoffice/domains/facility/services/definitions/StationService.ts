import { FacilityServiceBase } from "../facilityServiceBase";
import { FacilityData, FacilityFormData } from "../../types/facilityTypeGuard";
import { DrawingUpdateOptions, IFacilityService } from "@/backoffice/domains/facility/types/facilityFactory";

export class StationService extends FacilityServiceBase implements IFacilityService {
  async fetchDetail(id: number): Promise<FacilityData | null> {
    const detailHook = this.getHook('stations', 'useDetail', id);
    if (!detailHook) {
      console.error(`Station detail hook not found for ID: ${id}`);
      return null;
    }
    return this.executeApiHook(detailHook, {});
  }

  async create(data: FacilityFormData): Promise<boolean> {
    const createHook = this.getHook('stations', 'useCreate', null);
    if (!createHook) {
      console.error('Station create hook not found');
      return false;
    }

    try {
      await this.executeApiHook(createHook, data);
      return true;
    } catch (error) {
      console.error("역 생성 실패:", error);
      return false;
    }
  }

  async update(id: number, data: Partial<FacilityFormData>): Promise<boolean> {
    const updateHook = this.getHook('stations', 'useUpdate', id);
    if (!updateHook) {
      console.error(`Station update hook not found for ID: ${id}`);
      return false;
    }

    try {
      await this.executeApiHook(updateHook, data);
      return true;
    } catch (error) {
      console.error(`역 업데이트 실패 (ID: ${id}):`, error);
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    const deleteHook = this.getHook('stations', 'useDeletion', id);
    if (!deleteHook) {
      console.error(`Station delete hook not found for ID: ${id}`);
      return false;
    }

    try {
      await this.executeApiHook(deleteHook, {});
      return true;
    } catch (error) {
      console.error(`역 삭제 실패 (ID: ${id}):`, error);
      return false;
    }
  }

  async updateDrawing(id: number, data: DrawingUpdateOptions): Promise<boolean> {
    const updateDrawingHook = this.getHook('stations', 'useUpdateDrawing', id);
    if (!updateDrawingHook) {
      console.error(`Station drawing update hook not found for ID: ${id}`);
      return false;
    }

    try {
      await this.executeApiHook(updateDrawingHook, data);
      return true;
    } catch (error) {
      console.error(`역 도면 업데이트 실패 (ID: ${id}):`, error);
      return false;
    }
  }

  async updateLines(id: number, lineIds: number[]): Promise<boolean> {
    const updateHook = this.getHook('stations', 'useUpdate', id);
    if (!updateHook) {
      console.error(`Station update hook not found for ID: ${id}`);
      return false;
    }

    try {
      await this.executeApiHook(updateHook, {
        stationInfo: { lineIds }
      });
      return true;
    } catch (error) {
      console.error(`역 노선 정보 업데이트 실패 (ID: ${id}):`, error);
      return false;
    }
  }
}