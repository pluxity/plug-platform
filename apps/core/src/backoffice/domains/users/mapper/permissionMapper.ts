import { PermissionResponse } from '@plug/common-services';
import { PermissionData } from '../types/permisson';

export const PermissionMapper = (permission: PermissionResponse): PermissionData => ({
    id: permission.id,
    resourceName: permission.resourceName,
    resourceId: permission.resourceId,
});