import { PermissionData, PermissionResourceData } from '../types/permisson';

import { PermissionResponse, PermissionResourceType } from '@plug/common-services';
export const PermissionMapper = (permission: PermissionResponse, resourceTypes: PermissionResourceType[], resourceData: Record<string, PermissionResourceData[]>): PermissionData => ({
    id: permission.id,
    name: permission.name,
    permissions: permission.permissions.map(p => {
        const resourse = resourceData[p.resourceType] || [];
        const resourceNames = p.resourceIds.map(id => {
            const resource = resourse.find(item => item.id === id);
            return resource?.name || id;
        });
        
        const type = resourceTypes.find(type => type.key === p.resourceType);
        const typeName = type?.name || p.resourceType;
        
        return `${typeName}(${resourceNames.sort().join(', ')})`;
    }),
}); 
