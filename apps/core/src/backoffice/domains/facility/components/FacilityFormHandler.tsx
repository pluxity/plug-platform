// apps/core/src/backoffice/domains/facility/components/FacilityFormHandler.tsx
import { useState, useEffect } from "react";
import { useFileUploadWithInfo } from "@plug/common-services";
import { FacilityData } from "../types/facilityData";
import { FacilityManager } from "../services/FacilityManager";
import { FacilityType } from "../store/FacilityListStore";

interface FacilityFormHandlerProps<T extends FacilityData> {
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
}

export function FacilityFormHandler<T extends FacilityData>({
                                                              facilityType,
                                                              initialData,
                                                              children,
                                                              onSaveSuccess,
                                                              mode = 'create'
                                                            }: FacilityFormHandlerProps<T>) {
  // 공통 상태 및 로직
  // ...

  return children({
    data: facilityData as T,
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