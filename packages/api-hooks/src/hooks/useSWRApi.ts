import useSWR, { SWRConfiguration } from 'swr';
import { api } from "../core";
import type { AllowedMethod, DataResponseBody, RequestOptions, UseSWRApiReturn, } from "../types";
import { createErrorFromResponse } from "../util/apiUtils";

export function useSWRApi<T>(
  url: string,
  method: AllowedMethod = 'GET',
  options?: RequestOptions,
  config?: SWRConfiguration
): UseSWRApiReturn<T> {
  const fetcher = async (): Promise<DataResponseBody<T> | null> => {
    try {
      switch (method) {
        case 'GET': {
          return await api.get<T>(url, options);
        }
        case 'DELETE': {
          await api.delete(url, options);
          return null;
        }
        default:
          throw new Error(`지원되지 않는 메서드: ${method}`);
      }
    } catch (err) {
      throw createErrorFromResponse(err);
    }
  };

  const cacheKey = method === 'GET' ? url : `${method}::${url}`;

  const { data: rawData, error, isLoading, mutate, } = useSWR<DataResponseBody<T> | null>(cacheKey, fetcher, {
    revalidateOnFocus: method === 'GET',
    shouldRetryOnError: method === 'GET',
    ...config,
  });

  const data = rawData?.data ?? null;

  return {
    data,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
  };
}