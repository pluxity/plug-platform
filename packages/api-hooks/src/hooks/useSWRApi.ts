import useSWR, { SWRConfiguration } from 'swr'
import { api } from '../core/client'
import type { 
  AllowedMethod,  
  UseSWRApiReturn,
  RequestOptions,
  DataResponseBody 
} from '../types'

export function useSWRApi<T>(
  url: string,
  method: AllowedMethod = 'GET',
  options?: RequestOptions,
  config?: SWRConfiguration
): UseSWRApiReturn<T> {
  const fetcher = async (): Promise<T> => {
    if (method === 'GET') {
      const response = await api.get<DataResponseBody<T>>(url, options)
      return response.data as T
    }

    if (method === 'DELETE') {
      await api.delete<void>(url, options)
      return null as T
    }

    throw new Error(`Unsupported method: ${method}`)
  }

  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    ...config,
  })

  return {
    data: data ?? null,
    error,
    isLoading,
    mutate,
  }
}
