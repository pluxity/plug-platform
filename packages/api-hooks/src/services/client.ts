import { TokenProvider } from './auth';

declare global {
  interface Window {
    env?: Record<string, string>;
  }
}

export const API_BASE_URL = 
  (typeof window !== 'undefined' && window.env?.API_BASE_URL) ||
  (typeof window !== 'undefined' && (window as any).VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && (window as any).REACT_APP_API_BASE_URL) ||
  (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_API_BASE_URL) ||
  'http://192.168.4.56:8080';

export type ResponseHandler<T> = (response: Response) => Promise<T>;

export const defaultResponseHandler = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as unknown as T;
  }
  return await response.json() as T;
};

export const methodResponseHandlers = {
  GET: async <T>(response: Response): Promise<T> => {
    const json = await response.json();
    return json.data as T;
  },
  
  POST: async <T>(response: Response): Promise<T> => {
    const locationHeader = response.headers.get('Location');
    if (locationHeader) {
      const id = locationHeader.split('/').pop();
      return id as unknown as T;
    }
    
    return await response.json() as T;
  },
  
  PUT: defaultResponseHandler,
  
  PATCH: defaultResponseHandler,
  
  DELETE: async <T>(response: Response): Promise<T> => {
    if (response.status === 204) {
      return undefined as unknown as T;
    }
    
    return await response.json() as T;
  }
};

export const errorResponseHandler = async (response: Response): Promise<never> => {
  try {
    const errorData = await response.json();
    throw new Error(errorData.message || `API 요청 실패: ${response.status}`);
  } catch (e) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
};

export async function fetchClient<T>(
  url: string, 
  options?: RequestInit,
  responseHandler: ResponseHandler<T> = defaultResponseHandler
): Promise<T> {
  const token = TokenProvider.getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options?.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      return errorResponseHandler(response);
    }

    return await responseHandler(response);
  } catch (error) {
    if (TokenProvider.shouldRefreshToken(error)) {
      try {
        await TokenProvider.refreshToken();
        return fetchClient(url, options, responseHandler);
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        throw refreshError;
      }
    }
    
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
} 