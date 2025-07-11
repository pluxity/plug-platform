import { useCallback, useRef, useEffect } from 'react';
import { DataResponseBody, RequestOptions, UseApiResponse } from "../types";
import { useReducer } from 'react';
import { apiReducer } from './useReducer';
import { createErrorFromResponse } from "../util/apiUtils";
import { api, fileApi } from "../core";

export function useApi<T = any, P extends any[] = any[]>(
  apiMethod: (...args: P) => Promise<unknown>,
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

      let parsedData: T | null = null;
      let responseObj: Response | null = null;

      if (result instanceof Response) {
        responseObj = result;

        if (result.status === 204) {
          parsedData = null;
        } else {
          const contentType = result.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const jsonData = await result.clone().json();
            parsedData = (jsonData && typeof jsonData === 'object' && 'data' in jsonData)
              ? jsonData.data as T
              : jsonData as T;
          }
        }
      } else if (result === undefined || result === null) {
        parsedData = null;
      } else if (typeof result === 'object' && 'data' in result) {
        parsedData = (result as DataResponseBody<T>).data;
      } else {
        parsedData = result as T;
      }

      dispatch({
        type: 'SUCCESS',
        data: parsedData,
        response: responseObj
      });

      return { data: parsedData, response: responseObj };

    } catch (err) {
      if (!isMounted.current) return { data: null, response: null };
      console.error("API 요청 오류:", err);

      const processedError = createErrorFromResponse(err);
      dispatch({ type: 'ERROR', error: processedError });
      
      return { data: null, response: null };
    }
  }, [apiMethod]);

  const getLocationId = useCallback(() => {
    if (!response) return null;
    const location = response.headers.get('Location');
    return location ? location.split('/').filter(Boolean).pop() ?? null : null;
  }, [response]);

  return { data, error, isLoading, isSuccess, execute, reset, response, getLocationId };
}

export const useGet = <T>(url: string, options?: RequestOptions): UseApiResponse<T, []> => {
  return useApi<T, []>(() => api.get<T>(url, options));
};

export const usePost = <T, ReqData = any>(url: string, options?: RequestOptions): UseApiResponse<T, [ReqData]> => {
  return useApi<T, [ReqData]>((requestData) => api.post(url, requestData, options));
};

export const usePut = <T, ReqData = any>(url: string, options?: RequestOptions): UseApiResponse<T, [ReqData]> => {
  return useApi<T, [ReqData]>((requestData) => api.put(url, requestData, options));
};

export const usePatch = <T, ReqData = any>(url: string, options?: RequestOptions): UseApiResponse<T, [ReqData]> => {
  return useApi<T, [ReqData]>((requestData) => api.patch(url, requestData, options));
};

export const useDelete = (url: string, options?: RequestOptions): UseApiResponse<null, []> => {
  return useApi<null, []>(() => api.delete(url, options));
};

export const useFileApi = <T = any>(url: string = "/files/upload", options?: RequestOptions): UseApiResponse<T, [FormData]> => {
  return useApi<T, [FormData]>((formData) => fileApi.upload(url, formData, options));
};