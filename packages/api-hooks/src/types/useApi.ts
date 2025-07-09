import { ErrorResponseBody } from './response';

export interface UseApiResponse<T, P extends any[] = any[]> {
  data: T | null;
  error: ErrorResponseBody | null;
  isLoading: boolean;
  execute: (...args: P) => Promise<{ data: T | null; response: Response | null }>;
  reset: () => void;
  response: Response | null;
  getLocationId: () => string | null;
}