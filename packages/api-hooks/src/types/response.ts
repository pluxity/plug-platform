import { HttpStatus } from '../constants';

export interface BaseResponseBody {
  timestamp: string;
  status: HttpStatus;
  message: string;
  code: string;
}

export interface DataResponseBody<T> extends BaseResponseBody {
  data: T;
}

export interface ErrorResponseBody extends BaseResponseBody {
  error: string;
}