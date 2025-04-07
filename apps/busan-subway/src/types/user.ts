export interface RoleResponse {
  id: number;
  roleName: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  code: string;
  roles: RoleResponse[];
}

export type UserRole = 'USER' | 'ADMIN'; 