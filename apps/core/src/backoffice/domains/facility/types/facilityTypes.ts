import { FacilityData, FacilityFormData } from "@/backoffice/domains/facility/types/facilityTypeGuard";

export type FacilityType = 'facilities' | 'buildings' | 'stations';

export const FACILITY_TYPE_LABELS: Record<FacilityType, string> = {
  'facilities': '시설',
  'buildings': '건물',
  'stations': '역사',
};

export interface DrawingUpdateOptions {
  drawingFileId: number;
  comment: string;
  floors?: Array<{name: string; floorId: string}>;
}

export interface IFacilityService {
  fetchDetail(id: number): Promise<FacilityData | null>;
  create(data: FacilityFormData): Promise<boolean>;
  update(id: number, data: Partial<FacilityFormData>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  updateDrawing?(id: number, data: any, floors?: any[]): Promise<boolean>;
}