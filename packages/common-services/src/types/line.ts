export interface LineResponse {
  id: number;
  name: string;
  color: string;
  stationIds: number[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface LineRequest {
  name: string;
  color: string;
}