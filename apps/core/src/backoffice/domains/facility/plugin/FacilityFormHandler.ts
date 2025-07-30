import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFileUploadWithInfo } from '@plug/common-services';
import { FacilityRegistry } from './registry/FacilityRegistry';
import { FacilityType } from "../store/FacilityListStore";
import { FacilityFormMode } from "../components/layout/FacilityFormLayout";
import { FacilityManager } from "../services/FacilityManager";

export interface FacilityFormHandlerOptions {
  facilityType: FacilityType;
  facilityId?: number;
  mode: FacilityFormMode;
  initialData?: any;
  onSaveSuccess?: () => void;
}

export function useFacilityFormHandler({
                                         facilityType,
                                         facilityId,
                                         mode,
                                         initialData,
                                         onSaveSuccess
                                       }: FacilityFormHandlerOptions) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [facilityData, setFacilityData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');

  const thumbnailUploader = useFileUploadWithInfo();
  const drawingUploader = useFileUploadWithInfo();

  const facilityDefinition = FacilityRegistry.get(facilityType);

  useEffect(() => {
    const fetchData = async () => {
      if (mode === 'create') {
        if (initialData) {
          setFacilityData(initialData);
          setFormData(initialData);
        } else if (facilityDefinition) {
          try {
            const data = facilityDefinition.getInitialData();
            setFacilityData(data);
            setFormData(data);
          } catch (err) {
            console.error("Error getting initial data:", err);
            setError(new Error("초기 데이터를 가져오는데 실패했습니다."));
          }
        }
        setIsLoading(false);
        return;
      }

      if ((mode === 'detail' || mode === 'edit') && facilityId) {
        try {
          setIsLoading(true);
          const data = await FacilityManager.fetchFacilityDetail(facilityType, facilityId);
          setFacilityData(data);

          if (mode === 'edit' && data) {
            setFormData({
              facility: {
                name: data.facility.name,
                description: data.facility.description || "",
                code: data.facility.code,
                thumbnailFileId: data.facility.thumbnail.id,
                path: data.facility.path || ""
              }
            });
          }

          setError(null);
        } catch (err) {
          console.error("시설 정보 조회 오류:", err);
          setError(err instanceof Error ? err : new Error("시설 정보를 불러오는 중 오류가 발생했습니다."));
          setFacilityData(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [facilityType, facilityId, mode, facilityDefinition, initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      if (!prev) return prev;

      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...((prev)[parent] || {}),
            [child]: value
          }
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleThumbnailUpload = async (file: File) => {
    try {
      await thumbnailUploader.execute(file);
      if (thumbnailUploader.fileInfo && thumbnailUploader.fileInfo.id) {
        setFormData({
          ...formData,
          facility: {
            ...formData.facility,
            thumbnailFileId: thumbnailUploader.fileInfo.id
          }
        });
      }
    } catch (err) {
      console.error("썸네일 업로드 오류:", err);
      setFormError("썸네일 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleDrawingUpload = async (file: File) => {
    try {
      await drawingUploader.execute(file);
    } catch (err) {
      console.error("도면 업로드 오류:", err);
      setFormError("도면 업로드 중 오류가 발생했습니다.");
    }
  };

  // 저장 처리
  const handleSave = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const requestData = { ...formData };

      if (thumbnailUploader.fileInfo?.id) {
        requestData.facility.thumbnailFileId = thumbnailUploader.fileInfo.id;
      }

      if (mode === 'create') {
        if (drawingUploader.fileInfo?.id) {
          requestData.facility.drawingFileId = drawingUploader.fileInfo.id;
        }

        await FacilityManager.createFacility(facilityType, requestData);
        if (onSaveSuccess) onSaveSuccess();
      } else if (mode === 'edit' && facilityId) {
        await FacilityManager.updateFacility(facilityType, facilityId, requestData);

        searchParams.delete("mode");
        navigate(
          `/admin/facility/${facilityType}/${facilityId}?${searchParams.toString()}`,
          { replace: true }
        );

        setIsEditMode(false);

        const updatedData = await FacilityManager.fetchFacilityDetail(facilityType, facilityId);
        setFacilityData(updatedData);
      }
    } catch (err) {
      console.error(`시설 ${mode === 'create' ? '생성' : '업데이트'} 오류:`, err);
      setFormError(`시설을 ${mode === 'create' ? '생성' : '업데이트'}하는 중 오류가 발생했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!facilityId) return;

    try {
      await FacilityManager.deleteFacility(facilityType, facilityId);
      navigate('/admin/facility');
    } catch (err) {
      console.error("시설 삭제 오류:", err);
      alert("시설을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  const handleBack = () => {
    if (isEditMode) {
      if (confirm("편집 중인 내용이 저장되지 않습니다. 계속하시겠습니까?")) {
        setIsEditMode(false);
        searchParams.delete("mode");
        navigate(
          `/admin/facility/${facilityType}/${facilityId}?${searchParams.toString()}`,
          { replace: true }
        );
      }
    } else {
      navigate(-1);
    }
  }

  const handleEditToggle = () => {
    if (!isEditMode && facilityData) {
      setFormData({
        facility: {
          name: facilityData.facility.name,
          description: facilityData.facility.description || "",
          code: facilityData.facility.code,
          thumbnailFileId: facilityData.facility.thumbnail.id,
          path: facilityData.facility.path || ""
        }
      });
      searchParams.set("mode", "edit");
      navigate(`?${searchParams.toString()}`, { replace: true });
    } else {
      searchParams.delete("mode");
      navigate(
        `/admin/facility/${facilityType}/${facilityId}?${searchParams.toString()}`,
        { replace: true }
      );
    }

    setIsEditMode(!isEditMode);
    setFormError(null);
  };

  return {
    data: {
      facilityData,
      formData,
      isLoading,
      error,
      formError,
      isSubmitting,
      isEditMode,
      thumbnailUploader,
      drawingUploader
    },
    handlers: {
      handleInputChange,
      handleThumbnailUpload,
      handleDrawingUpload,
      handleSave,
      handleDelete,
      handleBack,
      handleEditToggle
    }
  };
}