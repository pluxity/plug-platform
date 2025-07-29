export interface PermissionData {
    id: number;
    resourceName: string;
    resourceId: string;
}

export interface PermissionCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export interface PermissionEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    permissionId: number;
}