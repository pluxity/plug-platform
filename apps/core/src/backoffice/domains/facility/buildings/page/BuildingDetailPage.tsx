import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Separator } from "@plug/ui";
import { Button, Input } from "@plug/ui";
import { PageContainer } from "@/backoffice/common/view/layouts";
import {
  useBuildingDetailSWR,
  useBuildingHistory,
  useDeleteBuilding, useFileUploadWithInfo,
  useUpdateBuilding,
  useUpdateFacilitiesDrawing
} from "@plug/common-services";
import { ModalForm, ModalFormItem } from "@plug/ui";
import type { FacilityUpdateRequest, FacilityDrawingUpdateRequest } from "@plug/common-services";
import { DrawingUpdateModal } from "@/backoffice/domains/facility/components/DrawingUpdateModal";

export const BuildingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const buildingId = parseInt(id || "0");

  const { data: building, isLoading, error, mutate } = useBuildingDetailSWR(buildingId);
  const { data: buildingHistory } = useBuildingHistory(buildingId);
  const { execute: deleteBuilding } = useDeleteBuilding(buildingId);
  const { execute: updateBuilding } = useUpdateBuilding(buildingId);
  const { execute: updateDrawing } = useUpdateFacilitiesDrawing(buildingId);
  const thumbnailUploader = useFileUploadWithInfo();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [, setIsUploadingThumbnail] = useState(false);
  const [isDrawingUpdateModalOpen, setIsDrawingUpdateModalOpen] = useState(false);
  const [isDrawingSubmitting, setIsDrawingSubmitting] = useState(false);

  const [formData, setFormData] = useState<FacilityUpdateRequest>({
    facility: {
      name: "",
      description: "",
      code: "",
    },
    floors: []
  });

  const handleDrawingUpdateSubmit = async (data: FacilityDrawingUpdateRequest) => {
    setIsDrawingSubmitting(true);

    try {
      await updateDrawing(data);
      await mutate();
      setIsDrawingUpdateModalOpen(false);
    } catch (err) {
      console.error("도면 업데이트 오류:", err);
      alert("도면 업데이트 중 오류가 발생했습니다.");
      throw err;
    } finally {
      setIsDrawingSubmitting(false);
    }
  };

  const handleEditToggle = () => {
    if (!isEditMode && building) {
      setFormData({
        facility: {
          name: building.facility.name,
          description: building.facility.description || "",
          code: building.facility.code,
          thumbnailFileId: building.facility.thumbnail.id,
        },
        floors: building.floors ? [...building.floors] : []
      });
    }
    setIsEditMode(!isEditMode);
    setFormError(null);
  };

  type FacilityField = keyof FacilityUpdateRequest["facility"];

  const handleInputChange = (field: FacilityField, value: string) => {
    setFormData(prev => ({
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
      setIsUploadingThumbnail(true);
      try {
        await thumbnailUploader.execute(files[0]);
        if (thumbnailUploader.fileInfo && thumbnailUploader.fileInfo.id) {
          console.log("새 썸네일 ID:", thumbnailUploader.fileInfo.id);
          setFormData(prev => {
            const updated = {
              ...prev,
              facility: {
                ...prev.facility,
                thumbnailFileId: thumbnailUploader?.fileInfo?.id
              }
            };
            console.log("업데이트된 formData:", updated);
            return updated;
          });
        } else {
          console.error("썸네일 파일 ID를 받지 못했습니다");
        }
      } catch (err) {
        console.error("썸네일 업로드 오류:", err);
        setFormError("썸네일 업로드 중 오류가 발생했습니다.");
      } finally {
        setIsUploadingThumbnail(false);
      }
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setFormError(null);

    if (thumbnailUploader.fileInfo?.id) {
      formData.facility.thumbnailFileId = thumbnailUploader.fileInfo.id;
    }

    try {
      await updateBuilding(formData);
      await mutate();
      setIsEditMode(false);
    } catch (err) {
      console.error("빌딩 정보 업데이트 오류:", err);
      setFormError("빌딩 정보를 업데이트하는 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("해당 빌딩을 삭제하시겠습니까?")) {
      try {
        await deleteBuilding();
        navigate("/admin/facility");
      } catch (err) {
        console.error("빌딩 삭제 오류:", err);
        alert("빌딩을 삭제하는 중 오류가 발생했습니다.");
      }
    }
  };

  const handleBack = () => {
    if (isEditMode) {
      if (confirm("편집 중인 내용이 저장되지 않습니다. 계속하시겠습니까?")) {
        setIsEditMode(false);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <PageContainer title={`${building?.facility.name} 상세 정보`}>
      {isLoading ? (
        <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : building ? (
        <Card>
          <CardContent>
            <ModalForm className="grid grid-cols-2 py-5">
              <div className="grid grid-cols-3 col-span-2 border-t divide-y divide-gray-200 border-b-0">
                <ModalFormItem label="썸네일 이미지" className="row-span-4">
                  <div className="flex flex-col gap-2 w-full">
                    {isEditMode ? (
                      <div className="flex flex-col">
                        {building.facility.thumbnail.url && !thumbnailUploader.fileInfo && (
                          <div className="mt-2 flex flex-col gap-2">
                            <img src={building.facility.thumbnail.url} alt="현재 썸네일" className="h-32 object-contain" />
                            <div className="flex items-center justify-between gap-2 border-y border-gray-100 py-2 rounded-sm">
                              <div className="font-medium text-gray-800 text-xs break-normal">{building.facility.thumbnail.originalFileName}</div>
                              <Button className="w-16"
                                      onClick={() => document?.getElementById("thumbnail-input")?.click()}>파일 선택</Button>
                              <Input type="file" id="thumbnail-input" className="hidden" accept="image/*"
                                     onChange={handleThumbnailChange} />
                            </div>
                          </div>
                        )}
                        {thumbnailUploader.fileInfo && thumbnailUploader.fileInfo.url && (
                          <div className="flex flex-col gap-2">
                            <img src={thumbnailUploader.fileInfo.url} alt="새 썸네일 미리보기" className="h-32 object-contain" />
                            <div className="flex items-center justify-between gap-2 border-y border-gray-100 py-2 rounded-sm">
                              <div className="text-gray-500">새 썸네일</div>
                              <div className="font-medium text-gray-800 text-xs break-normal">{thumbnailUploader.fileInfo.originalFileName}</div>
                              <Button className="w-16"
                                      onClick={() => document?.getElementById("thumbnail-input")?.click()}>파일 선택</Button>
                              <Input type="file" id="thumbnail-input" className="hidden" accept="image/*"
                                     onChange={handleThumbnailChange} />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      building.facility.thumbnail.url ? (
                        <>
                          <img src={building.facility.thumbnail.url} alt="썸네일 이미지" className="h-32 object-contain" />
                          <div className="flex gap-2 border-y border-gray-100 px-3 py-2 rounded-sm">
                            <div className="text-gray-500">파일명</div>
                            <div className="font-medium text-gray-800 text-xs break-normal">{building.facility.thumbnail.originalFileName}</div>
                          </div>
                        </>
                      ) : (
                        "썸네일 이미지가 없습니다."
                      )
                    )}
                  </div>
                </ModalFormItem>

                <ModalFormItem label="ID">{building.facility.id}</ModalFormItem>

                <ModalFormItem label="코드">
                  {isEditMode ? (
                    <Input
                      type="text"
                      value={formData.facility.code}
                      onChange={(e) =>
                        handleInputChange("code", e.target.value)
                      }
                      placeholder="코드를 입력하세요"
                    />
                  ) : (
                    <div>{building.facility.code}</div>
                  )}
                </ModalFormItem>
                <ModalFormItem label="건물명">
                  {isEditMode ? (
                    <Input
                      type="text"
                      value={formData.facility.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="건물명을 입력하세요"
                      required
                    />
                  ) : (
                    <div className="py-2">{building.facility.name}</div>
                  )}
                </ModalFormItem>
                <ModalFormItem label="설명">
                  {isEditMode ? (
                    <Input
                      type="text"
                      value={formData.facility.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="설명을 입력하세요"
                    />
                  ) : (
                    <div>{building.facility.description || "-"}</div>
                  )}
                </ModalFormItem>


                <ModalFormItem label="생성" className='col-span-2'>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2">
                      <span className="text-gray-500 mr-6 text-sm">최초 생성일</span>
                      <span className="font-medium text-gray-800">
                      {building.facility.createdAt
                        ? new Date(
                          building.facility.createdAt,
                        ).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                    </div>
                    <div className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2">
                      <span className="text-gray-500 mr-4 text-sm">생성인</span>
                      <span className="font-medium text-gray-800">
                      {building.facility.createdBy || "-"}
                    </span>
                    </div>
                  </div>
                </ModalFormItem>

                <ModalFormItem label="수정" className="col-span-2 border-b">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2">
                      <span className="text-gray-500 mr-4 text-sm">마지막 수정일</span>
                      <span className="font-medium text-gray-800">
                      {building.facility.updatedAt
                        ? new Date(
                          building.facility.updatedAt,
                        ).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                    </div>
                    <div className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2">
                      <span className="text-gray-500 mr-4 text-sm">수정인</span>
                      <span className="font-medium text-gray-800">
                      {building.facility.updatedBy || "-"}
                    </span>
                    </div>
                  </div>
                </ModalFormItem>
              </div>

                <ModalFormItem label="도면 이미지" className='col-span-2'>
                  {building.facility.drawing.url ? (
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3 gap-5">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-sm">파일명</span>
                        <p className="font-medium text-gray-800">
                          {building.facility.drawing.originalFileName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={building.facility.drawing.url}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-150 border border-blue-100"
                        >
                          다운로드
                        </a>
                        <button
                          onClick={() => setIsDrawingUpdateModalOpen(true)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 border border-blue-100"
                        >
                          도면 업데이트
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 p-3">
                      도면 이미지가 없습니다.
                    </div>
                  )}
                </ModalFormItem>

              <ModalFormItem label="층 정보" className="col-span-2">
                {building.floors && building.floors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {building.floors.map((floor, index) => (
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
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    등록된 층 정보가 없습니다.
                  </div>
                )
                }
              </ModalFormItem>

              <ModalFormItem label="도면 변경 이력" className="col-span-2 border-b">
                <div className="py-2">
                  {!buildingHistory ? (
                    <p>데이터를 불러오는 중...</p>
                  ) : buildingHistory.length === 0 ? (
                    <p>변경 이력이 없습니다.</p>
                  ) : (
                    <ul className="grid gap-2">
                      {buildingHistory?.map((history, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700 min-w-[120px] flex gap-1"
                        >
                          <div className="flex justify-between items-center gap-2">

                            <div className="flex">
                              <span className="text-gray-500 mr-3">파일명</span>
                              <a href={history.file.url}>
                                <p className="font-bold text-gray-800">
                                  {history.file.originalFileName}
                                </p>
                              </a>
                            </div>
                            <Separator orientation='vertical' className="bg-gray-300 mx-1"/>
                            <div>
                              <span className="text-gray-500 mr-3">날짜</span>
                              <span className="font-medium text-gray-800">
                                {history.createdAt
                                  ? new Date(history.createdAt).toLocaleString(
                                    "ko-KR",
                                  )
                                  : "-"}
                              </span>
                            </div>
                            <Separator orientation='vertical' className="bg-gray-300 mx-1"/>
                            <div>
                              <span className="text-gray-500 mr-3">수정자</span>
                              <span className="font-medium text-gray-800">
                                {history.createdBy || "-"}
                              </span>
                            </div>
                            <Separator orientation='vertical' className="bg-gray-300 mx-1"/>
                            <div>
                              <span className="text-gray-500 mr-3">설명</span>
                              <span className="font-medium text-gray-800">
                                {history.comment || "-"}
                              </span>
                            </div>
                            <Separator orientation='vertical' className="bg-gray-300 mx-1"/>
                            <a href={building.facility.drawing.url}>
                              <p className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-150 border border-blue-100">다운로드</p>
                            </a>
                          </div>
                        </div>
                      ))}
                    </ul>
                  )}
                </div>
              </ModalFormItem>
            </ModalForm>

            {formError && (
              <div className="text-red-500 mt-4 text-center">{formError}</div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-8">빌딩 정보가 없습니다.</div>
      )}

      <div className="flex items-center justify-end gap-2 mt-4 mb-6">
        {isEditMode ? (
          <>
            <Button
              variant="outline"
              onClick={handleEditToggle}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={handleDelete}>
              삭제
            </Button>
            <Button variant="outline" onClick={handleBack}>
              돌아가기
            </Button>
            <Button variant="default" onClick={handleEditToggle}>
              수정
            </Button>
          </>
        )}
      </div>
      <DrawingUpdateModal
        isOpen={isDrawingUpdateModalOpen}
        onClose={() => setIsDrawingUpdateModalOpen(false)}
        onUpdate={handleDrawingUpdateSubmit}
        isSubmitting={isDrawingSubmitting}
      />
    </PageContainer>
  );
};