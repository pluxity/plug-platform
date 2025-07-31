import { FacilityType } from "../store/FacilityListStore";
import { FacilityData, isApiHookResult, isSWRHookResult } from "@/backoffice/domains/facility/types/facilityTypeGuard";

export class FacilityService {
  private static instance: FacilityService;
  private hookRegistry: Map<ServiceKey, HookResult> = new Map();

  private constructor() {}

  public static getInstance(): FacilityService {
    if (!FacilityService.instance) {
      FacilityService.instance = new FacilityService();
    }
    return FacilityService.instance;
  }

  private createServiceKey(type: FacilityType, serviceName: string, id: number | null): ServiceKey {
    return `${type}_${serviceName}_${id === null ? 'null' : id}` as ServiceKey;
  }

  public registerHook<T = any, P = any>(
    type: FacilityType,
    serviceName: string,
    id: number | null,
    result: HookResult<T, P>
  ): void {
    const key = this.createServiceKey(type, serviceName, id);
    this.hookRegistry.set(key, result);
  }

  public getHook<T = any, P = any>(
    type: FacilityType,
    serviceName: string,
    id: number | null
  ): HookResult<T, P> | undefined {
    const key = this.createServiceKey(type, serviceName, id);
    return this.hookRegistry.get(key) as HookResult<T, P> | undefined;
  }

  public clearHook(type: FacilityType, serviceName: string, id: number | null): void {
    const key = this.createServiceKey(type, serviceName, id);
    this.hookRegistry.delete(key);
  }

  public async fetchFacilityDetail<T extends FacilityData>(
    type: FacilityType,
    id: number
  ): Promise<T | null> {
    const detailHook = this.getHook<T>(type, 'useDetail', id);

    if (!detailHook) {
      console.error(`Hook을 찾을 수 없습니다: ${type}, 서비스: useDetail, ID: ${id}`);
      return null;
    }

    try {
      if (isApiHookResult<T>(detailHook)) {
        const { data } = await detailHook.execute({});
        return data as T;
      }

      if (isSWRHookResult<T>(detailHook)) {
        return detailHook.data as T;
      }

      return null;
    } catch (error) {
      console.error(`시설물 상세 정보 조회 실패 (${type}, ID: ${id}):`, error);
      return null;
    }
  }

  public async createFacility(type: FacilityType, data: any): Promise<boolean> {
    const createHook = this.getHook(type, 'useCreate', null);

    if (!createHook || !isApiHookResult(createHook)) {
      console.error(`유효한 생성 Hook을 찾을 수 없습니다: ${type}`);
      return false;
    }

    try {
      await createHook.execute(data);
      return true;
    } catch (error) {
      console.error(`시설물 생성 실패 (${type}):`, error);
      return false;
    }
  }

  public async updateFacility(type: FacilityType, id: number, data: any): Promise<boolean> {
    const updateHook = this.getHook(type, 'useUpdate', id);

    if (!updateHook || !isApiHookResult(updateHook)) {
      console.error(`유효한 업데이트 Hook을 찾을 수 없습니다: ${type}, ID: ${id}`);
      return false;
    }

    try {
      await updateHook.execute(data);
      return true;
    } catch (error) {
      console.error(`시설물 업데이트 실패 (${type}, ID: ${id}):`, error);
      return false;
    }
  }

  public async deleteFacility(type: FacilityType, id: number): Promise<boolean> {
    const deleteHook = this.getHook(type, 'useDeletion', id);

    if (!deleteHook || !isApiHookResult(deleteHook)) {
      console.error(`유효한 삭제 Hook을 찾을 수 없습니다: ${type}, ID: ${id}`);
      return false;
    }

    try {
      await deleteHook.execute({});
      return true;
    } catch (error) {
      console.error(`시설물 삭제 실패 (${type}, ID: ${id}):`, error);
      return false;
    }
  }
}