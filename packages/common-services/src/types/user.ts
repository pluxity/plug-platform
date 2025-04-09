import { RoleResponse } from "./role";

export interface UserCreateRequest {
    username: string;
    password: string;
    name: string;
    code: string;
}

export interface UserUpdateRequest {
    username: string;
    password: string;
    name: string;
    code: string;
}

export interface UserResponse {
    id: number;
    username: string;
    name: string;
    code: string;
    roles: Set<RoleResponse>;
}




