// 1. Domain Models --------------------------------
import { FacilityResponse, FacilityType } from '@plug/common-services';

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number;
}

export type FacilityWithType = FacilityResponse & { facilityType: FacilityType };

// 2. API DTOs -------------------------------------
export interface FacilityCreateRequest {
  facilityType: string; // backend domain key
  facility: {
    name: string;
    code: string;
    description?: string;
    thumbnailFileId?: number;
    drawingFileId?: number;
    lon?: number;
    lat?: number;
    locationMeta?: string;
  };
  floors?: Array<{
    name: string;
    floorId: string;
  }>;
  stationInfo?: {
    lineIds?: number[];
    stationCodes?: string[];
  };
  boundary?: string; // geometry (WKT/GeoJSON string)
}

export interface FacilityUpdateRequest extends FacilityCreateRequest {
  id: number;
}

// 3. Form Types -----------------------------------
import {
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import { FileResponse } from '@plug/common-services';

export interface FacilityCreateFormData extends FacilityCreateRequest {
  // client-only temp field(s)
  _tempThumbnailFile?: File | null;
}

export interface FacilityFormProps {
  register: UseFormRegister<FacilityCreateFormData>;
  errors: FieldErrors<FacilityCreateFormData>;
}

export interface ExtendedFacilityFormProps extends FacilityFormProps {
  control: Control<FacilityCreateFormData>;
  setValue: UseFormSetValue<FacilityCreateFormData>;
  watch: UseFormWatch<FacilityCreateFormData>;
  onFloorsReplaceReady?: (replaceFunction: (floors: Array<{ name: string; floorId: string }>) => void) => void;
  onDrawingFileUploaded?: (fileUrl: string) => void;
  currentThumbnailFile?: FileResponse | null;
  currentDrawingFile?: FileResponse | null;
  isEditMode?: boolean;
}

export interface FloorsFormProps extends FacilityFormProps {
  control: Control<FacilityCreateFormData>;
  onFloorsReplaceReady?: (replaceFunction: (floors: Array<{ name: string; floorId: string }>) => void) => void;
  isProcessingDrawing?: boolean;
}

export interface StationInfoFormProps extends FacilityFormProps {
  control: Control<FacilityCreateFormData>;
  setValue: UseFormSetValue<FacilityCreateFormData>;
  watch: UseFormWatch<FacilityCreateFormData>;
}

// 4. Query / Hook Contracts -----------------------
export interface UseFacilityDataResult {
  facilitiesByType: Record<FacilityType, FacilityResponse[]>;
  isLoading: boolean;
  error: string | null;
  getFacilityCount: Record<FacilityType, number>;
  getAllFacilities: FacilityWithType[];
  deleteFacility: (id: number, facilityType: FacilityType) => Promise<void>;
  refetch: () => Promise<unknown> | void;
}

// 5. View Models ----------------------------------
export interface FacilityCardVM {
  id: number;
  name: string;
  code: string;
  displayType: FacilityType;
  thumbnailUrl?: string;
}

export const toFacilityCardVM = (f: FacilityWithType): FacilityCardVM => ({
  id: f.id,
  name: f.name,
  code: f.code,
  displayType: f.facilityType,
  thumbnailUrl: f.thumbnail?.url
});

// 6. Helpers / Type Guards (placeholder) ----------
export const isFacilityWithType = (value: unknown): value is FacilityWithType => {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<FacilityWithType>;
    return typeof v.id === 'number' && typeof (v as Record<string, unknown>).facilityType === 'string';
};
