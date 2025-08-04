export interface PermissionData {
    id: number;
    name: string;
    permissions: string[];
}

export interface PermissionResourceData{
    id: string;
    name: string;
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