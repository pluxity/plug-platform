import React, { useState } from "react";
import { Card, CardContent } from "@plug/ui";
import { Button } from "@plug/ui";
import { Input } from "@plug/ui";
import { useCreateBuilding, useFileUploadWithInfo } from "@plug/common-services";
import { ModalForm, ModalFormItem } from "@plug/ui";
import type { BuildingCreateRequest } from "@plug/common-services";
import * as Px from "@plug/engine/src"
import { ModelInfo } from "@plug/engine/dist/src/interfaces";

interface BuildingFormProps {
  onSaveSuccess?: () => void;
}

export const BuildingForm: React.FC<BuildingFormProps> = ({ onSaveSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const thumbnailUploader = useFileUploadWithInfo();
  const drawingUploader = useFileUploadWithInfo();

  const [buildingData, setBuildingData] = useState<BuildingCreateRequest>({
    facility: {
      name: "",
      code: "",
      description: "",
    },
    floors: []
  });

  const { execute } = useCreateBuilding();

  const handleInputChange = (field: string, value: string) => {
    setBuildingData(prev => ({
      ...prev,
      facility: {
        ...prev.facility,
        [field]: value
      }
    }));
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        await thumbnailUploader.execute(files[0]);
      } catch (err) {
        console.error("썸네일 업로드 오류:", err);
        setError("썸네일 업로드 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDrawingChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        await drawingUploader.execute(files[0]);
        console.log("파일 업로드 정보:", drawingUploader.fileInfo);
        const fileUrl = URL.createObjectURL(files[0]);
        console.log("파일 URL:", fileUrl);
        if (fileUrl) {
          console.log("도면 파일 URL:", fileUrl);
          Px.Model.GetModelHierarchyFromUrl(fileUrl, (modelInfos: ModelInfo) => {
            console.log("모델 계층 구조:", modelInfos);
            if (Array.isArray(modelInfos) && modelInfos.length > 0) {
              const floors = modelInfos.map(info => ({
                name: info.displayName,
                floorId: info.floorId
              }));
              console.log("변환된 층 정보:", floors);
              setBuildingData(prev => ({
                ...prev,
                floors: floors
              }));
            } else {
              console.error("모델 정보가 없거나 유효하지 않습니다.");
            }
          });
        } else {
          console.error("업로드된 파일의 URL을 가져올 수 없습니다.");
        }
      } catch (err) {
        console.error("도면 업로드 오류:", err);
        setError("도면 업로드 중 오류가 발생했습니다.");
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const requestData: BuildingCreateRequest = {
        ...buildingData,
        facility: {
          ...buildingData.facility,
        }
      };

      if (thumbnailUploader.fileInfo?.id) {
        requestData.facility.thumbnailFileId = thumbnailUploader.fileInfo.id;
      }

      if (drawingUploader.fileInfo?.id) {
        requestData.facility.drawingFileId = drawingUploader.fileInfo.id;
      }

      await execute(requestData);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error("건물 생성 오류:", err);
      setError("건물을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-6">건물 정보 입력</h1>
      <Card>
        <CardContent>
          <ModalForm className="grid grid-cols-2 py-5">
            <ModalFormItem label="건물명">
              <Input
                type="text"
                value={buildingData.facility.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="건물명을 입력하세요"
                required
              />
            </ModalFormItem>

            <ModalFormItem label="건물 코드">
              <Input
                type="text"
                value={buildingData.facility.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="건물 코드를 입력하세요"
                required
              />
            </ModalFormItem>

            <ModalFormItem label="설명">
              <Input
                type="text"
                value={buildingData.facility.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="건물에 대한 설명을 입력하세요"
              />
            </ModalFormItem>

            <ModalFormItem label="썸네일">
              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="mb-2"
                />
                {thumbnailUploader.isLoadingFileInfo && (
                  <p>썸네일 업로드 중...</p>
                )}
                {thumbnailUploader.fileInfo && (
                  <div className="mt-2">
                    <div className="w-32 h-32 relative border border-gray-200 rounded-md overflow-hidden">
                      <img
                        src={thumbnailUploader.fileInfo.url}
                        alt="썸네일 미리보기"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </ModalFormItem>

            <ModalFormItem label="도면">
              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={handleDrawingChange}
                  className="mb-2"
                />
                {drawingUploader.isLoadingFileInfo && <p>도면 업로드 중...</p>}
                {drawingUploader.fileInfo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      업로드된 파일: {drawingUploader.fileInfo.originalFileName}
                    </p>
                  </div>
                )}
              </div>
            </ModalFormItem>

            <ModalFormItem label="층 정보" className="border-b">
              <div className="flex flex-wrap gap-2">
                {buildingData.floors && buildingData.floors.length > 0 ? (
                  buildingData.floors.map((floor, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700 min-w-[120px]"
                    >
                      <div>
                        <span className="text-gray-500 mr-1">ID</span>
                        <span className="font-medium text-gray-800">
              {floor.floorId}
            </span>
                      </div>
                      <div className="mt-1">
                        <span className="text-gray-500 mr-1">이름</span>
                        <span className="font-medium text-gray-800">
              {floor.name}
            </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    등록된 층 정보가 없습니다. 도면 파일을 업로드하면 자동으로 층 정보가 추출됩니다.
                  </div>
                )}
              </div>
            </ModalFormItem>
          </ModalForm>

          {error && (
            <div className="text-red-500 mt-4 text-center">{error}</div>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-end mt-6 gap-2">
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            thumbnailUploader.isLoadingFileInfo ||
            drawingUploader.isLoadingFileInfo
          }
        >
          {isSubmitting ? "처리 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
};