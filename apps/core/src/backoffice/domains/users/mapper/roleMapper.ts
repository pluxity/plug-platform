import { RoleResponse } from '@plug/common-services/types';
import { RoleData } from '../types/role';

export const RoleMapper = (role: RoleResponse): RoleData => ({
    id: role.id,
    name: role.name,
    description: role.description,
    permissionGroupIds: role.permissions.map((permission) => permission.name).sort(),
});