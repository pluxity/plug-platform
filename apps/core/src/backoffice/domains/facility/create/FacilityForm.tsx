import React, { useState, useEffect } from "react";
import { Button } from "@plug/ui";
import { FacilityWithFloors, Floors, useFileUploadWithInfo } from "@plug/common-services";
import { FacilityType } from "../store/FacilityListStore";
import { FacilityInfoSection } from "./FacilityInfoSection";
import { FacilityManager } from "../services/FacilityManager";
import { FacilityRegistry } from "@/backoffice/domains/facility/create/FacilityRegistry";
import "./definitions/BuildingDefinition";
import "./definitions/StationDefinition";
import { FacilityData, hasFloors, isStationFacility } from "@/backoffice/domains/facility/types/facilityData";

interface FacilityFormProps {
  facilityType: FacilityType;
  onSaveSuccess?: () => void;
}

export const FacilityForm: React.FC<FacilityFormProps> = ({ facilityType, onSaveSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facilityData, setFacilityData] = useState<FacilityData | null>(null);

  const thumbnailUploader = useFileUploadWithInfo();
  const drawingUploader = useFileUploadWithInfo();

  const [thumbnailSelected, setThumbnailSelected] = useState(false);
  const [drawingSelected, setDrawingSelected] = useState(false);
  const [thumbnailFileId, setThumbnailFileId] = useState<number | null>(null);
  const [drawingFileId, setDrawingFileId] = useState<number | null>(null);

  const facilityDefinition = FacilityRegistry.get(facilityType);
  const CreateService = facilityDefinition ? FacilityManager.getCreateService(facilityType) : null;
  const createService = CreateService ? CreateService() : null;

  useEffect(() => {
    if (facilityDefinition) {
      setFacilityData(facilityDefinition.getInitialData());
    }
  }, [facilityType, facilityDefinition]);

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
        facility: { ...prev.facility, [field]: value }
      };
    });
  };

  const handleDataChange = (newData: FacilityData) => {
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

    if (!facilityData || !createService) {
      setError("필수 데이터나 서비스가 없습니다.");
      return;
    }

    if (thumbnailSelected || drawingSelected ||
      thumbnailUploader.isLoadingFileInfo || drawingUploader.isLoadingFileInfo) {
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
      const requestData = {
        ...facilityData,
        facility: { ...facilityData.facility, }
      };

      if (thumbnailFileId) {
        requestData.facility.thumbnailFileId = thumbnailFileId;
      } else if (thumbnailUploader.fileInfo?.id) {
        requestData.facility.thumbnailFileId = thumbnailUploader.fileInfo.id;
      }

      if (drawingFileId) {
        requestData.facility.drawingFileId = drawingFileId;
      } else if (drawingUploader.fileInfo?.id) {
        requestData.facility.drawingFileId = drawingUploader.fileInfo.id;
      }

      await createService.execute(requestData);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error(`${facilityType} 생성 오류:`, err);
      setError(`시설을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.`);
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

  if (!facilityDefinition) {
    return (
      <div className="p-6 bg-white rounded-md border border-gray-200">
        <h3 className="text-lg font-medium mb-4">지원하지 않는 시설 유형</h3>
        <p>선택한 시설 유형({facilityType})은 등록되지 않은 유형입니다.</p>
      </div>
    );
  }

  if (!createService) {
    return (
      <div className="p-6 bg-white rounded-md border border-gray-200">
        <h3 className="text-lg font-medium mb-4">지원하지 않는 기능</h3>
        <p>선택한 시설 유형({facilityType})은 생성 기능을 지원하지 않습니다.</p>
      </div>
    );
  }

  if (!facilityData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>데이터 로딩 중...</p>
      </div>
    );
  }

  const infoSectionProps = {
    title: `새 ${facilityDefinition.displayName} 등록`,
    facilityData: facilityData,
    onChange: handleInputChange,
    onThumbnailUpload: handleThumbnailUpload,
    onDrawingUpload: handleDrawingUpload,
    thumbnailUploader,
    drawingUploader,
    ...(hasFloors(facilityData) ? {
      onFloorsChange: (floors: Floors[]) => {
        handleDataChange({
          ...facilityData,
          floors
        } as FacilityWithFloors);
      }
    } : {})
  };

  return (
    <form onSubmit={handleSubmit}>
      <FacilityInfoSection {...infoSectionProps}>
        {facilityDefinition.sections.map((section) => (
          <React.Fragment key={section.id}>
            <div className="col-span-2 p-4 bg-gray-50 flex items-center gap-2 border-b">
              <div className="w-1 h-6 bg-blue-600"></div>
              <h3 className="text-lg font-medium">{section.title}</h3>
            </div>
            {section.render({
              data: facilityData,
              onChange: handleDataChange,
              handlers: {
                ...(hasFloors(facilityData) ? {
                  onFloorsChange: (floors: Floors[]) => {
                    handleDataChange({
                      ...facilityData,
                      floors
                    } as FacilityWithFloors);
                  }
                } : {}),

                ...(isStationFacility(facilityData) ? {
                  onStationCodesChange: (codes: string[]) => {
                    handleDataChange({
                      ...facilityData,
                      stationCodes: codes
                    });
                  },
                  onLineIdsChange: (lineIds: number[]) => {
                    handleDataChange({
                      ...facilityData,
                      lineIds
                    });
                  }
                } : {}),
              }
            })}
          </React.Fragment>
        ))}
      </FacilityInfoSection>

      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      <div className="flex items-center justify-end mt-6 gap-2">
        <Button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? "처리 중..." : (isSubmitDisabled && !isSubmitting ? "파일 업로드 완료 대기 중..." : "저장")}
        </Button>
      </div>
    </form>
  );
};