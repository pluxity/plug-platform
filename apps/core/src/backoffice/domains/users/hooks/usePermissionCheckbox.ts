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

    // CCTV 전체 권한 체크 함수
    const isCCTVAllSelected = useCallback((permissions: PermissionItem[]) => {
        return permissions.some(permission => 
            permission.resourceType === 'CCTV' && 
            permission.resourceIds.includes('ALL')
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

    // CCTV 전체 권한 토글 함수
    const handleCCTVAllToggle = useCallback((
        permissions: PermissionItem[],
        onChange: (value: PermissionItem[]) => void,
        checked: boolean
    ) => {
        const newPermissions = [...permissions];
        const existingPermissionIndex = newPermissions.findIndex(p => p.resourceType === 'CCTV');
        
        if (checked) {
            if (existingPermissionIndex >= 0) {
                newPermissions[existingPermissionIndex] = {
                    resourceType: 'CCTV',
                    resourceIds: ['ALL']
                };
            } else {
                newPermissions.push({
                    resourceType: 'CCTV',
                    resourceIds: ['ALL']
                });
            }
        } else {
            if (existingPermissionIndex >= 0) {
                newPermissions.splice(existingPermissionIndex, 1);
            }
        }
        onChange(newPermissions);
    }, []);

    return {
        isResourceSelected,
        handleCheckboxChange,
        isCCTVAllSelected,
        handleCCTVAllToggle
    };
}; 