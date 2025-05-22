export interface UserCreateRequest {
    username: string;
    password: string;
    name: string;
    code: string;
}

export interface UserUpdateRequest {
    username: string;
    name: string;
    code: string;
}

export interface UserResponse {
    id: number;
    username: string;
    name: string;
    code: string;
}

export interface UserUpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }



