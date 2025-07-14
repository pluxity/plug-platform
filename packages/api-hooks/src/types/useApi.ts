import { ErrorResponseBody } from './response';

export interface UseApiResponse<T = any, P extends any[] = any[]> {
  data: T | null;
  error: ErrorResponseBody | null;
  isLoading: boolean;
  isSuccess: boolean;
  execute: (...args: P) => Promise<{ data: T | null; response: Response | null }>;
  reset: () => void;
  response: Response | null;
  getLocationId: () => string | null;
}