// Station 관련 타입 정의
export interface FileInfo {
  id: number;
  url: string;
  originalFileName: string;
  contentType: string;
  fileStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: number;
  name: string;
  description: string;
  drawing: FileInfo;
  thumbnail: FileInfo;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Floor {
  name: string;
  groupId: string;
}

export interface StationData {
  facility: Facility;
  floors: Floor[];
  lineId: number;
  route: string;
}

// Legacy 타입들 (기존 호환성 유지)
export interface Station {
  id: number;
  name: string;
  code?: string;
  lineNo?: string;
  description?: string;
  location?: {
    lat: number;
    lon: number;
  };
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
}
