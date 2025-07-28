import React from "react";
import { Button, Textarea } from "@plug/ui";
import { Input } from "@plug/ui";
import { FacilityRequest, Floor, useFileUploadWithInfo } from "@plug/common-services";
import { ModalForm, ModalFormItem } from "@plug/ui";
import * as Px from "@plug/engine/dist/src"
import { ModelInfo } from "@plug/engine/dist/src/interfaces";
import { isBuildingFacility } from "@/backoffice/domains/facility/types/facilityTypeGuard";


interface FacilityInfoSectionProps {
  title: string;
  facilityData: FacilityRequest;
  onChange: (field: string, value: string) => void;
  onFloorsChange?: (floors: Floor[]) => void;
  onThumbnailUpload: (file: File) => void;
  onDrawingUpload: (file: File) => void;
  thumbnailUploader: ReturnType<typeof useFileUploadWithInfo>;
  drawingUploader: ReturnType<typeof useFileUploadWithInfo>;
  showFloorInfo?: boolean;
  children?: React.ReactNode;
}

export const FacilityInfoSection: React.FC<FacilityInfoSectionProps> = ({ facilityData, onChange, onFloorsChange, onThumbnailUpload, onDrawingUpload, thumbnailUploader, drawingUploader, showFloorInfo = false, children }) => {

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) onThumbnailUpload(files[0]);
  };

  const handleDrawingChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onDrawingUpload(files[0]);

      console.log("디버깅 - showFloorInfo:", showFloorInfo);
      console.log("디버깅 - onFloorsChange 존재:", !!onFloorsChange);
      console.log("디버깅 - isBuildingFacility:", isBuildingFacility(facilityData));

      if (onFloorsChange && showFloorInfo && isBuildingFacility(facilityData)) {
        const fileUrl = URL.createObjectURL(files[0]);
        console.log("디버깅 - fileUrl 생성됨:", !!fileUrl);

        if (fileUrl) {
          try {
            console.log("디버깅 - GetModelHierarchyFromUrl 호출 전");
            Px.Model.GetModelHierarchyFromUrl(fileUrl, (modelInfos: ModelInfo) => {
              console.log("디버깅 - 콜백 호출됨, modelInfos:", modelInfos);
              if (Array.isArray(modelInfos) && modelInfos.length > 0) {
                const floors = modelInfos.map(info => ({
                  name: info.displayName,
                  floorId: info.floorId
                }));
                console.log("디버깅 - 추출된 floors:", floors);
                onFloorsChange(floors);
              } else {
                console.log("디버깅 - modelInfos가 배열이 아니거나 비어있음");
              }
            });
          } catch (err) {
            console.error("도면 층 정보 추출 오류:", err);
          }
        }
      } else {
        console.log("디버깅 - 조건 불충족: onFloorsChange, showFloorInfo, isBuildingFacility 중 하나가 false");
      }
    }
  };

  return (
    <>
      <ModalForm className="grid grid-cols-2 border-t divide-y divide-gray-200 border-x">
        <div className="col-span-2 p-4 bg-gray-50 flex items-center gap-2 border-b">
          <div className="w-1 h-6 bg-blue-600"></div>
          <h3 className="text-lg font-medium">시설 정보 입력</h3>
        </div>
        <ModalFormItem label="시설명">
          <Input
            type="text"
            value={facilityData.facility.name}
            onChange={(e) => onChange("facility.name", e.target.value)}
            placeholder="시설명을 입력하세요"
            required
          />
        </ModalFormItem>

        <ModalFormItem label="코드">
          <Input
            type="text"
            value={facilityData.facility.code}
            onChange={(e) => onChange("facility.code", e.target.value)}
            placeholder="코드를 입력하세요"
            required
          />
        </ModalFormItem>

        <ModalFormItem label="설명" className="col-span-2">
          <Textarea
            id="facility-description"
            className="w-full h-32"
            value={facilityData.facility.description || ""}
            onChange={(e) => onChange("facility.description", e.target.value)}
            placeholder="시설에 대한 설명을 입력하세요"
          />
        </ModalFormItem>

        <ModalFormItem label="썸네일">
          <div className="flex w-full items-center justify-between gap-2">
            {thumbnailUploader.isLoadingFileInfo && <p>썸네일 업로드 중...</p>}
            {thumbnailUploader.fileInfo && (
              <div className="flex gap-2 items-center">
                <img src={thumbnailUploader.fileInfo.url} alt="썸네일 미리보기" className="h-32 object-cover" />
                <div className="text-sm text-gray-500">
                  <p>업로드된 파일: </p>
                  <p>{thumbnailUploader.fileInfo.originalFileName}</p>
                </div>
              </div>
            )}
            <Button className="w-16" type="button" onClick={() => document?.getElementById("thumbnail-input")?.click()}>
              파일 선택
            </Button>
            <Input
              type="file"
              id="thumbnail-input"
              className="hidden"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
          </div>
        </ModalFormItem>

        <ModalFormItem label="도면">
          <div className="flex justify-between w-full gap-2">
            {drawingUploader.isLoadingFileInfo && <p>도면 업로드 중...</p>}
            {drawingUploader.fileInfo && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  업로드된 파일: {drawingUploader.fileInfo.originalFileName}
                </p>
              </div>
            )}
            <Button
              className="w-16"
              type="button"
              onClick={() => document?.getElementById("drawing-input")?.click()}
            >
              파일 선택
            </Button>
            <Input
              type="file"
              id="drawing-input"
              className="hidden"
              accept="image/*"
              onChange={handleDrawingChange}
            />
          </div>
        </ModalFormItem>
        {children}
      </ModalForm>
    </>
  );
};