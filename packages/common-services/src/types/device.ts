export interface CategoryResponse {
    id: number,
    name: string,
    parentId?: number,
    iconFile: {
      id: number,
      url: string,
      originalFileName: string,
      contentType: string,
      fileStatus: string,
      createdAt: string,
      updatedAt: string,
    }
    baseResponse:{
        createdAt: string,
        createdBy: string,
        updatedAt: string,
        updatedBy: string
    }
}

export interface CategoryCreateRequest {
    name: string,
    contextPath?: number,
    iconFileId: number,
}

export interface CategoryUpdateResquest {
    name: string,
    contextPath?: number,
    iconFileId?: number,
}