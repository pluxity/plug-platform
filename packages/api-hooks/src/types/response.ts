import { HttpStatus } from '../constants/http';

/** 기본 응답 형식 */
export interface BaseResponseBody {
  timestamp: string;
  status: HttpStatus;
  message: string;
}

/** 데이터 포함 응답 */
export interface DataResponseBody<T> extends BaseResponseBody {
  data: T;
}

/** 생성 시 응답 */
export interface CreatedResponseBody extends BaseResponseBody {
  id: number | string | null;
}

/** 에러 응답 */
export interface ErrorResponseBody extends BaseResponseBody {
  code: string;
  error?: string;
}

/** HTTP 메서드별 응답 타입 정의 */
export type ResponseTypes<T> = {
  GET: DataResponseBody<T>;
  POST: CreatedResponseBody | DataResponseBody<T>;
  PUT: BaseResponseBody;
  PATCH: BaseResponseBody;
  DELETE: void;
};
