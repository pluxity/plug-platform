export interface DeviceData {
    id?: string;
    name?: string;
    categoryName?: string;
    companyType?: string;
    deviceType?: string;
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
    deviceId: string;
}