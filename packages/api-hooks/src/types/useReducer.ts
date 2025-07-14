import { ErrorResponseBody } from "@plug/api-hooks";

export type ApiState<T = any> = {
  data: T | null;
  error: ErrorResponseBody | null;
  isLoading: boolean;
  isSuccess: boolean;
  response: Response | null;
};

export type ApiAction<T = any> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS', data: T | null, response?: Response | null }
  | { type: 'ERROR', error: ErrorResponseBody }
  | { type: 'RESET' };