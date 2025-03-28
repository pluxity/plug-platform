import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { fetchClient, ResponseHandler, defaultResponseHandler, methodResponseHandlers } from './client';
import { HttpMethod, ResponseTypes } from './types';
import { METHOD_SUCCESS_CODES } from './constants';

/**
 * API 요청 옵션 타입
 */
export interface ApiRequestOptions<T> {
  /** SWR 옵션 */
  swrOptions?: SWRConfiguration;
  /** 응답 처리 함수 (기본값은 HTTP 메소드별 기본 처리기 사용) */
  responseHandler?: ResponseHandler<T>;
}

/**
 * API 데이터를 가져오는 기본 SWR 훅
 * @param endpoint API 엔드포인트
 * @param options 요청 옵션
 * @returns SWR 응답
 */
export function useApiGet<T>(
  endpoint: string,
  options?: ApiRequestOptions<T>
) {
  // GET 메소드의 기본 응답 처리기 또는 사용자 지정 처리기 사용
  const handler = options?.responseHandler || methodResponseHandlers.GET;
  
  // SWR 키로 엔드포인트를 사용, fetcher 함수로 fetchClient를 사용
  return useSWR<T>(
    endpoint,
    (url: string) => fetchClient<T>(url, { method: 'GET' }, handler),
    options?.swrOptions
  );
}

/**
 * API 데이터를 조건부로 가져오는 SWR 훅
 * @param endpoint API 엔드포인트
 * @param shouldFetch 데이터를 가져올지 여부
 * @param options 요청 옵션
 * @returns SWR 응답
 */
export function useConditionalApiGet<T>(
  endpoint: string,
  shouldFetch: boolean, 
  options?: ApiRequestOptions<T>
): SWRResponse<T, Error> {
  // GET 메소드의 기본 응답 처리기 또는 사용자 지정 처리기 사용
  const handler = options?.responseHandler || methodResponseHandlers.GET;
  
  return useSWR<T>(
    shouldFetch ? endpoint : null,
    (url: string) => fetchClient<T>(url, { method: 'GET' }, handler),
    options?.swrOptions
  );
}

/**
 * HTTP 메소드 타입
 */
export type { HttpMethod } from './types';

/**
 * 요청 옵션 타입
 */
export interface RequestOptions<T> {
  /** 응답 처리 함수 */
  responseHandler?: ResponseHandler<T>;
  /** 추가 fetch 옵션 */
  fetchOptions?: Omit<RequestInit, 'method' | 'body'>;
}

/**
 * API 요청 함수를 생성하는 훅
 * @param method HTTP 메소드
 * @returns 요청 함수
 */
export function useApiRequest<M extends HttpMethod>(method: M) {
  return async function request<T, D = unknown>(
    endpoint: string, 
    data?: D, 
    options?: RequestOptions<T>
  ): Promise<T> {
    // 메소드별 기본 응답 처리기 또는 사용자 지정 처리기 사용
    const responseHandler = options?.responseHandler || methodResponseHandlers[method];
    
    const fetchOptions: RequestInit = {
      method,
      ...options?.fetchOptions
    };
    
    // GET, DELETE 요청이 아닌 경우에만 body 추가
    if (method !== 'GET' && method !== 'DELETE' && data) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    return fetchClient<T>(
      endpoint, 
      fetchOptions, 
      responseHandler
    );
  };
}

/**
 * POST 요청을 보내는 함수를 반환하는 훅
 * @returns POST 요청 함수
 */
export function useApiPost<T = unknown, ID = number>() {
  return useApiRequest<'POST'>('POST') as (
    endpoint: string,
    data?: T,
    options?: RequestOptions<ID>
  ) => Promise<ID>;
}

/**
 * PUT 요청을 보내는 함수를 반환하는 훅
 * @returns PUT 요청 함수
 */
export function useApiPut<T = unknown>() {
  return useApiRequest<'PUT'>('PUT') as (
    endpoint: string,
    data?: T,
    options?: RequestOptions<void>
  ) => Promise<void>;
}

/**
 * DELETE 요청을 보내는 함수를 반환하는 훅
 * @returns DELETE 요청 함수
 */
export function useApiDelete() {
  return useApiRequest<'DELETE'>('DELETE') as (
    endpoint: string,
    options?: RequestOptions<void>
  ) => Promise<void>;
}

/**
 * PATCH 요청을 보내는 함수를 반환하는 훅
 * @returns PATCH 요청 함수
 */
export function useApiPatch<T = unknown>() {
  return useApiRequest<'PATCH'>('PATCH') as (
    endpoint: string,
    data?: T,
    options?: RequestOptions<void>
  ) => Promise<void>;
} 