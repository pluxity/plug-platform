export interface AssetData {
    categoryId: number
    categoryName: string
    id: string
    code: string
    name: string
    file: string
    thumbnailFile: string
}

export interface AssetCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}
export interface AssetEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    assetId: number | null;
}