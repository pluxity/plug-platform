import ky, {KyResponse, Options} from 'ky';
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

  post: async (endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<KyResponse> => {
    let requestOptions: any;
    
    if (data instanceof FormData) {
      // FormData인 경우 Content-Type을 제거하여 브라우저가 자동으로 설정하도록 함
      const { headers, ...otherOptions } = options;
      requestOptions = {
        ...otherOptions,
        headers: {
          ...headers,
          'Content-Type': undefined // FormData는 Content-Type을 자동으로 설정
        }
      };
      const response = await buildKy(requestOptions).post(endpoint, { body: data });
      if (response.status === 201) return response;
      throw new Error(`Unexpected response status: ${response.status}`);
    } else {
      // 일반 JSON 데이터인 경우
      const response = await buildKy(options).post(endpoint, data ? { json: data } : undefined);
      if (response.status === 201) return response;
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  },

  put: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    const response = await buildKy(options).put(endpoint, data ? { json: data } : undefined);
    if (response.status === 204) return null as T;    
    throw new Error(`Unexpected response status: ${response.status}`);
  },

  patch: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    const response = await buildKy(options).patch(endpoint, data ? { json: data } : undefined);
    if (response.status === 204) return null as T;    
    throw new Error(`Unexpected response status: ${response.status}`);
  },
  
  delete: async <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> => {
    const response = await buildKy(options).delete(endpoint, data ? { json: data } : undefined);
    if (response.status === 204) return null as T;
    throw new Error(`Unexpected response status: ${response.status}`);
  },
}