import React, { useState, useEffect } from "react";
import { Button } from "@plug/ui";
import { BuildingCreateRequest, Floors, StationCreateRequest, useCreateBuilding, useCreateStation, useFileUploadWithInfo } from "@plug/common-services";
import { FacilityType } from "../store/FacilityListStore";
import { FacilityInfoSection } from "./FacilityInfoSection";
import { StationInfoSection } from "./StationInfoSection";
import { FloorInfoSection } from "./FloorInfoSection";

interface FacilityFormProps {
  facilityType: FacilityType;
  onSaveSuccess?: () => void;
}

export const FacilityForm: React.FC<FacilityFormProps> = ({ facilityType, onSaveSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailSelected, setThumbnailSelected] = useState(false);
  const [drawingSelected, setDrawingSelected] = useState(false);
  const [thumbnailFileId, setThumbnailFileId] = useState<number | null>(null);
  const [drawingFileId, setDrawingFileId] = useState<number | null>(null);
  const [facilityData, setFacilityData] = useState<BuildingCreateRequest | StationCreateRequest>({
    facility: { name: "", code: "", description: "", },
    floors: [],
    ...(facilityType === 'stations' ? { lineIds: [], stationCodes: [] } : {})
  });

  const thumbnailUploader = useFileUploadWithInfo();
  const drawingUploader = useFileUploadWithInfo();
  const createBuilding = useCreateBuilding();
  const createStation = useCreateStation();

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
    setFacilityData(prev => ({
      ...prev,
      facility: { ...prev.facility, [field]: value }
    }));
  };

  const handleFloorsChange = (floors: Floors[]) => {
    setFacilityData(prev => ({ ...prev, floors }));
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

  const handleStationCodesChange = (codes: string[]) => {
    if (facilityType === 'stations') {
      setFacilityData(prev => ({
        ...prev,
        stationCodes: codes
      } as StationCreateRequest));
    }
  };

  const handleLineIdsChange = (lineIds: number[]) => {
    if (facilityType === 'stations') {
      setFacilityData(prev => ({ ...prev, lineIds } as StationCreateRequest));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (thumbnailSelected || drawingSelected || thumbnailUploader.isLoadingFileInfo || drawingUploader.isLoadingFileInfo) {
      setError("파일 업로드가 완료될 때까지 기다려주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const requestData: BuildingCreateRequest | StationCreateRequest = {
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

      if (facilityType === 'buildings') {
        await createBuilding.execute(requestData as BuildingCreateRequest);
      } else if (facilityType === 'stations') {
        await createStation.execute(requestData as StationCreateRequest);
      }

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error(`${facilityType === 'buildings' ? '건물' : '역사'} 생성 오류:`, err);
      setError(`${facilityType === 'buildings' ? '건물' : '역사'}을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formTitle = facilityType === 'buildings' ? '새 건물 등록' : '새 역사 등록';
  const isSubmitDisabled = isSubmitting || thumbnailUploader.isLoadingFileInfo || drawingUploader.isLoadingFileInfo || thumbnailSelected || drawingSelected;

  return (
    <form onSubmit={handleSubmit}>
      <FacilityInfoSection
        title={formTitle}
        facilityData={facilityData}
        onChange={handleInputChange}
        onFloorsChange={handleFloorsChange}
        onThumbnailUpload={handleThumbnailUpload}
        onDrawingUpload={handleDrawingUpload}
        thumbnailUploader={thumbnailUploader}
        drawingUploader={drawingUploader}
      >
        <FloorInfoSection floors={facilityData.floors} />
        {facilityType === 'stations' && (
          <StationInfoSection
            stationCodes={(facilityData as StationCreateRequest).stationCodes || []}
            lineIds={(facilityData as StationCreateRequest).lineIds || []}
            onStationCodesChange={handleStationCodesChange}
            onLineIdsChange={handleLineIdsChange}
          />
        )}
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