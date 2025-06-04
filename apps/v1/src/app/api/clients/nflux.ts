// NFlux Platform API 클라이언트 설정
import ky from 'ky';

let authToken: string | null = null;

// 클라이언트 인스턴스 캐시
const clientCache = new Map<string, ReturnType<typeof ky.create>>();

export const setAuthToken = (token: string) => {
  authToken = token;
  // 토큰이 변경되면 캐시 초기화
  clientCache.clear();
};

export const getAuthToken = () => authToken;

const createKyClient = (baseUrl: string, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = token;
  }

  return ky.create({
    prefixUrl: baseUrl,
    headers,
    timeout: 15000,
    retry: 2,
    hooks: {
      afterResponse: [
        async (_request, _options, response) => {
          if (!response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let errorData: any = {};
            try {
              errorData = await response.json();            
            } catch (error) {
              console.error("NFlux API Error: Failed to parse error response", error);
            }
            
            const message = errorData?.message || errorData?.error || `NFlux API Error: ${response.status}`;
            throw new Error(message);
          }
          
          return response;
        }
      ]
    }
  });
};

export const createNfluxApiClient = (customAuthToken?: string, stationId?: string) => {
  const token = customAuthToken || authToken;
  const baseUrl = stationId 
    ? `http://192.168.4.84:8090/nflux/HI-SMP/poi/station/${stationId}`
    : 'http://192.168.4.84:8090/nflux/HI-SMP/poi/station';
  
  // 캐시 키 생성 (baseUrl + token)
  const cacheKey = `${baseUrl}:${token || 'no-token'}`;
  
  // 캐시에서 기존 클라이언트 확인
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }
    // 새 클라이언트 생성 및 캐시 저장
  const client = createKyClient(baseUrl, token || undefined);
  clientCache.set(cacheKey, client);
  
  return client;
}

export const nfluxApiClient = createNfluxApiClient();

export const withAuth = (token: string) => {
  return createNfluxApiClient(token);
};

// 캐시 관리 함수들
export const clearClientCache = () => {
  clientCache.clear();
};

export const getCacheSize = () => {
  return clientCache.size;
};
