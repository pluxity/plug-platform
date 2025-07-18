export interface RoleData {
    id: number
    name: string;
    description: string;
}

export interface RoleCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export interface RoleEditModalProps {   
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    roleId: number | undefined;
}