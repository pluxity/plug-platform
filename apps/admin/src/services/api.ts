import { ACCESS_TOKEN_NAME, cookieStorage } from "./cookies";

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export interface ResponseBody<T> {
    status: string,
    message: string,
    timestamp: string,
    result: T
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (): HeadersInit => {
//   const accessToken = localStorage.getItem('accessToken');
  const accessToken = cookieStorage.getCookie(ACCESS_TOKEN_NAME);
  return {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '요청 처리 중 오류가 발생했습니다.');
  }
  return response.json();
};

export const api = {
  get: async <T>(endpoint: string, options: RequestOptions = {}): Promise<ResponseBody<T>> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
      ...options
    });
    return handleResponse(response);
  },

  post: async <T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      ...options
    });
    return handleResponse(response);
  },

  put: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      ...options
    });
    return handleResponse(response);
  },

  patch: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
      ...options
    });
    return handleResponse(response);
  },

  delete: async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const headers = options.requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
      ...options
    });
    return handleResponse(response);
  }
};
