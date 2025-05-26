// NFlux Platform API 클라이언트 설정
import ky from 'ky';

// NFlux API 서버 클라이언트
export const nfluxApiClient = ky.create({
  prefixUrl: 'http://localhost:8090/nflux/',
  headers: {
    'Content-Type': 'application/json',
  },
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
