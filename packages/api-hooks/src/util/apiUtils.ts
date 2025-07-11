import { ErrorResponseBody } from "@plug/api-hooks";

export const isErrorResponseBody = (err: unknown): err is ErrorResponseBody => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'message' in err &&
    'code' in err &&
    'timestamp' in err &&
    'error' in err
  );
};

export const createErrorFromResponse = (err: unknown): ErrorResponseBody => {
  if (isErrorResponseBody(err)) {
    return err;
  } 
  
  if (err instanceof Error) {
    return {
      status: (err as any).status || 500,
      message: err.message,
      timestamp: new Date().toISOString(),
      code: (err as any).code || 'CLIENT_ERROR',
      error: err.message || 'UNKNOWN_ERROR',
    };
  }

  return {
    status: 500,
    message: '알 수 없는 오류가 발생했습니다.',
    timestamp: new Date().toISOString(),
    code: 'UNKNOWN_ERROR',
    error: typeof err === 'string' ? err : 'UNKNOWN_ERROR',
  };
};