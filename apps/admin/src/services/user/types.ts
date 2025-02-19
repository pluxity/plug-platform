export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

// 필요한 경우 요청이나 응답에 대한 추가 타입을 정의할 수 있습니다.
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
}
