import ky, {Options} from 'ky';
import { RequestOptions, DataResponseBody, ErrorResponseBody } from "../types";

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

          const message = errorData?.message || errorData?.error || `HTTP ${response.status}`;
          const error = new Error(message);

          if (requestOptions.onError) {
            requestOptions.onError(errorData);
          }

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

  post: async <T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> => {
    return buildKy(options).post(endpoint, { json: data }).json();
  },

  put: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    return buildKy(options).put(endpoint, { json: data }).json();
  },

  patch: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    return buildKy(options).patch(endpoint, { json: data }).json();
  },

  delete: async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    return buildKy(options).delete(endpoint).json();
  }
};