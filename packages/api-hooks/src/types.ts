import { HttpStatus } from './constants';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface BaseResponseBody {
  timestamp: string;
  status: HttpStatus;
  message: string;
}

export interface DataResponseBody<T> extends BaseResponseBody {
  data: T;
}

export interface CreatedResponseBody extends BaseResponseBody {
}

export interface ErrorResponseBody extends BaseResponseBody {
  errors?: Record<string, string[]>;
  path?: string;
}

export type ResponseTypes<T, ID = unknown> = {
  GET: DataResponseBody<T>;
  POST: CreatedResponseBody;
  PUT: BaseResponseBody;
  PATCH: BaseResponseBody;
  DELETE: BaseResponseBody;
};
