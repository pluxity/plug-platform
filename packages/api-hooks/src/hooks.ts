import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { fetchClient, ResponseHandler, methodResponseHandlers } from './client';
import { HttpMethod } from './types';

export interface ApiRequestOptions<T> {
  swrOptions?: SWRConfiguration;
  responseHandler?: ResponseHandler<T>;
}

export function useApiGet<T>(
  endpoint: string,
  options?: ApiRequestOptions<T>
) {
  const handler = options?.responseHandler || methodResponseHandlers.GET;
  
  return useSWR<T>(
    endpoint,
    (url: string) => fetchClient<T>(url, { method: 'GET' }, handler),
    options?.swrOptions
  );
}

export function useConditionalApiGet<T>(
  endpoint: string,
  shouldFetch: boolean, 
  options?: ApiRequestOptions<T>
): SWRResponse<T, Error> {
  const handler = options?.responseHandler || methodResponseHandlers.GET;
  
  return useSWR<T>(
    shouldFetch ? endpoint : null,
    (url: string) => fetchClient<T>(url, { method: 'GET' }, handler),
    options?.swrOptions
  );
}

export type { HttpMethod } from './types';

export interface RequestOptions<T> {
  responseHandler?: ResponseHandler<T>;
  fetchOptions?: Omit<RequestInit, 'method' | 'body'>;
}

export function useApiRequest<M extends HttpMethod>(method: M) {
  return async function request<T, D = unknown>(
    endpoint: string, 
    data?: D, 
    options?: RequestOptions<T>
  ): Promise<T> {
    const responseHandler = options?.responseHandler || methodResponseHandlers[method];
    
    const fetchOptions: RequestInit = {
      method,
      ...options?.fetchOptions
    };
    
    if (method !== 'GET' && method !== 'DELETE' && data) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    return fetchClient<T>(endpoint, fetchOptions, responseHandler);
  };
}

export function useApiPost<T = unknown, ID = number>() {
  return useApiRequest<'POST'>('POST') as (
    endpoint: string,
    data?: T,
    options?: RequestOptions<ID>
  ) => Promise<ID>;
}

export function useApiPut<T = unknown>() {
  return useApiRequest<'PUT'>('PUT') as (
    endpoint: string,
    data?: T,
    options?: RequestOptions<void>
  ) => Promise<void>;
}

export function useApiDelete() {
  return useApiRequest<'DELETE'>('DELETE') as (
    endpoint: string,
    options?: RequestOptions<void>
  ) => Promise<void>;
}

export function useApiPatch<T = unknown>() {
  return useApiRequest<'PATCH'>('PATCH') as (
    endpoint: string,
    data?: T,
    options?: RequestOptions<void>
  ) => Promise<void>;
} 