/**
 * HTTP 상태 코드
 */
export enum HttpStatus {
  // 2xx 성공
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  
  // 4xx 클라이언트 에러
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  
  // 5xx 서버 에러
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503
}

/**
 * 성공 코드
 */
export enum SuccessCode {
  SUCCESS = "SUCCESS",
  SUCCESS_CREATED = "SUCCESS_CREATED",
  SUCCESS_PUT = "SUCCESS_PUT", 
  SUCCESS_PATCH = "SUCCESS_PATCH",
  SUCCESS_DELETE = "SUCCESS_DELETE"
}

/**
 * 기본 성공 코드
 */
export const SUCCESS = {
  getHttpStatus: () => HttpStatus.OK,
  getMessage: () => "성공"
};

/**
 * 메소드별 성공 코드 매핑
 */
export const METHOD_SUCCESS_CODES = {
  GET: {
    httpStatus: HttpStatus.OK,
    message: "성공"
  },
  POST: {
    httpStatus: HttpStatus.CREATED,
    message: "등록 성공"
  },
  PUT: {
    httpStatus: HttpStatus.ACCEPTED,
    message: "수정 성공"
  },
  PATCH: {
    httpStatus: HttpStatus.ACCEPTED,
    message: "수정 성공"
  },
  DELETE: {
    httpStatus: HttpStatus.NO_CONTENT,
    message: "삭제 성공"
  }
}; 