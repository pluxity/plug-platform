import { useState, useEffect } from "react";
import { useFileUploadWithInfo } from "@plug/common-services";
import { FacilityTypeGuard } from "../types/facilityTypeGuard";
import { FacilityManager } from "../services/FacilityManager";
import { FacilityType } from "../store/FacilityListStore";
import { FacilityRegistry } from "./registry/FacilityRegistry";

interface FacilityFormHandlerProps<T extends FacilityTypeGuard> {
  facilityType: FacilityType;
  initialData?: T;
  children: (props: {
    data: T;
    handlers: {
      handleDataChange: (newData: T) => void;
      handleInputChange: (field: string, value: string) => void;
      handleThumbnailUpload: (file: File) => Promise<void>;
      handleDrawingUpload: (file: File) => Promise<void>;
      handleSubmit: (e: React.FormEvent) => Promise<void>;
    };
    state: {
      isSubmitting: boolean;
      error: string | null;
      thumbnailUploader: ReturnType<typeof useFileUploadWithInfo>;
      drawingUploader: ReturnType<typeof useFileUploadWithInfo>;
      isSubmitDisabled: boolean;
    };
  }) => React.ReactNode;
  onSaveSuccess?: () => void;
  mode?: 'create' | 'update';
  facilityId?: number;
}

export function FacilityFormHandler<T extends FacilityTypeGuard>({ facilityType, initialData, children, onSaveSuccess, mode = 'create', facilityId }: FacilityFormHandlerProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facilityData, setFacilityData] = useState<T | null>(null);

  const thumbnailUploader = useFileUploadWithInfo();
  const drawingUploader = useFileUploadWithInfo();

  const [thumbnailSelected, setThumbnailSelected] = useState(false);
  const [drawingSelected, setDrawingSelected] = useState(false);
  const [thumbnailFileId, setThumbnailFileId] = useState<number | null>(null);
  const [drawingFileId, setDrawingFileId] = useState<number | null>(null);

  const facilityDefinition = FacilityRegistry.get<T>(facilityType);
  
  const serviceHook = mode === 'create'
    ? FacilityManager.getCreateService(facilityType)
    : FacilityManager.getUpdateService(facilityType);

  const service = serviceHook ? serviceHook(facilityId) : null;
  
  useEffect(() => {
    if (initialData) {
      setFacilityData(initialData);
      return;
    }

    if (facilityDefinition) {
      try {
        const initialData = facilityDefinition.getInitialData();
        setFacilityData(initialData as T);
      } catch (err) {
        console.error("Error getting initial data:", err);
        setError("초기 데이터를 가져오는데 실패했습니다.");
      }
    }
    
    if (mode === 'update' && facilityId) {
      const fetchData = async () => {
        const data = await FacilityManager.fetchFacilityDetail<T>(facilityType, facilityId);
        if (data) {
          setFacilityData(data);
        }
      };

      fetchData();
    }
  }, [facilityType, facilityDefinition, initialData, mode, facilityId]);
  
  useEffect(() => {
    if (thumbnailUploader.fileInfo?.id) {
      setThumbnailFileId(thumbnailUploader.fileInfo.id);
      setThumbnailSelected(false);
    }
  }, [thumbnailUploader.fileInfo?.id]);

  useEffect(() => {
    if (drawingUploader.fileInfo?.id) {
      setDrawingFileId(drawingUploader.fileInfo.id);
      setDrawingSelected(false);
    }
  }, [drawingUploader.fileInfo?.id]);
  
  const handleInputChange = (field: string, value: string) => {
    if (!facilityData) return;

    setFacilityData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        facility: { ...prev, [field]: value }
      } as T;
    });
  };
  
  const handleDataChange = (newData: T) => {
    setFacilityData(newData);
  };
  
  const handleThumbnailUpload = async (file: File) => {
    try {
      setThumbnailSelected(true);
      await thumbnailUploader.execute(file);
    } catch (err) {
      console.error("썸네일 업로드 오류:", err);
      setError("썸네일 업로드 중 오류가 발생했습니다.");
      setThumbnailSelected(false);
    }
  };
  
  const handleDrawingUpload = async (file: File) => {
    try {
      setDrawingSelected(true);
      await drawingUploader.execute(file);
    } catch (err) {
      console.error("도면 업로드 오류:", err);
      setError("도면 업로드 중 오류가 발생했습니다.");
      setDrawingSelected(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!facilityData || !service) {
      setError("필수 데이터나 서비스가 없습니다.");
      return;
    }

    if (thumbnailSelected || drawingSelected ||
      thumbnailUploader.isLoadingFileInfo ||
      drawingUploader.isLoadingFileInfo) {
      setError("파일 업로드가 완료될 때까지 기다려주세요.");
      return;
    }
    
    const validationError = FacilityManager.validateData(facilityType, facilityData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const requestData = { ...facilityData };

      if (thumbnailFileId || thumbnailUploader.fileInfo?.id) {
        if ("thumbnail" in requestData) {
          const fileId = thumbnailFileId || thumbnailUploader.fileInfo?.id;
          if (fileId !== undefined) {
            requestData.thumbnail.id = fileId;
          }
        }
      }

      if (drawingFileId || drawingUploader.fileInfo?.id) {
        if ("drawing" in requestData) {
          const fileId = drawingFileId || drawingUploader.fileInfo?.id;
          if (fileId !== undefined) {
            requestData.drawing.id = fileId;
          }
        }
      }

      await service.execute(requestData);

      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error(`${facilityType} ${mode === 'create' ? '생성' : '업데이트'} 오류:`, err);
      setError(`시설을 ${mode === 'create' ? '생성' : '업데이트'}하는 중 오류가 발생했습니다. 다시 시도해주세요.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = isSubmitting ||
    thumbnailUploader.isLoadingFileInfo ||
    drawingUploader.isLoadingFileInfo ||
    thumbnailSelected ||
    drawingSelected ||
    !facilityData;

  if (!facilityData) return null;
  
  return children({
    data: facilityData,
    handlers: {
      handleDataChange,
      handleInputChange,
      handleThumbnailUpload,
      handleDrawingUpload,
      handleSubmit
    },
    state: {
      isSubmitting,
      error,
      thumbnailUploader,
      drawingUploader,
      isSubmitDisabled
    }
  });
}