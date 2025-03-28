import { HttpStatus } from './constants';

/**
 * HTTP 메소드 타입
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 기본 응답 타입
 */
export interface BaseResponseBody {
  timestamp: string;
  status: HttpStatus;
  message: string;
}

/**
 * 데이터를 포함하는 응답 타입 (주로 GET 요청)
 */
export interface DataResponseBody<T> extends BaseResponseBody {
  data: T;
}

/**
 * 생성된 리소스의 ID를 포함하는 응답 타입 (주로 POST 요청)
 * 실제 id는 헤더에 포함됨
 */
export interface CreatedResponseBody extends BaseResponseBody {
  // ID는 응답 본문에 없고 헤더에 있음
}

/**
 * 에러 응답 타입
 */
export interface ErrorResponseBody extends BaseResponseBody {
  errors?: Record<string, string[]>;
  path?: string;
}

/**
 * HTTP 메소드에 따른 응답 타입 매핑
 */
export type ResponseTypes<T, ID = unknown> = {
  GET: DataResponseBody<T>;
  POST: CreatedResponseBody;
  PUT: BaseResponseBody;
  PATCH: BaseResponseBody;
  DELETE: BaseResponseBody;
}; 