export interface PermissionUpdateRequest {
    resourceName: string;
    resourceId: string;
}

export interface PermissionCreateRequest {
    resourceName: string;
    resourceId: string;
}

export interface PermissionResponse {
    id: number;
    resourceName: string;
    resourceId: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}