export interface DeviceData {
    id?: string;
    name?: string;
    categoryName?: string;
    thumbnailFile?: string;
}

export interface DeviceCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}
export interface DeviceEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    deviceId: string ;
}