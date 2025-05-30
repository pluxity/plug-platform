export interface FileInfo {
    id: number;
    url: string;
    originalFileName: string;
    contentType: string;
    fileStatus: string;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface BaseEntity {
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface Facility extends BaseEntity {
    id: number;
    code: string | null;
    name: string;
    description: string;
    drawing: FileInfo;
    thumbnail: FileInfo;
}

export interface Floor {
    name: string;
    floorId: number;
}

export interface Station {
    facility: Facility;
    floors: Floor[];
    lineIds: number[];
    route: string | null;
}

export interface CreateFacilityDTO {
    name: string;
    code: string;
    description: string;
    drawingFileId: number;
    thumbnailFileId: number;
}

export interface CreateStationDTO {
    facility: CreateFacilityDTO;
    floors: Floor[];
    lineId: number;
    route: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export interface StationDetail extends Station {
    features: Feature[];
    externalCode: string;
}

export interface Feature {
    name: string;
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
}