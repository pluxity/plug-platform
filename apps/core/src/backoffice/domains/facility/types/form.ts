import { 
  UseFormRegister, 
  FieldErrors, 
  Control, 
  UseFormSetValue, 
  UseFormWatch 
} from 'react-hook-form';

// 시설 생성 폼 데이터 타입
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

// 기본 폼 컴포넌트 Props
export interface FacilityFormComponentProps {
  register: UseFormRegister<FacilityCreateFormData>;
  errors: FieldErrors<FacilityCreateFormData>;
}

// 확장된 폼 컴포넌트 Props (useFieldArray, setValue 등이 필요한 경우)
export interface ExtendedFacilityFormComponentProps extends FacilityFormComponentProps {
  control: Control<FacilityCreateFormData>;
  setValue: UseFormSetValue<FacilityCreateFormData>;
  watch: UseFormWatch<FacilityCreateFormData>;
  onDrawingFileUploaded?: (fileUrl: string) => void;
  onFloorsReplaceReady?: (replaceFunction: (floors: Array<{name: string; floorId: string}>) => void) => void;
}

// 역사 정보 폼 컴포넌트 Props (커스텀 로직 때문에 별도 타입)
export interface StationInfoFormComponentProps extends FacilityFormComponentProps {
  control: Control<FacilityCreateFormData>;
  setValue: UseFormSetValue<FacilityCreateFormData>;
  watch: UseFormWatch<FacilityCreateFormData>;
}

// 층 정보 폼 컴포넌트 Props (useFieldArray replace 함수 노출용)
export interface FloorsFormComponentProps extends ExtendedFacilityFormComponentProps {
  onFloorsReplaceReady?: (replaceFunction: (floors: Array<{name: string; floorId: string}>) => void) => void;
  isProcessingDrawing?: boolean;
}
