import ky, {Options} from 'ky';
import { ResponseTypes, RequestOptions } from '../types';
import { useProfileStore } from "@plug/v1/auth/controller/useProfileStore";

const baseKy = ky.create({
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  hooks: {
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

export const buildKy = (
    options: RequestOptions & Options = {}
) => {
  const { requireAuth = true, ...restOptions } = options;
  const baseOptions: Options = {
    headers: { 'Content-Type': 'application/json' },
    ...restOptions
  };

  if (!requireAuth) {
    const { expiresAt } = useProfileStore.getState();
    if (expiresAt && Date.now() > expiresAt) {
      throw new Error('세션이 만료되었습니다. 다시 로그인 해주세요.');
    }
    return baseKy.extend({ ...baseOptions, hooks: { beforeRequest: [] } });
  }

  return baseKy.extend({ ...baseOptions });
};

export const api = {
  get: async <T>(endpoint: string, options: RequestOptions = {}): Promise<ResponseTypes<T>['GET']> => {
    return buildKy(options).get(endpoint).json();
  },

  post: (endpoint: string, data: unknown, options: RequestOptions = {}): Promise<Response> => {
    return buildKy(options).post(endpoint, { json: data });
  },

  put: (endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<Response> => {
    return buildKy(options).put(endpoint, { json: data });
  },

  patch: (endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<Response> => {
    return buildKy(options).patch(endpoint, { json: data });
  },

  delete: (endpoint: string, options: RequestOptions = {}): Promise<Response> => {
    return buildKy(options).delete(endpoint);
  }
};
