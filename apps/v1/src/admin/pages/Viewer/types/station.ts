import type { FileResponse } from './index';

export interface Facility {
  id: number;
  name: string;
  description: string;
  drawing: FileResponse;
  thumbnail: FileResponse;
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