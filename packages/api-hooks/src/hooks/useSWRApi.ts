import useSWR, { SWRConfiguration } from 'swr';
import { api } from '../core';
import type { AllowedMethod, RequestOptions, DataResponseBody, UseSWRApiReturn } from '../types';

export function useSWRApi<T>(
  url: string,
  method: AllowedMethod = 'GET',
  params?: unknown,
  options?: RequestOptions,
  config?: SWRConfiguration
): UseSWRApiReturn<T> {

  const fetcher = async (): Promise<DataResponseBody<T> | null> => {
    switch (method) {
      case 'GET': {
        return await api.get<T>(url, options);
      }
      case 'DELETE': {
        await api.delete(url, options);
        return null;
      }
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  };

  const cacheKey = params 
    ? `${url}::${method}::${JSON.stringify(params)}`
    : method === 'GET' 
      ? url 
      : `${method}::${url}`;

  const { data: rawData, error, isLoading, mutate } = useSWR<DataResponseBody<T> | null>(
    cacheKey, 
    fetcher, 
    {
      revalidateOnFocus: method === 'GET',
      shouldRetryOnError: method === 'GET',
      ...config,
    }
  );

  const data = rawData?.data ?? null;

  return {
    data,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
  };
}