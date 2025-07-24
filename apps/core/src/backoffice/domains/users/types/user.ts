export interface UserData {
    id: number;
    name: string;
    code: string;
    phoneNumber: string;
    department: string;
    roleIds: number[];
}

export interface UserCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export interface UserEditModalProps {   
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    userId: number;
}