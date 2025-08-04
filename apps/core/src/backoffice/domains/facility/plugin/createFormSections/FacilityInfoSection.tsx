import React, { useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, Separator, Textarea } from "@plug/ui";
import { Button, Input } from "@plug/ui";
import { PageContainer } from "@/backoffice/common/view/layouts";
import {
  FacilityDrawingUpdateRequest,
  FacilityHistoryResponse,
  FacilityResponse,
  useFileUploadWithInfo
} from "@plug/common-services";
import { DrawingUpdateModal } from "@/backoffice/domains/facility/components/DrawingUpdateModal";
import { useForm } from "react-hook-form";
import { FacilityUpdateRequest } from "@/backoffice/domains/facility/types/facilityTypeGuard";
import * as console from "node:console";
import { PathInputModal } from "../../components/PathInputModal";
import { FacilityForm } from "../FacilityForm";

interface FacilityDetailLayoutProps {
  title: string;
  itemId: number;
  data: FacilityResponse | null;
  isLoading: boolean;
  error: Error | null;
  urlMode?: string | null;
  formData: FacilityUpdateRequest;
  setFormData: (data: FacilityUpdateRequest) => void;
  onDelete: () => Promise<void>;
  onUpdate: (data: FacilityUpdateRequest) => Promise<void>;
  onDrawingUpdate: (data: FacilityDrawingUpdateRequest) => Promise<void>;
  onMutate: () => Promise<void>;
  onHistoryMutate?: () => Promise<void>;
  history?: FacilityHistoryResponse[] | null;
  detailUrl: string;
  children?: ReactNode;
}

export const FacilityDetailLayout: React.FC<FacilityDetailLayoutProps> = ({
                                                                            title,
                                                                            itemId,
                                                                            data,
                                                                            isLoading,
                                                                            error,
                                                                            urlMode,
                                                                            formData,
                                                                            setFormData,
                                                                            onDelete,
                                                                            onUpdate,
                                                                            onDrawingUpdate,
                                                                            onMutate,
                                                                            onHistoryMutate,
                                                                            history,
                                                                            detailUrl,
                                                                            children
                                                                          }) => {
  const form = useForm()
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const thumbnailUploader = useFileUploadWithInfo();

  const [isEditMode, setIsEditMode] = useState(urlMode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isDrawingUpdateModalOpen, setIsDrawingUpdateModalOpen] = useState(false);
  const [isDrawingSubmitting, setIsDrawingSubmitting] = useState(false);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);

  const clearModeParam = () => {
    searchParams.delete("mode");
    navigate(
      `/admin/facility/${detailUrl}/${itemId}?${searchParams.toString()}`,
      { replace: true },
    );
  };

  const handleDrawingUpdateSubmit = async (data: FacilityDrawingUpdateRequest) => {
    setIsDrawingSubmitting(true);

    try {
      await onDrawingUpdate(data);
      await onMutate();
      if (onHistoryMutate) await onHistoryMutate();
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
    if (!isEditMode && data) {
      setFormData({
        facility: {
          name: data.facility.name,
          description: data.facility.description || "",
          code: data.facility.code,
          thumbnailFileId: data.facility.thumbnail.id,
          path: data.facility.path || ""
        }
      });
      searchParams.set("mode", "edit");
      navigate('?mode=edit', { replace: true });
    } else {
      clearModeParam();
    }

    setIsEditMode(!isEditMode);
    setFormError(null);
  };

  type FacilityField = "name" | "code" | "description" | "path";

  const handleInputChange = (field: FacilityField, value: string) => {
    setFormData({
      ...formData,
      facility: {
        ...formData.facility,
        [field]: value
      }
    });
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploadingThumbnail(true);
      try {
        await thumbnailUploader.execute(files[0]);
        if (thumbnailUploader.fileInfo && thumbnailUploader.fileInfo.id) {
          setFormData({
            ...formData,
            facility: {
              ...formData.facility,
              thumbnailFileId: thumbnailUploader.fileInfo.id
            }
          });
        } else {
          console.log("썸네일 파일 ID를 받지 못했습니다");
        }
      } catch (err) {
        console.log("썸네일 업로드 오류:", err);
        setFormError("썸네일 업로드 중 오류가 발생했습니다.");
      } finally {
        setIsUploadingThumbnail(false);
      }
    }
  };

  const handlePathUpdate = (path: string) => {
    handleInputChange("path", path);
    setIsPathModalOpen(false);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setFormError(null);

    if (thumbnailUploader.fileInfo?.id) {
      formData.facility.thumbnailFileId = thumbnailUploader.fileInfo.id;
    }

    try {
      await onUpdate(formData);
      await onMutate();
      setIsEditMode(false);
      clearModeParam();
    } catch (err) {
      console.log(err)
      setFormError("시설 정보를 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFacility = async () => {
    try {
      await onDelete();
    } catch (err) {
      console.error("시설 삭제 오류:", err);
      alert("시설을 삭제하는 중 오류가 발생했습니다.");
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
    <PageContainer title={title}>
      {isLoading ? (<div className="flex justify-center p-8">데이터를 불러오는 중...</div>)
        : error ? (<div className="text-center text-red-500 p-8">데이터를 불러오는 중 오류가 발생했습니다.</div>)
          : data ? (
            <Card>
              <CardContent>
                <div className="grid grid-cols-2 py-5">
                  <FacilityForm {...form}>
                    <div className="grid grid-cols-3 col-span-2 border-t divide-y divide-gray-200 border-b-0">
                      <FacilityFormItem label="썸네일 이미지" className="row-span-5">
                        <div className="flex flex-col gap-2 w-full">
                          {isEditMode ? (
                            <div className="flex flex-col">
                              {data.facility.thumbnail.url && !thumbnailUploader.fileInfo && (
                                <div className="mt-2 flex flex-col gap-2">
                                  <img src={data.facility.thumbnail.url} alt="현재 썸네일" className="h-32 object-contain" />
                                  <div className="flex items-center justify-between gap-2 border-y border-gray-100 py-2 rounded-sm">
                                    <div className="font-medium text-gray-800 text-xs break-normal">{data.facility.thumbnail.originalFileName}</div>
                                    <Button className="w-16" onClick={() => document?.getElementById("thumbnail-input")?.click()}>파일 선택</Button>
                                    <Input type="file" id="thumbnail-input" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                                  </div>
                                </div>
                              )}
                              {thumbnailUploader.fileInfo &&
                                thumbnailUploader.fileInfo.url && (
                                  <div className="flex flex-col gap-2">
                                    <img src={thumbnailUploader.fileInfo.url} alt="새 썸네일 미리보기" className="h-32 object-contain" />
                                    <div className="flex items-center justify-between gap-2 border-y border-gray-100 py-2 rounded-sm">
                                      <div className="text-gray-500">새 썸네일</div>
                                      <div className="font-medium text-gray-800 text-xs break-normal">{thumbnailUploader.fileInfo.originalFileName}</div>
                                      <Button className="w-16" onClick={() => document?.getElementById("thumbnail-input")?.click()}>파일 선택</Button>
                                      <Input type="file" id="thumbnail-input" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                                    </div>
                                  </div>
                                )}
                            </div>
                          ) : data.facility.thumbnail.url ? (
                            <>
                              <img src={data.facility.thumbnail.url} alt="썸네일 이미지" className="h-32 object-contain" />
                              <div className="flex gap-2 border-y border-gray-100 px-3 py-2 rounded-sm">
                                <div className="text-gray-500">파일명</div>
                                <div className="font-medium text-gray-800 text-xs break-normal">{data.facility.thumbnail.originalFileName}</div>
                              </div>
                            </>
                          ) : ("썸네일 이미지가 없습니다.")}
                        </div>
                      </FacilityFormItem>

                      <FacilityFormItem label="ID"><div>{data.facility.id}</div></FacilityFormItem>

                      <FacilityFormItem label="코드">
                        {isEditMode ? (
                          <Input
                            type="text"
                            value={formData.facility?.code || ""}
                            onChange={(e) => handleInputChange("code", e.target.value)}
                            placeholder="코드를 입력하세요"
                          />
                        ) : (<div>{data.facility.code}</div>)}
                      </FacilityFormItem>
                      <FacilityFormItem label="건물명" className="col-span-2">
                        {isEditMode ? (
                          <Input
                            type="text"
                            value={formData.facility?.name || ""}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="건물명을 입력하세요"
                            required
                          />
                        ) : (<div className="py-2">{data.facility.name}</div>)}
                      </FacilityFormItem>
                      <FacilityFormItem label="설명" className="col-span-2">
                        {isEditMode ? (
                          <Textarea
                            className='w-full'
                            value={formData.facility?.description || ""}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            placeholder="설명을 입력하세요"
                          />
                        ) : (<div>{data.facility.description || "-"}</div>)}
                      </FacilityFormItem>

                      <FacilityFormItem label="경로(Path)" className="col-span-2">
                        {isEditMode ? (
                          <div className="flex items-center gap-3">
                            <Input
                              type="text"
                              value={formData.facility?.path || ""}
                              onChange={(e) => handleInputChange("path", e.target.value)}
                              placeholder="경로를 입력하세요"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={() => setIsPathModalOpen(true)}
                              className="whitespace-nowrap"
                            >
                              경로 선택
                            </Button>
                          </div>
                        ) : (
                          <div className="py-2">
                            {data.facility.path ? data.facility.path : "-"}
                          </div>
                        )}
                      </FacilityFormItem>

                      <FacilityFormItem label="생성" className="col-span-2">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-gray-500 mr-7 text-sm">최초 생성일</span>
                            <span className="font-medium text-gray-800">
                        {data.facility.createdAt ? new Date(data.facility.createdAt,).toLocaleDateString("ko-KR") : "-"}
                      </span>
                          </div>
                          <Separator orientation="vertical" className="bg-gray-300 !h-5" />
                          <div>
                            <span className="text-gray-500 mr-4 text-sm">생성인</span>
                            <span className="font-medium text-gray-800">{data.facility.createdBy || "-"}</span>
                          </div>
                        </div>
                      </FacilityFormItem>

                      <FacilityFormItem label="수정" className="col-span-2 border-b">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-gray-500 mr-4 text-sm">마지막 수정일</span>
                            <span className="font-medium text-gray-800">
                        {data.facility.updatedAt ? new Date(data.facility.updatedAt,).toLocaleDateString("ko-KR") : "-"}
                      </span>
                          </div>
                          <Separator orientation="vertical" className="bg-gray-300 !h-5" />
                          <div>
                            <span className="text-gray-500 mr-4 text-sm">수정인</span>
                            <span className="font-medium text-gray-800">{data.facility.updatedBy || "-"}</span>
                          </div>
                        </div>
                      </FacilityFormItem>
                    </div>

                    <FacilityFormItem label="도면 이미지" className="col-span-3 border-b">
                      {data.facility.drawing.url ? (
                        <div className="flex items-center justify-between gap-4 w-full">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600 text-sm">파일명</span>
                            <p className="font-medium text-gray-800">{data.facility.drawing.originalFileName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href={data.facility.drawing.url} className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-150 border border-blue-100">다운로드</a>
                            <button onClick={() => setIsDrawingUpdateModalOpen(true)} className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 border border-blue-100">도면 업데이트</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center rounded p-3 gap-5">
                          <p className="text-sm text-gray-500">현재 도면 이미지가 없습니다.</p>
                          <button onClick={() => setIsDrawingUpdateModalOpen(true)} className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 border border-blue-100">도면 추가</button>
                        </div>
                      )}
                    </FacilityFormItem>

                    <FacilityFormItem label="도면 변경 이력" className="col-span-2 border-b">
                      <div className="py-2 w-full">
                        {!history ? (<p>데이터를 불러오는 중...</p>) : history.length === 0 ? (<p>변경 이력이 없습니다.</p>) : (
                          <ul className="grid gap-2">
                            {history?.map((historyItem, index) => (
                              <li key={index} className="text-sm text-gray-700 min-w-[120px] w-full flex justify-around items-center gap-1">
                                <div className='flex-1'>
                                  <span className="text-gray-500 mr-3">설명</span>
                                  <span className="font-medium text-gray-800">
                              {historyItem.comment || "-"}
                            </span>
                                </div>
                                <div className='w-52'>
                                  <span className="text-gray-500 mr-3">날짜</span>
                                  <span className="font-medium text-gray-800">
                              {historyItem.createdAt ? new Date(historyItem.createdAt).toLocaleString("ko-KR",) : "-"}
                            </span>
                                </div>
                                <div className='w-36'>
                                  <span className="text-gray-500 mr-3">수정자</span>
                                  <span className="font-medium text-gray-800">
                              {historyItem.createdBy || "-"}
                            </span>
                                </div>
                                <div className="flex w-40">
                                  <span className="text-gray-500 mr-3">파일명</span>
                                  <a href={historyItem.file.url}>
                                    <p className="font-bold text-gray-800">
                                      {historyItem.file.originalFileName}
                                    </p>
                                  </a>
                                </div>
                                <div>
                                  <a href={data.facility.drawing.url}>
                                    <p className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-150 border border-blue-100">다운로드</p>
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </FacilityFormItem>
                    {children}
                  </FacilityForm>
                </div>
                {formError && (<div className="text-red-500 mt-4 text-center">{formError}</div>)}
              </CardContent>
            </Card>
          ) : (<div className="text-center p-8">시설 정보가 없습니다.</div>)}

      <div className="flex items-center justify-end gap-2 mt-4 mb-6">
        {isEditMode ? (
          <>
            <Button variant="outline" onClick={handleEditToggle} disabled={isSubmitting}>취소</Button>
            <Button variant="default" onClick={handleSave} disabled={isSubmitting}>{isSubmitting ? "저장 중..." : "저장"}</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={handleDeleteFacility}>삭제</Button>
            <Button variant="outline" onClick={handleBack}>돌아가기</Button>
            <Button variant="default" onClick={handleEditToggle}>수정</Button>
          </>
        )}
      </div>
      <DrawingUpdateModal
        isOpen={isDrawingUpdateModalOpen}
        onClose={() => {
          setIsDrawingUpdateModalOpen(false);
          setIsEditMode(false);
          onMutate();
          if (onHistoryMutate) onHistoryMutate();
        }}
        onUpdate={handleDrawingUpdateSubmit}
        isSubmitting={isDrawingSubmitting}
      />
      <PathInputModal
        isOpen={isPathModalOpen}
        onClose={() => setIsPathModalOpen(false)}
        onSubmit={handlePathUpdate}
      />
    </PageContainer>
  );
};