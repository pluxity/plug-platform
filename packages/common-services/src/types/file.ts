export interface FileRequest {
    file: File;
}

export interface FileResponse {
    id: number;
    url: string;
    originalFileName: string;
    contentType: string;
    fileStatus: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface FileError {
    type: 'UPLOAD_ERROR' | 'FETCH_INFO_ERROR' | 'NETWORK_ERROR';
    message: string;
    originalError?: Error;
}

export interface UseFileUploadWithInfoReturn {
    execute: (file: File) => Promise<{ data: any; response: Response | null }>;
    fileInfo: FileResponse | null;
    isLoadingFileInfo: boolean;
    fileInfoError: Error | null;
    clearFileInfo: () => void;
    isLoading: boolean;
    error: any;
    isSuccess: boolean;
    data: any;
    response: Response | null;
    reset: () => void;
    getLocationId: () => string | null;
}
