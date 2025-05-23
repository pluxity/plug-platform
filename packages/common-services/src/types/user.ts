import { RoleResponse } from "./role";

export interface UserCreateRequest {
    username: string;
    password: string;
    name: string;
    code: string;
    role?: string[];
}

export interface UserUpdateRequest {
    username: string;
    name: string;
    code: string;
    roles: Set<RoleResponse>;
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



