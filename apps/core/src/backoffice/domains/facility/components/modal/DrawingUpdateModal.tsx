import React, { useState } from "react";
import { Button, Input } from "@plug/ui";
import { ModalFormItem } from "@plug/ui";
import { Dialog, DialogContent, DialogFooter } from "@plug/ui";
import { Floor, useFileUploadWithInfo } from "@plug/common-services";
import type { FacilityDrawingUpdateRequest } from "@plug/common-services";
import * as Px from "@plug/engine/dist/src";
import { ModelInfo } from "@plug/engine/dist/src/interfaces";

interface DrawingUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: FacilityDrawingUpdateRequest, floors: Floor[]) => Promise<void>;
  isSubmitting?: boolean;
}

export const DrawingUpdateModal: React.FC<DrawingUpdateModalProps> = ({ isOpen, onClose, onUpdate, isSubmitting = false, }) => {
  const [drawingComment, setDrawingComment] = useState("");
  const drawingUploader = useFileUploadWithInfo();
  const [floors, setFloors] = useState<Floor[]>([]);

  const handleDrawingUpdate = async () => {
    if (!drawingUploader.fileInfo?.id) {
      alert("업로드할 도면 파일을 선택해주세요.");
      return;
    }

    await onUpdate({
      drawingFileId: drawingUploader.fileInfo.id,
      comment: drawingComment,
    }, floors);

    setDrawingComment("");
    setFloors([]);
    drawingUploader.reset();
  };

  const handleDrawingChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        await drawingUploader.execute(files[0]);
        const fileUrl = URL.createObjectURL(files[0]);
        console.log("파일 URL 생성됨:", fileUrl);

        if (fileUrl) {
          console.log("모델 계층 정보 가져오기 시작");
          Px.Model.GetModelHierarchyFromUrl(fileUrl, (modelInfos: ModelInfo) => {
            console.log("모델 정보 받음:", modelInfos);
            if (Array.isArray(modelInfos) && modelInfos.length > 0) {
              const extractedFloors = modelInfos.map(info => ({
                name: info.displayName,
                floorId: info.floorId
              }));
              console.log("추출된 층 정보:", extractedFloors);
              setFloors(extractedFloors);
            } else {
              console.log("모델 정보가 없거나 유효하지 않습니다");
            }
          });
        }
      } catch (err) {
        console.error("도면 업로드 오류:", err);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setDrawingComment("");
      setFloors([]);
      drawingUploader.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent title="도면 업데이트" showCloseButton={true} dimmed={true}>
        <ModalFormItem label="도면 파일" className='border-t divide-y'>
          <div className="flex flex-col">
            <Button className="w-16"
                    onClick={() => document?.getElementById("thumbnail-input")?.click()}>파일 선택</Button>
            <Input type="file" id="thumbnail-input" className="hidden w-full" accept="image/*, application/pdf"
                   onChange={handleDrawingChange} disabled={isSubmitting} required/>
            {drawingUploader.isLoadingFileInfo && <p>파일 업로드 중...</p>}
            {drawingUploader.fileInfo && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  업로드된 파일: {drawingUploader.fileInfo.originalFileName}
                </p>
              </div>
            )}
          </div>
        </ModalFormItem>

        <ModalFormItem label="코멘트" className='border-t'>
          <Input
            type="text"
            value={drawingComment}
            onChange={(e) => setDrawingComment(e.target.value)}
            placeholder="변경 사항에 대한 설명을 입력하세요"
            disabled={isSubmitting}
            className="w-full"
            required
          />
        </ModalFormItem>

        <ModalFormItem label='층 정보' className='border-t border-b'>
          <div className="flex flex-wrap gap-2">
            {floors && floors.length > 0 ? (
              floors.map((floor, index) => (
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
                도면 파일을 업로드하면 층 정보가 자동으로 추출됩니다.
              </div>
            )}
          </div>
        </ModalFormItem>

        <DialogFooter className="flex justify-end gap-2 pt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            onKeyDown={(e) => e.key === "Enter" && handleClose()}
          >
            취소
          </Button>
          <Button
            variant="default"
            onClick={handleDrawingUpdate}
            disabled={isSubmitting || !drawingUploader.fileInfo?.id}
          >
            {isSubmitting ? "업데이트 중..." : "업데이트"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};