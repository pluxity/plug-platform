
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
  isStationFacility
} from "@/backoffice/domains/facility/types/facilityTypeGuard";

export type FacilityFormMode = 'create' | 'detail' | 'edit';

interface FacilityFormLayoutProps {
  mode: FacilityFormMode;
  facilityData?: FacilityData;
  formData?: FacilityData;
  isLoading?: boolean;
  error?: Error | null;
  onInputChange?: (field: string, value: string | number | boolean | string[] | number[]) => void;
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
  facilityType?: string;
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
                                                                        children,
                                                                        facilityType
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

  const detectedFacilityType = facilityType ||
    (isBuildingFacility(facilityData) ? "buildings" :
      isStationFacility(facilityData) ? "stations" : "buildings");

  const facilityDefinition = detectedFacilityType ? FacilityRegistry.get(detectedFacilityType) : undefined;

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

  const handleStationCodesChange = (codes: string[]) => {
    if (onInputChange) {
      onInputChange("stationInfo.stationCodes", codes);
    }
  };

  const handleLineIdsChange = (lineIds: number[]) => {
    if (onInputChange) {
      onInputChange("stationInfo.lineIds", lineIds);
    }
  };

  const renderFacilitySections = () => {
    console.log('renderFacilitySections 호출됨', { detectedFacilityType, facilityDefinition });

    if (!facilityDefinition || !facilityDefinition.sections) {
      console.log('facilityDefinition 없음 또는 sections 없음');
      return null;
    }

    const dataToUse = formData || facilityData;
    if (!dataToUse) {
      console.log('사용할 데이터 없음');
      return null;
    }

    const sectionHandlers = {
      onStationCodesChange: (isEditMode || isCreateMode) ? handleStationCodesChange : undefined,
      onLineIdsChange: (isEditMode || isCreateMode) ? handleLineIdsChange : undefined,
      onFloorsChange: undefined,
    };

    console.log('섹션 렌더링:', facilityDefinition.sections);

    return facilityDefinition.sections.map(section => {
      console.log('섹션 ID:', section.id);
      return (
        <div key={section.id} className="col-span-3">
          {section.render({
            data: dataToUse,
            onChange: (newData) => {
              console.log('섹션 데이터 변경됨:', newData);
            },
            handlers: sectionHandlers,
            disabled: !(isEditMode || isCreateMode),
            mode: mode
          })}
        </div>
      );
    });
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
            <FacilityFormItem label="썸네일 이미지" className="row-span-3">
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
                <FacilityFormItem label="생성" className="col-span-2">
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
                <div className="flex items-center justify-between gap-2 border-y border-gray-100 py-2 rounded-sm w-full">
                  <div className="text-gray-500">
                    {actualDrawingUploader.fileInfo
                      ? `선택된 도면: ${actualDrawingUploader.fileInfo.originalFileName}`
                      : "도면 파일을 선택하세요"}
                  </div>
                  <Button
                    className="w-24"
                    onClick={() =>
                      document?.getElementById("drawing-input")?.click()
                    }
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
                        <span className="font-medium text-gray-800">
                          {drawingInfo.originalFileName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">도면 없음</span>
                    )}
                  </div>
                  <Button
                    className="w-24"
                    onClick={() =>
                      document?.getElementById("drawing-input")?.click()
                    }
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

                  {showHistory && history && history.length > 0 && (
                    <div className="py-2 w-full">
                      {!history ? (
                        <p>데이터를 불러오는 중...</p>
                      ) : history.length === 0 ? (
                        <p>변경 이력이 없습니다.</p>
                      ) : (
                        <ul className="grid gap-2">
                          {history?.map((historyItem, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-700 min-w-[120px] w-full flex justify-around items-center gap-1"
                            >
                              <div className="flex-1">
                                <span className="text-gray-500 mr-3">설명</span>
                                <span className="font-medium text-gray-800">
                                  {historyItem.comment || "-"}
                                </span>
                              </div>
                              <div className="w-52">
                                <span className="text-gray-500 mr-3">날짜</span>
                                <span className="font-medium text-gray-800">
                                  {historyItem.createdAt
                                    ? new Date(
                                      historyItem.createdAt,
                                    ).toLocaleString("ko-KR")
                                    : "-"}
                                </span>
                              </div>
                              <div className="w-36">
                                <span className="text-gray-500 mr-3">
                                  수정자
                                </span>
                                <span className="font-medium text-gray-800">
                                  {historyItem.createdBy || "-"}
                                </span>
                              </div>
                              <div className="flex w-40">
                                <span className="text-gray-500 mr-3">
                                  파일명
                                </span>
                                <a href={historyItem.file.url}>
                                  <p className="font-bold text-gray-800">
                                    {historyItem.file.originalFileName}
                                  </p>
                                </a>
                              </div>
                              <div>
                                <a href={historyItem.file.url}>
                                  <p className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-150 border border-blue-100">
                                    다운로드
                                  </p>
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </FacilityFormItem>

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
                  {facilityData?.facility?.lat &&
                    facilityData?.facility?.lon && (
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

            {children}
            {renderFacilitySections()}
          </div>

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