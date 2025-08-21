import { useCallback } from 'react';

export type PermissionItem = {
    resourceType: string;
    resourceIds: string[];
};

export const usePermissionCheckbox = () => {
    const isResourceSelected = useCallback((permissions: PermissionItem[], resourceType: string, resourceId: string) => {
        return permissions.some(permission => 
            permission.resourceType === resourceType && 
            permission.resourceIds.includes(resourceId)
        );
    }, []);

    const handleCheckboxChange = useCallback((
        permissions: PermissionItem[], 
        onChange: (value: PermissionItem[]) => void, 
        resourceType: string, 
        resourceId: string, 
        checked: boolean
    ) => {
        const newPermissions = [...permissions];
        
        // 해당 resourceType의 permission 찾기
        const existingPermissionIndex = newPermissions.findIndex(p => p.resourceType === resourceType);
        if (checked) {
            if (existingPermissionIndex >= 0) {
                if (!newPermissions[existingPermissionIndex].resourceIds.includes(resourceId)) {
                    newPermissions[existingPermissionIndex].resourceIds.push(resourceId);
                }
            } else {
                newPermissions.push({
                    resourceType,
                    resourceIds: [resourceId]
                });
            }
        } else {
            if (existingPermissionIndex >= 0) {
                newPermissions[existingPermissionIndex].resourceIds = 
                    newPermissions[existingPermissionIndex].resourceIds.filter((id: string) => id !== resourceId);
                if (newPermissions[existingPermissionIndex].resourceIds.length === 0) {
                    newPermissions.splice(existingPermissionIndex, 1);
                }
            }
        }
        onChange(newPermissions);
    }, []);

    return {
        isResourceSelected,
        handleCheckboxChange
    };
}; 