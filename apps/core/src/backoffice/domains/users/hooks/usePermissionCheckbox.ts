import { useCallback } from 'react';

export type PermissionItem = {
    resourceType: string;
    resourceIds: string[];
};

export const usePermissionCheckbox = () => {
    // permissions 필드 값에서 특정 리소스가 선택되어 있는지 확인하는 함수
    const isResourceSelected = useCallback((permissions: PermissionItem[], resourceType: string, resourceId: string) => {
        return permissions.some(permission => 
            permission.resourceType === resourceType && 
            permission.resourceIds.includes(resourceId)
        );
    }, []);

    // 체크박스 변경 핸들러
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
            // 체크되었을 때
            if (existingPermissionIndex >= 0) {
                // 기존 permission이 있으면 resourceId 추가
                if (!newPermissions[existingPermissionIndex].resourceIds.includes(resourceId)) {
                    newPermissions[existingPermissionIndex].resourceIds.push(resourceId);
                }
            } else {
                // 기존 permission이 없으면 새로 생성
                newPermissions.push({
                    resourceType,
                    resourceIds: [resourceId]
                });
            }
        } else {
            // 체크 해제되었을 때
            if (existingPermissionIndex >= 0) {
                // resourceId 제거
                newPermissions[existingPermissionIndex].resourceIds = 
                    newPermissions[existingPermissionIndex].resourceIds.filter((id: string) => id !== resourceId);
                
                // resourceIds가 비어있으면 해당 permission 제거
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