export interface FileInfo {
    id: number | null;
    url: string | null;
    originalFileName: string | null;
    contentType: string | null;
    fileStatus: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface Facility {
    id: number;
    code: string | null;
    name: string;
    description: string;
    drawing: FileInfo;
    thumbnail: FileInfo;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface Station {
    facility: Facility;
    floors: unknown[];
    lineIds: number[];
    route: string | null;
}

export interface CreateStationData {
    facility: {
        name: string;
        code: string;
        description: string;
        drawingFileId: number;
        thumbnailFileId: number;
    };
    floors: Array<{
        name: string;
        floorId: number;
    }>;
    lineId: number;
    route: string;
}

export interface FacilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}