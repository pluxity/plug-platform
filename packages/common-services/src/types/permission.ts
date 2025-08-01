export interface PermissionUpdateRequest {
    name: string;
    description?: string;
    permissions: {
        resourceType: string;
        resourceIds: string[];
    }[];
}

export interface PermissionCreateRequest {
    name: string;
    description?: string;
    permissions: {
        resourceType: string;
        resourceIds: string[];
    }[];
}

export interface PermissionResponse {
    id: number;
    name: string;
    description: string;
    permissions: {
        resourceType: string;
        resourceIds: string[];
    }[];
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface PermissionResourceType {
    key: string;
    name: string;
    endpoint: string;
}