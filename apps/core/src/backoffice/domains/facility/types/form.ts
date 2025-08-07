import { 
  UseFormRegister, 
  FieldErrors, 
  Control, 
  UseFormSetValue, 
  UseFormWatch 
} from 'react-hook-form';
import { FileResponse } from '@plug/common-services';

export interface FacilityCreateFormData {
  facilityType: string;
  facility: {
    name: string;
    code: string;
    description?: string;
    drawingFileId?: number;
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

export interface FacilityFormComponentProps {
  register: UseFormRegister<FacilityCreateFormData>;
  errors: FieldErrors<FacilityCreateFormData>;
}

export interface ExtendedFacilityFormComponentProps extends FacilityFormComponentProps {
  control: Control<FacilityCreateFormData>;
  setValue: UseFormSetValue<FacilityCreateFormData>;
  watch: UseFormWatch<FacilityCreateFormData>;
  onDrawingFileUploaded?: (fileUrl: string) => void;
  onFloorsReplaceReady?: (replaceFunction: (floors: Array<{name: string; floorId: string}>) => void) => void;
  currentThumbnailFile?: FileResponse | null;
  currentDrawingFile?: FileResponse | null;
  isEditMode?: boolean;
}

export interface FloorsFormComponentProps extends FacilityFormComponentProps {
  control: Control<FacilityCreateFormData>;
  onFloorsReplaceReady?: (replaceFunction: (floors: Array<{name: string; floorId: string}>) => void) => void;
  isProcessingDrawing?: boolean;
}

export interface StationInfoFormComponentProps extends FacilityFormComponentProps {
  control: Control<FacilityCreateFormData>;
  setValue: UseFormSetValue<FacilityCreateFormData>;
  watch: UseFormWatch<FacilityCreateFormData>;
}
