import { ResponseTypes, RequestOptions } from '../types';

const BASE_URL = 'http://localhost:8080';

let getAccessToken: () => string | null = () => null;

export const setTokenGetter = (fn: () => string | null) => {
  getAccessToken = fn;
};

const getAuthHeaders = (): HeadersInit => {
  const accessToken = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '요청 처리 중 오류가 발생했습니다.');
  }
  return response.json();
};

export const api = {
  get: async <T>(endpoint: string, options: RequestOptions = {}): Promise<ResponseTypes<T>['GET']> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
      ...options
    });
    return handleResponse<ResponseTypes<T>['GET']>(response);
  },

  post: async <T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<ResponseTypes<T>['POST']> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      ...options
    });
    return handleResponse<ResponseTypes<T>['POST']>(response);
  },

  put: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<ResponseTypes<T>['PUT']> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      ...options
    });
    return handleResponse<ResponseTypes<T>['PUT']>(response);
  },

  patch: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<ResponseTypes<T>['PATCH']> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
      ...options
    });
    return handleResponse<ResponseTypes<T>['PATCH']>(response);
  },

  delete: async <T>(endpoint: string, options: RequestOptions = {}): Promise<ResponseTypes<T>['DELETE']> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
      ...options
    });
    if (response.status === 204) return undefined as ResponseTypes<T>['DELETE'];
    return handleResponse<ResponseTypes<T>['DELETE']>(response);
  }
};
