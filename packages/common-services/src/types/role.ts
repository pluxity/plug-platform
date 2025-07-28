export interface PermissionResponse {
    id: number;
    resourceName: string;
    resourceId: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface RoleCreateRequest {
    name: string;
    description: string;
}

export interface RoleUpdateRequest {
    name: string;
    description: string;
}

export interface RoleResponse {
    id: number;
    name: string;
    description: string;
    permissions: PermissionResponse[];
}