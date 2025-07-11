import type { ErrorResponseBody } from "./response";

export interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
  onSuccess?: (response: any) => void;
  onError?: (error: ErrorResponseBody) => void;
}