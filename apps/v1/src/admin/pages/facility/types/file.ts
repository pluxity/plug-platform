export interface FileState {
    file: File | null;
    fileId: number | null;
}

export interface MimeTypes {
    MODEL_GLB: 'model/gltf-binary';
    MODEL_GLTF: 'model/gltf+json';
    THUMBNAIL: 'image/png';
}

export type FileType = 'model' | 'thumbnail';