import { useEffect, useState } from "react";
import { FacilityManager } from "../services/facilityManager";
import { useFileUploadWithInfo, Floor, FacilityDrawingUpdateRequest, useUpdateFacilitiesDrawing } from "@plug/common-services";
import { useFacilityDetail, useFacilityCreate, useFacilityUpdate } from "./useFacilityHooks";
import { FacilityData, FacilityFormData, FacilityFormMode } from "../types/facilityTypeGuard";
import { FacilityType } from "@/backoffice/domains/facility/store/FacilityListStore";

interface FacilityFormHandlerProps {
  facilityType: FacilityType;
  facilityId?: number;
  mode: FacilityFormMode;
  initialData?: unknown;
  onSaveSuccess?: () => void;
}

export function useFacilityFormHandler({
  facilityType,
  facilityId,
  mode,
  initialData,
  onSaveSuccess
}: FacilityFormHandlerProps) {
  const [formData, setFormData] = useState<FacilityFormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(mode === 'edit');
  const [facilityData, setFacilityData] = useState<FacilityData | null>(null);

  const thumbnailUploader = useFileUploadWithInfo();
  const drawingUploader = useFileUploadWithInfo();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const drawingUpdateService = facilityId ? useUpdateFacilitiesDrawing(facilityId) : null;
  useFacilityDetail(facilityType, facilityId || 0);
  useFacilityCreate(facilityType);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (facilityId) useFacilityUpdate(facilityType, facilityId);

  useEffect(() => {
    const fetchData = async () => {
      if (!facilityType) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        if (facilityId) {

          const data = await FacilityManager.fetchFacilityDetail<FacilityData>(facilityType, facilityId);
          if (data) {
            setFacilityData(data);
            setFormData(data as unknown as FacilityFormData);
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

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => prev ? { ...prev, [key]: value } : { [key]: value });
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
  const handleUpdateDrawing = async (data: FacilityDrawingUpdateRequest, floors: Floor[]) => {
    if (!drawingUpdateService || !facilityId) {
      console.error("도면 업데이트 서비스를 사용할 수 없습니다.");
      return;
    }

    try {
      await drawingUpdateService.execute({
        ...data,
        floors: floors
      });

      const updatedData = await FacilityManager.fetchFacilityDetail<FacilityData>(facilityType, facilityId);
      if (updatedData) {
        setFacilityData(updatedData);
        setFormData(updatedData as unknown as FacilityFormData);
      }
    } catch (err) {
      console.error("도면 업데이트 실패:", err);
      throw err;
    }
  };

  const handleSave = async () => {
    if (!facilityType || !formData) return;

    setIsLoading(true);
    setError(null);

    try {
      let success = false;
      
      if (facilityId) {
        success = await FacilityManager.updateFacility(facilityType, facilityId, formData);
      } else {
        success = await FacilityManager.createFacility(facilityType, formData);
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
      const success = await FacilityManager.deleteFacility(facilityType, facilityId);
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