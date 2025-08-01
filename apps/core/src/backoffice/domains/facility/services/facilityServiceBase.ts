import { FacilityType } from "../types/facilityTypes";

type ServiceKey = string;

interface ApiHookResult<T = unknown> {
  execute: (params?: unknown) => Promise<{ data: T }>;
  isLoading: boolean;
  error?: Error;
}

interface SWRHookResult<T = unknown> {
  data?: T;
  isLoading: boolean;
  error?: Error;
}

type HookResult<T = unknown> = ApiHookResult<T> | SWRHookResult<T>;

function isApiHookResult<T>(hook: HookResult<T>): hook is ApiHookResult<T> {
  return 'execute' in hook;
}

function isSWRHookResult<T>(hook: HookResult<T>): hook is SWRHookResult<T> {
  return 'data' in hook && !('execute' in hook);
}

export class FacilityServiceBase {
  protected hookRegistry: Map<ServiceKey, HookResult> = new Map();

  protected createServiceKey(type: FacilityType, serviceName: string, id: number | null): ServiceKey {
    return `${type}_${serviceName}_${id === null ? 'null' : id}`;
  }

  public registerHook<T = unknown>(
    type: FacilityType,
    serviceName: string,
    id: number | null,
    result: HookResult<T>
  ): void {
    const key = this.createServiceKey(type, serviceName, id);
    this.hookRegistry.set(key, result);
  }

  public getHook<T = unknown>(
    type: FacilityType,
    serviceName: string,
    id: number | null
  ): HookResult<T> | undefined {
    const key = this.createServiceKey(type, serviceName, id);
    return this.hookRegistry.get(key) as HookResult<T> | undefined;
  }

  public clearHook(type: FacilityType, serviceName: string, id: number | null): void {
    const key = this.createServiceKey(type, serviceName, id);
    this.hookRegistry.delete(key);
  }

  protected async executeApiHook<T>(hook: HookResult<T>, params: Record<string, unknown> = {}): Promise<T | null> {
    if (!hook) return null;

    try {
      if (isApiHookResult<T>(hook)) {
        const { data } = await hook.execute(params);
        return data;
      }

      if (isSWRHookResult<T>(hook)) {
        return hook.data || null;
      }

      return null;
    } catch (error) {
      console.error("API 호출 실패:", error);
      return null;
    }
  }
}