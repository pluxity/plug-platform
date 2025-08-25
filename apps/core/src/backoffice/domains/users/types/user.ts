export interface UserData {
    id: number;
    username: string; // 로그인 아이디
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