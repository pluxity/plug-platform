export interface RoleCreateRequest {
    name: string;
    department: string;
}

export interface RoleUpdateRequest {
    name: string;
    department: string;
}

export interface RoleResponse {
    id: number;
    name: string;
    description: string;
}