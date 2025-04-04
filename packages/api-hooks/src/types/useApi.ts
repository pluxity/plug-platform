import { ErrorResponseBody } from './response';

export interface UseApiResponse<T, P extends any[] = any[]> {
  data: T | null;
  error: ErrorResponseBody | null;
  loading: boolean;
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}
