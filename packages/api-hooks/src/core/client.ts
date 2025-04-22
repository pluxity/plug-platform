import ky from 'ky';
import { ResponseTypes, RequestOptions } from '../types';

const BASE_URL = 'http://localhost:8080';

let getAccessToken: () => string | null = () => null;

export const setTokenGetter = (fn: () => string | null) => {
  getAccessToken = fn;
};

// 기본 ky 인스턴스
const baseKy = ky.create({
  prefixUrl: BASE_URL,
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
          const errorData = await response.json().catch(() => ({}));
          if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
            throw new Error((errorData as { message?: string }).message || '요청 처리 중 오류');
          } else {
            throw new Error('요청 처리 중 오류가 발생했습니다.');
          }
        }
      }
    ]
  }
});

const buildKy = (options: RequestOptions = {}) => {
  const requireAuth = options.requireAuth ?? true;
  if (!requireAuth) {
    return ky.create({
      prefixUrl: BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return baseKy;
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