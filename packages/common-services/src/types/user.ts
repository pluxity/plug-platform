import { RoleResponse } from "./role";

export interface UserCreateRequest {
    username: string;
    password: string;
    name: string;
    code?: string;
    phoneNumber?: string;
    department?: string;
    roleIds?: number[];
}

export interface UserUpdateRequest {
    name?: string;
    code?: string;
    phoneNumber?: string;
    department?: string;
    roleIds?: number[];
}

export interface UserProfile {
    id: number;
    username: string;
    name: string;
    code: string;
    phoneNumber: string;
    department: string;
    shouldChangePassword: boolean;
    roles: Set<RoleResponse>;
}

export interface UserPasswordRequest {
    currentPassword: string;
    newPassword: string;
}




