import React, { useState } from "react";
import { Button, Input } from "@plug/ui";
import { ModalFormItem } from "@plug/ui";
import {
  Dialog,
  DialogContent,
  DialogFooter
} from "@plug/ui";
import { useFileUploadWithInfo } from "@plug/common-services";
import type { FacilityDrawingUpdateRequest } from "@plug/common-services";

interface DrawingUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: FacilityDrawingUpdateRequest) => Promise<void>;
  isSubmitting?: boolean;
}

export const DrawingUpdateModal: React.FC<DrawingUpdateModalProps> = ({
                                                                        isOpen,
                                                                        onClose,
                                                                        onUpdate,
                                                                        isSubmitting = false,
                                                                      }) => {
  const [drawingComment, setDrawingComment] = useState("");
  const drawingUploader = useFileUploadWithInfo();

  const handleDrawingUpdate = async () => {
    if (!drawingUploader.fileInfo?.id) {
      alert("업로드할 도면 파일을 선택해주세요.");
      return;
    }
    await onUpdate({
      drawingFileId: drawingUploader.fileInfo.id,
      comments: drawingComment
    });
    setDrawingComment("");
    drawingUploader.reset();
  };

  const handleDrawingFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        await drawingUploader.execute(files[0]);
      } catch (err) {
        alert("도면 파일 업로드 중 오류가 발생했습니다.");
        console.error("도면 파일 업로드 오류:", err);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setDrawingComment("");
      drawingUploader.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent title="도면 업데이트" showCloseButton={true} dimmed={true}>
        <ModalFormItem label="도면 파일">
          <div className="flex flex-col">
            <Input
              type="file"
              accept="image/*, application/pdf"
              onChange={handleDrawingFileChange}
              disabled={isSubmitting}
              className="w-full"
              required
            />
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

        <ModalFormItem label="코멘트">
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