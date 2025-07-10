import { useState, useCallback, useRef, useEffect } from 'react';
import {
  DataResponseBody,
  ErrorResponseBody,
  RequestOptions,
  UseApiResponse,
} from "../types";
import { api, fileApi } from "../core";

const parseResponse = async <T>(res: Response): Promise<T | null> => {
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json') && res.status !== 204) {
      const jsonData = await res.clone().json();
      if (jsonData && typeof jsonData === 'object' && 'data' in jsonData) {
        return jsonData.data as T;
      }
      return jsonData as T;
    }
  return null;
};

export function useApi<T, P extends any[] = any[]>(
  apiMethod: (...args: P) => Promise<unknown>,
): UseApiResponse<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ErrorResponseBody | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    if (isMounted.current) {
      setData(null);
      setError(null);
      setIsLoading(false);
      setIsSuccess(false);
      setResponse(null);
    }
  }, []);

  const execute = useCallback(async (...args: P): Promise<{ data: T | null; response: Response | null }> => {
    if (!isMounted.current) return { data: null, response: null };

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setData(null);
    setResponse(null);

    try {
      const result = await apiMethod(...args);

      if (!isMounted.current) return { data: null, response: null };

      setIsSuccess(true);

      if (typeof Response !== 'undefined' && result instanceof Response) {
        setResponse(result);

        if (result.status === 204) {
          setData(null);
          return { data: null, response: result };
        }

        const parsed = await parseResponse<T>(result);
        setData(parsed);
        return { data: parsed, response: result };
      }

      if (result === undefined || result === null) {
        setData(null);
        return { data: null, response: null };
      }

      if (typeof result === 'object' && 'data' in result) {
        const responseData = (result as DataResponseBody<T>).data;
        setData(responseData);
        return { data: responseData, response: null };
      }

      setData(result as T);
      return { data: result as T, response: null };

    } catch (err) {
      if (!isMounted.current) return { data: null, response: null };
      console.error("API 요청 오류:", err);

      setIsSuccess(false);

      let processedError: ErrorResponseBody;

      if (typeof err === 'object' && err !== null && 'status' in err && 'message' in err) {
        processedError = err as ErrorResponseBody;
      } else if (err instanceof Error) {
        processedError = {
          status: (err as any).status || 500,
          message: err.message,
          timestamp: new Date().toISOString(),
          code: (err as any).code || 'CLIENT_ERROR',
          error: err.message || 'UNKNOWN_ERROR',
        };
      } else {
        processedError = {
          status: 500,
          message: '알 수 없는 오류가 발생했습니다.',
          timestamp: new Date().toISOString(),
          code: 'UNKNOWN_ERROR',
          error: 'UNKNOWN_ERROR',
        };
      }

      setError(processedError);
      return { data: null, response: null };
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
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
