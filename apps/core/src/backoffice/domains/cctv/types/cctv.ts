export interface CctvData{
    id: string;
    name: string;
    url: string;
}

export interface CctvCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export interface CctvEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    cctvId: string;
}