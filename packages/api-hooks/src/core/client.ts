import ky, {Options} from 'ky';
import { RequestOptions, DataResponseBody, ErrorResponseBody } from "../types";
import { createErrorFromResponse } from "../util/apiUtils";

export const baseKy = ky.create({
  credentials: 'include',
  prefixUrl: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  hooks: {
    afterResponse: [
      async (_request, options, response) => {
        const requestOptions = options as unknown as RequestOptions;

        if (!response.ok) {
          let errorData: ErrorResponseBody | any = {};
          try {
            errorData = await response.json();
          } catch (_) {}

          const processedError = createErrorFromResponse({
            ...errorData,
            status: response.status,
            message: errorData?.message || errorData?.error || `HTTP ${response.status}`
          });

          if (requestOptions.onError) {
            requestOptions.onError(processedError);
          }

          const error = new Error(processedError.message);
          Object.assign(error, processedError);

          throw error;
        } else {
          if (requestOptions.onSuccess && response.status !== 204) {
            const data = await response.clone().json();
            requestOptions.onSuccess(data);
          }
        }
      }
    ]
  }
});

const buildKy = (
  options: RequestOptions & Options = {}
) => {
  const { requireAuth = true, ...restOptions } = options;
  const baseOptions: Options = {
    headers: { 'Content-Type': 'application/json' },
    ...restOptions
  };

  if (!requireAuth) {
    return baseKy.extend({ ...baseOptions, hooks: { beforeRequest: [] } });
  }

  return baseKy.extend({ ...baseOptions });
};

export const api = {
  get: async <T>(endpoint: string, options: RequestOptions = {}): Promise<DataResponseBody<T>> => {
    return buildKy(options).get(endpoint).json();
  },

  post: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    const response = await buildKy(options).post(endpoint, data ? { json: data } : undefined);
    if (response.status === 201) return null as T;
    return await response.json();
  },

  put: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    const response = await buildKy(options).put(endpoint, data ? { json: data } : undefined);
    if (response.status === 204) return null as T;
    return await response.json();
  },
  patch: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    const response = await buildKy(options).patch(endpoint, data ? { json: data } : undefined);
    if (response.status === 204) return null as T;
    return await response.json();
  },
  delete: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    const response = await buildKy(options).delete(endpoint, data ? { json: data } : undefined);
    if (response.status === 204) return null as T;
    return await response.json();
  },
}