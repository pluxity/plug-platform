export interface AssetResponse {
    id: number,
    name: string,
    type: 'TWO_DIMENSION' | string,
    createdBy: string,
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
    type: string,
    name: string,
    fileId: number
}

export interface AssetUpdateRequest {
    type: string,
    name: string,
    fileId: number
}


