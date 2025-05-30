export interface DeviceResponse{
    id: number,
    feature: {
        id: string,
        position: {
            x: number,
            y: number,
            z: number
        },
        rotation: {
            x: number,
            y: number,
            z: number
        },
        scale: {
            x: number,
            y: number,
            z: number
        },
        assetId: number,
        floorId: number,
        deviceCode: string
    },
    categoryId: number,
    categoryName: string,
    asset: number,
    assetName: string,
    name: string,
    code: string,
    description: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}

export interface DeviceCreateRequest{
    deviceCategoryId?: number,
    asset?: number,
    name?: string,
    code?: string,
    description?: string
}

export interface DeviceUpdateRequest{
    deviceCategoryId?: number,
    asset?: number,
    name?: string,
    code?: string,
    description?: string
}