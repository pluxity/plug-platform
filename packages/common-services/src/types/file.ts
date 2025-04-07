export interface FileRequest {
    file: File;
}
export interface FileResponse {
    id: number;
    url: string;
    originalFileName: string;
    fileType: string;
    contentType: string;
    fileStatus: string;
    createdAt: string;
    updatedAt: string;
}

export interface FileUploadResponse {
    id: number;
    originalFileName: string;
    contentType: string;
    createdAt: string;
}

/** SBM 파일 업로드 응답 */
export interface SbmFileUploadResponse {
    id: number;
    originalFileName: string;
    contentType: string;
    createdAt: string;
    floorList: SbmFloorGroup[];
}

export interface SbmFloorGroup {
    groupId: string;
    mainFloorInfo: SbmFloorInfo;
    floorInfoList: SbmFloorInfo[];
}

export interface SbmFloorInfo {
    floorId: string;
    floorName: string;
    fileName: string;
    floorBase: string;
    floorGroup: string;
    isMain: boolean;
}

