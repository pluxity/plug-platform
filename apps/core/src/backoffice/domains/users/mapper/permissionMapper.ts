import { PermissionResponse } from '@plug/common-services';
import { PermissionData } from '../types/permisson';

export const PermissionMapper = (permission: PermissionResponse): PermissionData => ({
    id: permission.id,
    name: permission.name,
    permissions: permission.permissions.map(permission => ` ${permission.resourceType}(${permission.resourceIds.sort().toString()}) `),
}); 
