import ky, {Options} from 'ky';
import { ResponseTypes, RequestOptions } from '../types';

// const BASE_URL = 'http://192.168.4.37:8080';

let getAccessToken: () => string | null = () => null;

export const setTokenGetter = (fn: () => string | null) => {
  getAccessToken = fn;
};

const baseKy = ky.create({
  prefixUrl: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  hooks: {
    beforeRequest: [
      request => {
        const token = getAccessToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          let errorData: any = {};
          try {
            errorData = await response.json();
          } catch (_) {}

          const message = errorData?.message || errorData?.error || `HTTP ${response.status}`;
          throw new Error(message);
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
    prefixUrl: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    ...restOptions
  };

  if (!requireAuth) {
    return baseKy.extend({ ...baseOptions, hooks: { beforeRequest: [] } });
  }

  return baseKy.extend({ ...baseOptions });
};

export const api = {
  get: async <T>(endpoint: string, options: RequestOptions = {}): Promise<ResponseTypes<T>['GET']> => {
    return buildKy(options).get(endpoint).json();
  },

  post: async <T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> => {
    return buildKy(options).post(endpoint, { json: data }).json();
  },

  put: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<ResponseTypes<T>['PUT']> => {
    return buildKy(options).put(endpoint, { json: data }).json();
  },

  patch: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<ResponseTypes<T>['PATCH']> => {
    return buildKy(options).patch(endpoint, { json: data }).json();
  },

  delete: async <T>(endpoint: string, options: RequestOptions = {}): Promise<ResponseTypes<T>['DELETE']> => {
    const res = await buildKy(options).delete(endpoint);
    return res.status === 204 ? undefined as ResponseTypes<T>['DELETE'] : res.json();
  }
};
