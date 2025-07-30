import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFileUploadWithInfo, FacilityRequest } from "@plug/common-services";
import { FacilityRegistry } from './registry/FacilityRegistry';
import { FacilityType } from "../store/FacilityListStore";
import { FacilityFormMode } from "../components/layout/FacilityFormLayout";
import { FacilityManager } from "../services/FacilityManager";
import {
  FacilityData,
  FacilityFormData,
  FacilityUpdateRequest,
  getFacilityBase,
  getThumbnail
} from "../types/facilityTypeGuard";

export interface FacilityFormHandlerOptions {
  facilityType: FacilityType;
  facilityId?: number;
  mode: FacilityFormMode;
  initialData?: FacilityFormData;
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
  const [facilityData, setFacilityData] = useState<FacilityData | null>(null);
  const [formData, setFormData] = useState<FacilityRequest | null>(null);
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
          const facility = getFacilityBase(initialData);
          setFormData({
            facility: {
              name: facility.name || "",
              description: 'description' in facility ? facility.description : "",
              code: facility.code || "",
              locationMeta: 'locationMeta' in facility ? facility.locationMeta : ""
            }
          });
        } else if (facilityDefinition) {
          try {
            const data = facilityDefinition.getInitialData();
            setFacilityData(data);
            setFormData({
              facility: {
                name: "",
                code: "",
                description: "",
                locationMeta: ""
              }
            });
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
          const data = await FacilityManager.fetchFacilityDetail<FacilityUpdateRequest>(facilityType, facilityId);
          setFacilityData(data);

          if (mode === 'edit' && data && data.facility) {
            const thumbnail = getThumbnail(facilityData as FacilityData);
            const thumbnailId = thumbnail?.id;

            setFormData({
              facility: {
                name: data.facility.name || "",
                description: 'description' in data.facility ? data.facility.description : "",
                code: data.facility.code || "",
                thumbnailFileId: thumbnailId,
                locationMeta: 'locationMeta' in data.facility ? data.facility.locationMeta : ""
              },
              ...Object.keys(data)
                .filter(key => key !== 'facility')
                .reduce((obj, key) => {
                  obj[key] = data[key as keyof FacilityData];
                  return obj;
                }, {} as Record<string, unknown>)
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

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => {
      if (!prev) return prev;

      if (field.includes('.')) {
        const [, child] = field.split(".");
        return {
          ...prev,
          facility: {
            ...prev.facility,
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
        setFormData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            facility: {
              ...(prev.facility || {}),
              thumbnailFileId: thumbnailUploader.fileInfo?.id
            }
          };
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
      if (drawingUploader.fileInfo && drawingUploader.fileInfo.id) {
        setFormData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            facility: {
              ...(prev.facility || {}),
              drawingFileId: drawingUploader.fileInfo?.id
            }
          };
        });
      }
    } catch (err) {
      console.error("도면 업로드 오류:", err);
      setFormError("도면 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    if (!formData) {
      setFormError("폼 데이터가 없습니다.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const requestData = { ...formData } as FacilityRequest;

      if (thumbnailUploader.fileInfo?.id && requestData.facility) {
        requestData.facility.thumbnailFileId = thumbnailUploader.fileInfo.id;
      }

      if (mode === 'create') {
        if (drawingUploader.fileInfo?.id && requestData.facility) {
          requestData.facility.drawingFileId = drawingUploader.fileInfo.id;
        }

        await FacilityManager.createFacility(facilityType, requestData as unknown as FacilityFormData);
        if (onSaveSuccess) onSaveSuccess();
      } else if (mode === 'edit' && facilityId) {
        await FacilityManager.updateFacility(facilityType, facilityId, requestData as unknown as FacilityFormData);

        searchParams.delete("mode");
        navigate(
          `/admin/facility/${facilityType}/${facilityId}?${searchParams.toString()}`,
          { replace: true }
        );

        setIsEditMode(false);

        const updatedData = await FacilityManager.fetchFacilityDetail<FacilityData>(facilityType, facilityId);
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
    if (!isEditMode && facilityData && facilityData.facility) {
      const thumbnail = getThumbnail(facilityData);
      const thumbnailId = thumbnail?.id;

      setFormData({
        facility: {
          name: facilityData.facility.name || "",
          description: 'description' in facilityData.facility ? facilityData.facility.description : "",
          code: facilityData.facility.code || "",
          thumbnailFileId: thumbnailId,
          locationMeta: 'locationMeta' in facilityData.facility ? facilityData.facility.locationMeta : ""
        },
        ...Object.keys(facilityData)
          .filter(key => key !== 'facility')
          .reduce((obj, key) => {
            obj[key] = facilityData[key as keyof FacilityData];
            return obj;
          }, {} as Record<string, unknown>)
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