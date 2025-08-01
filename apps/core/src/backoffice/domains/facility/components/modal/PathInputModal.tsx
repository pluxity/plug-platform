import { useState } from "react";
import { Button, Input, Dialog, DialogContent, DialogFooter } from "@plug/ui";

export const PathInputModal = ({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (path: string) => void
}) => {
  const [path, setPath] = useState("");

  const handleSubmit = () => {
    if (path.trim()) {
      onSubmit(path);
      setPath("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent title="시설 경로 입력" showCloseButton={true} dimmed={true}>
        <div className="py-4">
          <Input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="시설 경로를 입력하세요"
            className="w-full"
          />
        </div>
        <DialogFooter className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!path.trim()}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
