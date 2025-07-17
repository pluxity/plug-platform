import { useCallback, useRef, useEffect } from 'react';
import { DataResponseBody, RequestOptions, UseApiResponse } from "../types";
import { useReducer } from 'react';
import { apiReducer } from './useReducer';
import { createErrorFromResponse } from "../util/apiUtils";
import { api } from "../core";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Response 처리 유틸리티 함수
const parseResponseData = async <T>(
  result: unknown, 
  method: HttpMethod
): Promise<{ data: T | null; response: Response | null }> => {
  // Response 객체가 아닌 경우
  if (!(result instanceof Response)) {
    if (result === undefined || result === null) {
      return { data: null, response: null };
    }
    
    const data = (typeof result === 'object' && result && 'data' in result) 
      ? (result as DataResponseBody<T>).data 
      : result as T;
    
    return { data, response: null };
  }

  const response = result;
  
  // POST의 경우 Response 객체 자체를 반환
  if (method === 'POST') {
    return { data: response as T, response };
  }

  // PUT, PATCH, DELETE의 경우 204 No Content
  if (['PUT', 'PATCH', 'DELETE'].includes(method) && response.status === 204) {
    return { data: null, response };
  }

  // GET의 경우 JSON 파싱
  if (method === 'GET') {
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return { data: null, response };
    }

    try {
      const jsonData = await response.clone().json();
      const data = (jsonData && typeof jsonData === 'object' && 'data' in jsonData)
        ? jsonData.data as T
        : jsonData as T;
      
      return { data, response };
    } catch {
      return { data: null, response };
    }
  }

  return { data: null, response };
};

export function useApi<T = any, P extends any[] = any[]>(
  apiMethod: (...args: P) => Promise<unknown>,
  method: HttpMethod
): UseApiResponse<T, P> {
  const [state, dispatch] = useReducer(apiReducer<T>, {
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    response: null
  });
  
  const { data, error, isLoading, isSuccess, response } = state;

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    if (isMounted.current) {
      dispatch({ type: 'RESET' });
    }
  }, []);

  const execute = useCallback(async (...args: P): Promise<{ data: T | null; response: Response | null }> => {
    if (!isMounted.current) return { data: null, response: null };

    dispatch({ type: 'LOADING' });

    try {
      const result = await apiMethod(...args);

      if (!isMounted.current) return { data: null, response: null };

      const { data: parsedData, response: responseObj } = await parseResponseData<T>(result, method);

      dispatch({
        type: 'SUCCESS',
        data: parsedData,
        response: responseObj
      });

      return { data: parsedData, response: responseObj };

    } catch (err) {
      if (!isMounted.current) return { data: null, response: null };
      console.error(`${method} 요청 오류:`, err);

      const processedError = createErrorFromResponse(err);
      dispatch({ type: 'ERROR', error: processedError });
      
      return { data: null, response: null };
    }
  }, [apiMethod, method]);

  const getLocationId = useCallback(() => {
    if (!response) return null;
    const location = response.headers.get('Location');
    return location ? location.split('/').filter(Boolean).pop() ?? null : null;
  }, [response]);

  return { data, error, isLoading, isSuccess, execute, reset, response, getLocationId };
}

// HTTP 메서드별 hook들
export const useGet = <T>(url: string, options?: RequestOptions): UseApiResponse<T, []> => {
  return useApi<T, []>(() => api.get<T>(url, options), 'GET');
};

export const usePost = <ReqData = any>(url: string, options?: RequestOptions): UseApiResponse<Response, [ReqData?]> => {
  return useApi<Response, [ReqData?]>((requestData) => api.post(url, requestData, options), 'POST');
};

export const usePut = <ReqData = any>(url: string, options?: RequestOptions): UseApiResponse<null, [ReqData?]> => {
  return useApi<null, [ReqData?]>((requestData) => api.put(url, requestData, options), 'PUT');
};

export const usePatch = <ReqData = any>(url: string, options?: RequestOptions): UseApiResponse<null, [ReqData?]> => {
  return useApi<null, [ReqData?]>((requestData) => api.patch(url, requestData, options), 'PATCH');
};

export const useDelete = (url: string, options?: RequestOptions): UseApiResponse<null, []> => {
  return useApi<null, []>(() => api.delete(url, undefined, options), 'DELETE');
};