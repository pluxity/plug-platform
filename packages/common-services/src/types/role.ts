import { PermissionResponse } from "./permission";

export interface RoleCreateRequest {
    name: string;
    description: string;
    permissionGroupIds: number[];
}

export interface RoleUpdateRequest {
    name: string;
    description: string;
    permissionGroupIds: number[];
}

export interface RoleResponse {
    id: number;
    name: string;
    description: string;
    permissions: PermissionResponse[];
}