import { useEffect, useState } from "react";
import { useFileUploadWithInfo,  } from "@plug/common-services";
import { FacilityData, FacilityFormData, FacilityFormMode, updateFacilityField } from "../types/facilityTypeGuard";
import { FacilityType, DrawingUpdateOptions } from "../types/facilityTypes";
import { FacilityServiceFactory } from "../services/facilityServiceFactory";

interface FacilityFormHandlerProps {
  facilityType: FacilityType;
  facilityId?: number;
  mode: FacilityFormMode;
  initialData?: unknown;
  onSaveSuccess?: () => void;
}

export function useFacilityFormHandler({ facilityType, facilityId, mode, initialData, onSaveSuccess }: FacilityFormHandlerProps) {
  const [formData, setFormData] = useState<FacilityFormData | undefined>(undefined);
  const [facilityData, setFacilityData] = useState<FacilityData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(mode === 'edit');

  const thumbnailUploader = useFileUploadWithInfo();
  const drawingUploader = useFileUploadWithInfo();

  useEffect(() => {
    const fetchData = async () => {
      if (!facilityType) return;

      setIsLoading(true);
      setError(null);

      try {
        if (facilityId) {
          const facilityService = FacilityServiceFactory.getService(facilityType);
          const data = await facilityService.fetchDetail(facilityId);
          if (data) {
            setFacilityData(data);
            setFormData(data as FacilityFormData);
          }
        } else if (initialData) {
          setFormData(initialData as FacilityFormData);
        } else {
          setFormData({} as FacilityFormData);
        }
      } catch (err) {
        setError(err as Error);
        console.error("시설물 데이터 로딩 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [facilityType, facilityId, initialData]);

  type FormDataValue = string | number | boolean;

  const handleInputChange = (key: string, value: FormDataValue) => {
    setFormData((prev) => {
      if (!prev) return { [key]: value } as unknown as FacilityFormData;
      return updateFacilityField(prev, key, value);
    });
  };

  const handleThumbnailUpload = async (file: File) => {
    try {
      const result = await thumbnailUploader.execute(file);
      if (result?.id) {
        handleInputChange('facility.thumbnailFileId', result.id);
      }
    } catch (err) {
      console.error("썸네일 업로드 실패:", err);
    }
  };

  const handleDrawingUpload = async (file: File) => {
    try {
      const result = await drawingUploader.execute(file);
      if (result?.id) {
        handleInputChange('facility.drawingFileId', result.id);
      }
    } catch (err) {
      console.error("도면 업로드 실패:", err);
    }
  };

  const handleUpdateDrawing = async (data: DrawingUpdateOptions) => {
    if (!facilityId) {
      console.error("도면 업데이트를 위한 시설 ID가 없습니다.");
      return;
    }

    try {
      setIsLoading(true);
      const facilityService = FacilityServiceFactory.getService(facilityType);

      if (!facilityService.updateDrawing) {
        throw new Error(`${facilityType} 타입은 도면 업데이트를 지원하지 않습니다.`);
      }

      const success = await facilityService.updateDrawing(facilityId, data);

      if (success) {
        const updatedData = await facilityService.fetchDetail(facilityId);
        if (updatedData) {
          setFacilityData(updatedData);
          setFormData(updatedData as FacilityFormData);
        }
      }
    } catch (err) {
      setError(err as Error);
      console.error("도면 업데이트 실패:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!facilityType || !formData) return;

    setIsLoading(true);
    setError(null);

    try {
      const facilityService = FacilityServiceFactory.getService(facilityType);
      let success = false;

      if (facilityId) {
        success = await facilityService.update(facilityId, formData);
      } else {
        success = await facilityService.create(formData);
      }

      if (success && onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      setError(err as Error);
      console.error("시설물 저장 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditMode(prev => !prev);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleDelete = async () => {
    if (!facilityType || !facilityId) return;

    setIsLoading(true);
    setError(null);

    try {
      const facilityService = FacilityServiceFactory.getService(facilityType);
      const success = await facilityService.delete(facilityId);

      if (success && onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      setError(err as Error);
      console.error("시설물 삭제 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: {
      facilityData,
      formData,
      isLoading,
      error,
      isEditMode,
      thumbnailUploader,
      drawingUploader,
    },
    handlers: {
      handleInputChange,
      handleThumbnailUpload,
      handleDrawingUpload,
      handleUpdateDrawing,
      handleSave,
      handleEditToggle,
      handleBack,
      handleDelete,
    },
  };
}