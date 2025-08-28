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

export interface UserRoleUpdateRequest {
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
    // 로그인 상태 (with-is-logged-in 파라미터 사용 시 포함)
    isLoggedIn?: boolean;
}

export interface UserPasswordRequest {
    currentPassword: string;
    newPassword: string;
}




