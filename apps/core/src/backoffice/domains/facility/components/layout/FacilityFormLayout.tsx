import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Input, Separator, Textarea } from "@plug/ui";
import { useFileUploadWithInfo, Floor, FacilityDrawingUpdateRequest, FacilityHistoryResponse } from "@plug/common-services";
import { FacilityForm, FacilityFormItem } from "../form/FacilityFormComponent";
import { PathInputModal } from "../modal/PathInputModal";
import { DrawingUpdateModal } from "../modal/DrawingUpdateModal";
import { FacilityRegistry } from "../../services/registry/FacilityRegistry";
import {
  FacilityData,
  getThumbnail,
  getFacilityId,
  getCreatedAt,
  getCreatedBy,
  getUpdatedAt,
  getUpdatedBy,
  getDrawingInfo,
  isBuildingFacility,
  isStationFacility,
} from "@/backoffice/domains/facility/types/facilityTypeGuard";

export type FacilityFormMode = 'create' | 'detail' | 'edit';

interface FacilityFormLayoutProps {
  mode: FacilityFormMode;
  facilityData?: FacilityData;
  formData?: FacilityData;
  isLoading?: boolean;
  error?: Error | null;
  onInputChange?: (field: string, value: string | number | boolean) => void;
  onThumbnailUpload?: (file: File) => Promise<void>;
  onDrawingUpload?: (file: File) => Promise<void>;
  onUpdateDrawing?: (data: FacilityDrawingUpdateRequest, floors: Floor[]) => Promise<void>;
  onSave?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onBack?: () => void;
  onEditToggle?: () => void;
  thumbnailUploader?: ReturnType<typeof useFileUploadWithInfo>;
  drawingUploader?: ReturnType<typeof useFileUploadWithInfo>;
  history?: FacilityHistoryResponse[] | null;
  children?: React.ReactNode;
}

export const FacilityFormLayout: React.FC<FacilityFormLayoutProps> = ({
                                                                        mode,
                                                                        facilityData,
                                                                        formData,
                                                                        isLoading,
                                                                        error,
                                                                        onInputChange,
                                                                        onThumbnailUpload,
                                                                        onDrawingUpload,
                                                                        onUpdateDrawing,
                                                                        onSave,
                                                                        onDelete,
                                                                        onBack,
                                                                        onEditToggle,
                                                                        thumbnailUploader,
                                                                        drawingUploader,
                                                                        history,
                                                                        children
                                                                      }) => {
  const methods = useForm();
  const [isPathModalOpen, setIsPathModalOpen] = useState<boolean>(false);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState<boolean>(false);
  const [isSubmittingDrawing, setIsSubmittingDrawing] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [formError] = useState<string | null>(null);
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';
  const defaultThumbnailUploader = useFileUploadWithInfo();
  const defaultDrawingUploader = useFileUploadWithInfo();
  const actualThumbnailUploader = thumbnailUploader || defaultThumbnailUploader;
  const actualDrawingUploader = drawingUploader || defaultDrawingUploader;
  const thumbnail = facilityData ? getThumbnail(facilityData) : undefined;
  const drawingInfo = facilityData ? getDrawingInfo(facilityData) : undefined;
  const facilityId = facilityData ? getFacilityId(facilityData) : undefined;
  const facilityType =
    isBuildingFacility(facilityData) ? "buildings" :
      isStationFacility(facilityData) ? "stations" : undefined;

  const facilityDefinition = facilityType ? FacilityRegistry.get(facilityType) : undefined;
  const showFloorInfo = facilityDefinition?.showFloorInfo || false;
  const showLineInfo = facilityDefinition?.type === 'stations';

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onThumbnailUpload) {
      await onThumbnailUpload(files[0]);
    }
  };

  const handleDrawingFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onDrawingUpload) {
      await onDrawingUpload(files[0]);
    }
  };

  const handleDrawingUpdate = async (data: FacilityDrawingUpdateRequest, floors: Floor[]) => {
    if (onUpdateDrawing) {
      setIsSubmittingDrawing(true);
      try {
        await onUpdateDrawing(data, floors);
        setIsDrawingModalOpen(false);
      } catch (error) {
        console.error("도면 업데이트 실패:", error);
      } finally {
        setIsSubmittingDrawing(false);
      }
    }
  };

  const handlePathUpdate = (path: string) => {
    if (onInputChange) {
      onInputChange("facility.path", path);
    }
    setIsPathModalOpen(false);
  };

  const toggleHistoryView = () => {
    setShowHistory(!showHistory);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-2 py-5">
        <FacilityForm {...methods}>
          <div className="grid grid-cols-3 col-span-2 border-t divide-y divide-gray-200 border-b-0">
            <FacilityFormItem label="썸네일 이미지" className="row-span-4">
              <div className="flex flex-col gap-2 w-full">
                {isEditMode || isCreateMode ? (
                  <div className="flex flex-col">
                    {isEditMode &&
                      thumbnail?.url &&
                      !actualThumbnailUploader.fileInfo && (
                        <div className="mt-2 flex flex-col gap-2">
                          <img
                            src={thumbnail.url}
                            alt="현재 썸네일"
                            className="h-32 object-contain"
                          />
                          <div className="flex flex-col items-center justify-between gap-2 border-y border-gray-100 py-2 rounded-sm">
                            <div className="font-medium text-gray-800 text-xs break-normal">
                              {thumbnail.originalFileName}
                            </div>
                            <Button
                              className="w-16"
                              onClick={() =>
                                document
                                  ?.getElementById("thumbnail-input")
                                  ?.click()
                              }
                            >
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
                        </div>
                      )}
                    {isCreateMode && !actualThumbnailUploader.fileInfo && (
                      <div className="flex flex-col gap-5 items-center justify-center">
                        <div className="flex items-center justify-center bg-gray-100 h-32 w-32 text-sm text-gray-500">
                          이미지가 없습니다.
                        </div>
                        <div className="flex items-center justify-between gap-2 border-y border-gray-100 py-2 rounded-sm w-full">
                          <div className="text-gray-500">
                            썸네일 파일을 선택하세요
                          </div>
                          <Button
                            className="w-16"
                            onClick={() =>
                              document
                                ?.getElementById("thumbnail-input")
                                ?.click()
                            }
                          >
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
                      </div>
                    )}
                    {actualThumbnailUploader.fileInfo &&
                      actualThumbnailUploader.fileInfo.url && (
                        <div className="flex flex-col gap-2">
                          <img
                            src={actualThumbnailUploader.fileInfo.url}
                            alt="썸네일 미리보기"
                            className="h-32 object-contain"
                          />
                          <div className="flex items-center justify-between gap-2 border-y border-gray-100 py-2 rounded-sm">
                            <div className="text-gray-500">선택된 썸네일</div>
                            <div className="font-medium text-gray-800 text-xs break-normal">
                              {
                                actualThumbnailUploader.fileInfo
                                  .originalFileName
                              }
                            </div>
                            <Button
                              className="w-16"
                              onClick={() =>
                                document
                                  ?.getElementById("thumbnail-input")
                                  ?.click()
                              }
                            >
                              파일 변경
                            </Button>
                            <Input
                              type="file"
                              id="thumbnail-input"
                              className="hidden"
                              accept="image/*"
                              onChange={handleThumbnailChange}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                ) : thumbnail?.url ? (
                  <>
                    <img
                      src={thumbnail.url}
                      alt="썸네일 이미지"
                      className="h-32 object-contain"
                    />
                    <div className="flex gap-2 border-y border-gray-100 px-3 py-2 rounded-sm">
                      <div className="text-gray-500">파일명</div>
                      <div className="font-medium text-gray-800 text-xs break-normal">
                        {thumbnail.originalFileName}
                      </div>
                    </div>
                  </>
                ) : (
                  "썸네일 이미지가 없습니다."
                )}
              </div>
            </FacilityFormItem>

            {!isCreateMode && (
              <FacilityFormItem label="ID">
                <div>{facilityId}</div>
              </FacilityFormItem>
            )}

            <FacilityFormItem label="코드">
              {isEditMode || isCreateMode ? (
                <Input
                  type="text"
                  value={formData?.facility?.code || ""}
                  onChange={(e) =>
                    onInputChange &&
                    onInputChange("facility.code", e.target.value)
                  }
                  placeholder="코드를 입력하세요"
                  required
                />
              ) : (
                <div>{facilityData?.facility?.code}</div>
              )}
            </FacilityFormItem>

            <FacilityFormItem label="건물명" className="col-span-2">
              {isEditMode || isCreateMode ? (
                <Input
                  type="text"
                  value={formData?.facility?.name || ""}
                  onChange={(e) =>
                    onInputChange &&
                    onInputChange("facility.name", e.target.value)
                  }
                  placeholder="건물명을 입력하세요"
                  required
                />
              ) : (
                <div className="py-2">{facilityData?.facility?.name}</div>
              )}
            </FacilityFormItem>

            <FacilityFormItem label="설명" className="col-span-2">
              {isEditMode || isCreateMode ? (
                <Textarea
                  className="w-full"
                  value={formData?.facility?.description || ""}
                  onChange={(e) =>
                    onInputChange &&
                    onInputChange("facility.description", e.target.value)
                  }
                  placeholder="설명을 입력하세요"
                />
              ) : (
                <div>{facilityData?.facility?.description || "-"}</div>
              )}
            </FacilityFormItem>

            {!isCreateMode && facilityData && "facility" in facilityData && (
              <>
                <FacilityFormItem label="생성">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-gray-500 mr-7 text-sm">
                        최초 생성일
                      </span>
                      <span className="font-medium text-gray-800">
                        {getCreatedAt(facilityData)
                          ? new Date(
                            getCreatedAt(facilityData) as string,
                          ).toLocaleDateString("ko-KR")
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 mr-4 text-sm">생성인</span>
                      <span className="font-medium text-gray-800">
                        {getCreatedBy(facilityData) || "-"}
                      </span>
                    </div>
                  </div>
                </FacilityFormItem>

                <FacilityFormItem label="수정" className="border-b">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-gray-500 mr-4 text-sm">
                        마지막 수정일
                      </span>
                      <span className="font-medium text-gray-800">
                        {getUpdatedAt(facilityData)
                          ? new Date(
                            getUpdatedAt(facilityData) as string,
                          ).toLocaleDateString("ko-KR")
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 mr-4 text-sm">수정인</span>
                      <span className="font-medium text-gray-800">
                        {getUpdatedBy(facilityData) || "-"}
                      </span>
                    </div>
                  </div>
                </FacilityFormItem>
              </>
            )}

            <FacilityFormItem label="도면" className="border-b col-span-3">
              {isCreateMode ? (
                <div className="flex items-center justify-between gap-2 border-y border-gray-100 py-2 rounded-sm">
                  <div className="text-gray-500">
                    {actualDrawingUploader.fileInfo
                      ? `선택된 도면: ${actualDrawingUploader.fileInfo.originalFileName}`
                      : "도면 파일을 선택하세요"}
                  </div>
                  <Button
                    className="w-24"
                    onClick={() => document?.getElementById("drawing-input")?.click()}
                  >
                    파일 선택
                  </Button>
                  <Input
                    type="file"
                    id="drawing-input"
                    className="hidden"
                    accept=".ifc,.ifczip,.pdf"
                    onChange={handleDrawingFileChange}
                  />
                </div>
              ) : isEditMode ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    {drawingInfo ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">현재 도면:</span>
                        <span className="font-medium text-gray-800">{drawingInfo.originalFileName}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">도면 없음</span>
                    )}
                  </div>
                  <Button
                    className="w-24"
                    onClick={() => document?.getElementById("drawing-input")?.click()}
                  >
                    파일 변경
                  </Button>
                  <Input
                    type="file"
                    id="drawing-input"
                    className="hidden"
                    accept=".ifc,.ifczip,.pdf"
                    onChange={handleDrawingFileChange}
                  />
                </div>
              ) : (
                <div className="flex flex-col w-full gap-2">
                  <div className="flex justify-between items-center">
                    {drawingInfo ? (
                      <div className="flex flex-1 items-center gap-2">
                        <span className="text-gray-500">도면 파일:</span>
                        <span className="font-medium text-gray-800">
                          {drawingInfo.originalFileName}
                        </span>
                        <Button
                          className="ml-2"
                          variant="outline"
                          onClick={() => window.open(drawingInfo.url, "_blank")}
                        >
                          다운로드
                        </Button>
                        <Button
                          className="ml-2"
                          variant="default"
                          onClick={() => setIsDrawingModalOpen(true)}
                        >
                          도면 업데이트
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-gray-500">도면 없음</span>
                        <Button
                          className="ml-2"
                          variant="default"
                          onClick={() => setIsDrawingModalOpen(true)}
                        >
                          도면 추가
                        </Button>
                      </div>
                    )}

                    {history && history.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleHistoryView}
                        className="ml-auto"
                      >
                        {showHistory ? "변경 이력 숨기기" : "변경 이력 보기"}
                      </Button>
                    )}
                  </div>

                  {/* 도면 변경 이력 섹션 */}
                  {showHistory && history && history.length > 0 && (
                    <div className="mt-4 border border-gray-200 rounded-md">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium">
                        도면 변경 이력
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {history.map((item, index) => (
                          <div
                            key={item.id}
                            className={`px-4 py-3 ${index < history.length - 1 ? 'border-b border-gray-100' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.file.originalFileName}</div>
                                <div className="text-gray-600 text-sm mt-1">{item.comment}</div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="text-xs text-gray-500">
                                  {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{item.createdBy}</div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => window.open(item.file.url, "_blank")}
                                >
                                  다운로드
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </FacilityFormItem>

            {showFloorInfo && !isCreateMode && facilityData?.floors && facilityData.floors.length > 0 && (
              <FacilityFormItem label="층 정보" className="col-span-3 border-b">
                <div className="flex flex-wrap gap-2">
                  {facilityData.floors.map((floor, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700 min-w-[120px]"
                    >
                      <div>
                        <span className="text-gray-500 mr-1">층</span>
                        <span className="font-medium text-gray-800">
                          {floor.name}
                        </span>
                      </div>
                      {floor.floorId && (
                        <div className="mt-1">
                          <span className="text-gray-500 mr-1">ID</span>
                          <span className="font-medium text-gray-800">
                            {floor.floorId}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </FacilityFormItem>
            )}

            {showLineInfo && !isCreateMode && isStationFacility(facilityData) && facilityData.stationInfo && (
              <FacilityFormItem label="노선 정보" className="col-span-3 border-b">
                <div className="flex flex-col gap-2">
                  {facilityData.stationInfo.lineIds && facilityData.stationInfo.lineIds.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {facilityData.stationInfo.lineIds.map((lineId: number, index: number) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700"
                        >
                          <span className="text-gray-500 mr-1">노선 ID</span>
                          <span className="font-medium text-gray-800">
                            {lineId}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">노선 정보 없음</div>
                  )}

                  {facilityData.stationInfo.stationCodes && facilityData.stationInfo.stationCodes.length > 0 && (
                    <div className="mt-2">
                      <span className="text-gray-500 mr-1">역 코드:</span>
                      <span className="font-medium text-gray-800">
                        {facilityData.stationInfo.stationCodes.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </FacilityFormItem>
            )}

            <FacilityFormItem label="위치정보" className="col-span-3 border-b">
              {isCreateMode ? (
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => setIsPathModalOpen(true)}
                    className="whitespace-nowrap hover:bg-blue-700 text-white px-4 py-2 "
                  >
                    경로 선택
                  </Button>
                </div>
              ) : (
                <div className="py-2 flex gap-4 items-center">
                  {facilityData?.facility?.lat && facilityData?.facility?.lon && (
                    <>
                      <div className="flex gap-1">
                        <span className="text-gray-500 text-sm">위도</span>
                        <span className="font-medium">
                          {facilityData.facility.lat}
                        </span>
                      </div>
                      <Separator
                        orientation="vertical"
                        className="h-6 bg-gray-300"
                      />
                      <div className="flex gap-1">
                        <span className="text-gray-500 text-sm">경도</span>
                        <span className="font-medium">
                          {facilityData.facility.lon}
                        </span>
                      </div>
                    </>
                  )}
                  {facilityData?.facility?.locationMeta && (
                    <div className="flex gap-1">
                      <span className="text-gray-500 text-sm">위치정보</span>
                      <span className="font-medium">
                        {facilityData.facility.locationMeta}
                      </span>
                    </div>
                  )}
                  <Button
                    type="button"
                    onClick={() => setIsPathModalOpen(true)}
                    className="whitespace-nowrap hover:bg-blue-700 text-white px-4 py-2 "
                  >
                    {facilityData?.facility?.lat ? "경로 수정" : "경로 추가"}
                  </Button>
                </div>
              )}
            </FacilityFormItem>
          </div>
          {children}
          {formError && (
            <div className="text-red-500 mt-4 text-center">{formError}</div>
          )}
        </FacilityForm>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 mb-6">
        {isEditMode ? (
          <>
            <Button variant="outline" onClick={onEditToggle}>
              취소
            </Button>
            <Button variant="default" onClick={onSave}>
              저장
            </Button>
          </>
        ) : isCreateMode ? (
          <>
            <Button variant="outline" onClick={onBack}>
              취소
            </Button>
            <Button variant="default" onClick={onSave}>
              저장
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onDelete}>
              삭제
            </Button>
            <Button variant="outline" onClick={onBack}>
              돌아가기
            </Button>
            <Button variant="default" onClick={onEditToggle}>
              수정
            </Button>
          </>
        )}
      </div>

      <PathInputModal
        isOpen={isPathModalOpen}
        onClose={() => setIsPathModalOpen(false)}
        onSubmit={handlePathUpdate}
      />
      <DrawingUpdateModal
        isOpen={isDrawingModalOpen}
        onClose={() => setIsDrawingModalOpen(false)}
        onUpdate={handleDrawingUpdate}
        isSubmitting={isSubmittingDrawing}
      />
    </FormProvider>
  );
};