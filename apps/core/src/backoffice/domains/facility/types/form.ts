import { 
  UseFormRegister, 
  FieldErrors, 
  Control, 
  UseFormSetValue, 
  UseFormWatch 
} from 'react-hook-form';
import { FileResponse } from '@plug/common-services';

// 위치 데이터 타입 정의
export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface FacilityCreateFormData {
  facilityType: string;
  facility: {
    name: string;
    code: string;
    description?: string;
    thumbnailFileId?: number;
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
  boundary?: string;
}

export interface FacilityFormProps {
  register: UseFormRegister<FacilityCreateFormData>;
  errors: FieldErrors<FacilityCreateFormData>;
}

export interface ExtendedFacilityFormProps extends FacilityFormProps {
  control: Control<FacilityCreateFormData>;
  setValue: UseFormSetValue<FacilityCreateFormData>;
  watch: UseFormWatch<FacilityCreateFormData>;
  onFloorsReplaceReady?: (replaceFunction: (floors: Array<{name: string; floorId: string}>) => void) => void;
  onDrawingFileUploaded?: (fileUrl: string) => void;
  currentThumbnailFile?: FileResponse | null;
  currentDrawingFile?: FileResponse | null;
  isEditMode?: boolean;
}

export interface FloorsFormProps extends FacilityFormProps {
  control: Control<FacilityCreateFormData>;
  onFloorsReplaceReady?: (replaceFunction: (floors: Array<{name: string; floorId: string}>) => void) => void;
  isProcessingDrawing?: boolean;
}

export interface StationInfoFormProps extends FacilityFormProps {
  control: Control<FacilityCreateFormData>;
  setValue: UseFormSetValue<FacilityCreateFormData>;
  watch: UseFormWatch<FacilityCreateFormData>;
}
