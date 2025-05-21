export interface AssetResponse {
    id: number,
    name: string,
    file: {
      id: number,
      url: string,
      originalFileName: string,
      contentType: string,
      fileStatus: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    createBy: string,
    updatedAt: string,
    updateBy: string
}

export interface AssetCreateRequest {
    name: string,
    fileId: number,
}

export interface AssetUpdateRequest {
    name: string,
    fileId: number,
}


