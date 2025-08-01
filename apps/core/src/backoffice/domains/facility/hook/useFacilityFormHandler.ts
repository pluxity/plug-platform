import { useEffect, useState } from "react";
import {useFileUploadWithInfo, useUpdateFacilitiesDrawing} from "@plug/common-services";
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

interface FacilityFormState {
  facilityData?: FacilityData;
  formData?: FacilityFormData;
  isLoading: boolean;
  error: Error | null;
  isEditMode: boolean;
  thumbnailUploader: ReturnType<typeof useFileUploadWithInfo>;
  drawingUploader: ReturnType<typeof useFileUploadWithInfo>;
}

interface FacilityFormHandlers {
  handleInputChange: (key: string, value: string | number | boolean | string[] | number[]) => void;
  handleThumbnailUpload: (file: File) => Promise<void>;
  handleDrawingUpload: (file: File) => Promise<void>;
  handleUpdateDrawing: (data: DrawingUpdateOptions) => Promise<void>;
  handleSave: () => Promise<void>;
  handleEditToggle: () => void;
  handleBack: () => void;
  handleDelete: () => Promise<void>;
}

export function useFacilityFormHandler({
                                         facilityType,
                                         facilityId,
                                         mode,
                                         initialData,
                                         onSaveSuccess
                                       }: FacilityFormHandlerProps) {
  const [formState, setFormState] = useState<FacilityFormState>({
    facilityData: undefined,
    formData: undefined,
    isLoading: true,
    error: null,
    isEditMode: mode === 'edit',
    thumbnailUploader: useFileUploadWithInfo(),
    drawingUploader: useFileUploadWithInfo()
  });
  const drawingUpdateApi =  useUpdateFacilitiesDrawing(facilityId);

    useEffect(() => {
    const fetchData = async () => {
      if (!facilityType) return;

      setFormState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        if (facilityId) {
          const facilityService = FacilityServiceFactory.getService(facilityType);
          const data = await facilityService.fetchDetail(facilityId);

          if (data) {
            setFormState(prev => ({
              ...prev,
              facilityData: data,
              formData: data as FacilityFormData,
              isLoading: false
            }));
          } else {
            throw new Error("시설물 데이터를 찾을 수 없습니다.");
          }
        } else if (initialData) {
          setFormState(prev => ({
            ...prev,
            formData: initialData as FacilityFormData,
            isLoading: false
          }));
        } else {
          setFormState(prev => ({
            ...prev,
            formData: {} as FacilityFormData,
            isLoading: false
          }));
        }
      } catch (err) {
        console.error("시설물 데이터 로딩 실패:", err);
        setFormState(prev => ({
          ...prev,
          error: err as Error,
          isLoading: false
        }));
      }
    };

    fetchData();
  }, [facilityType, facilityId, initialData]);

  const handleInputChange = (key: string, value: string | number | boolean | string[] | number[]) => {
    setFormState(prev => {
      if (!prev.formData) {
        return {
          ...prev,
          formData: { [key]: value } as unknown as FacilityFormData
        };
      }

      return {
        ...prev,
        formData: updateFacilityField(prev.formData, key, value)
      };
    });
  };

  const handleThumbnailUpload = async (file: File) => {
    try {
      const result = await formState.thumbnailUploader.execute(file);
      if (result?.id) {
        handleInputChange('facility.thumbnailFileId', result.id);
      }
    } catch (err) {
      console.error("썸네일 업로드 실패:", err);
    }
  };

  const handleDrawingUpload = async (file: File) => {
    try {
      const result = await formState.drawingUploader.execute(file);
      if (result?.id) {
        handleInputChange('facility.drawingFileId', result.id);
      }
    } catch (err) {
      console.error("도면 업로드 실패:", err);
    }
  };

  const handleUpdateDrawing = async (data: DrawingUpdateOptions) => {
        if (!facilityId ) {
            console.error("도면 업데이트를 위한 시설 ID가 없거나 API가 초기화되지 않았습니다.");
            return;
        }

        setFormState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await drawingUpdateApi.execute(data);

            if (response) {
                const facilityService = FacilityServiceFactory.getService(facilityType);
                const updatedData = await facilityService.fetchDetail(facilityId);

                if (updatedData) {
                    setFormState(prev => ({
                        ...prev,
                        facilityData: updatedData,
                        formData: updatedData as FacilityFormData,
                        isLoading: false
                    }));
                } else {
                    throw new Error("업데이트된 시설물 데이터를 찾을 수 없습니다.");
                }
            } else {
                throw new Error("도면 업데이트에 실패했습니다.");
            }

        } catch (err) {
            console.error("도면 업데이트 실패:", err);
            setFormState(prev => ({
                ...prev,
                error: err as Error,
                isLoading: false
            }));
            throw err;
        }
    };

  const handleSave = async () => {
    if (!facilityType || !formState.formData) return;

    setFormState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const facilityService = FacilityServiceFactory.getService(facilityType);
      let success = false;

      if (facilityId) {
        success = await facilityService.update(facilityId, formState.formData);
      } else {
        success = await facilityService.create(formState.formData);
      }

      if (success) {
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } else {
        throw new Error("시설물 저장에 실패했습니다.");
      }

      setFormState(prev => ({ ...prev, isLoading: false }));
    } catch (err) {
      console.error("시설물 저장 실패:", err);
      setFormState(prev => ({
        ...prev,
        error: err as Error,
        isLoading: false
      }));
    }
  };

  const handleEditToggle = () => {
    setFormState(prev => ({ ...prev, isEditMode: !prev.isEditMode }));
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleDelete = async () => {
    if (!facilityType || !facilityId) return;

    setFormState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const facilityService = FacilityServiceFactory.getService(facilityType);
      const success = await facilityService.delete(facilityId);

      if (success) {
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } else {
        throw new Error("시설물 삭제에 실패했습니다.");
      }

      setFormState(prev => ({ ...prev, isLoading: false }));
    } catch (err) {
      console.error("시설물 삭제 실패:", err);
      setFormState(prev => ({
        ...prev,
        error: err as Error,
        isLoading: false
      }));
    }
  };

  const handlers: FacilityFormHandlers = {
    handleInputChange,
    handleThumbnailUpload,
    handleDrawingUpload,
    handleUpdateDrawing,
    handleSave,
    handleEditToggle,
    handleBack,
    handleDelete
  };

  return {
    data: formState,
    handlers
  };
}