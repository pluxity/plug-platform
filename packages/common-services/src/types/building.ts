export interface FileMeta {
    id: number;
    url: string;
    originalFileName: string;
    fileType: string;
    contentType: string;
    fileStatus: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Building {
    id: number;
    name: string;
    description: string;
    file: FileMeta;
    thumbnail: FileMeta;
    createdAt: string;
    updatedAt: string;
  }  