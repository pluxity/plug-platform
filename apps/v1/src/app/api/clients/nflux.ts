// NFlux Platform API 클라이언트 설정
import ky from 'ky';

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const createNfluxApiClient = (customAuthToken?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // 커스텀 토큰이 제공되었거나 전역 토큰이 있으면 헤더에 추가
  const token = customAuthToken || authToken;
  if (token) {
    headers['Authorization'] = token;
  }
  
  return ky.create({
    prefixUrl: 'http://192.168.4.84:8090/nflux/',
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
}

export const nfluxApiClient = createNfluxApiClient();

export const withAuth = (token: string) => {
  return createNfluxApiClient(token);
};
