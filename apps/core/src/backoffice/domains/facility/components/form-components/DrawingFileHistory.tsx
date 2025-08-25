import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
  Input,
  Badge,
} from '@plug/ui';
import { FacilityHistoryResponse, facilityService } from '@plug/common-services';
import { useFileUploadWithInfo } from '@plug/common-services';
import { Model, Interfaces } from '@plug/engine';

interface DrawingFileHistoryProps {
  facilityId: number;
  history: FacilityHistoryResponse[];
  onHistoryUpdate: () => void;
  onFloorsExtracted?: (floors: Array<{name: string; floorId: string}>) => void;
}

export const DrawingFileHistory: React.FC<DrawingFileHistoryProps> = ({
  facilityId,
  history,
  onHistoryUpdate,
  onFloorsExtracted,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingDrawing, setIsProcessingDrawing] = useState(false);
  const [extractedFloors, setExtractedFloors] = useState<Array<{name: string; floorId: string}>>([]);

  const fileUpload = useFileUploadWithInfo();

  const handleFileUploaded = async (file: File) => {
    setIsUploading(true);
    try {
      const fileInfo = await fileUpload.execute(file);
      setUploadedFileId(fileInfo.id);
      
      // 도면에서 층 정보 추출
      setIsProcessingDrawing(true);
      try {
        Model.GetModelHierarchyFromUrl(fileInfo.url, (modelInfo: Interfaces.ModelInfo[]) => {
          const floors = modelInfo
            .sort((a, b) => b.sortingOrder - a.sortingOrder)
            .map(info => ({
              name: info.displayName || info.objectName,
              floorId: info.floorId
            }));
          
          setExtractedFloors(floors);
          setIsProcessingDrawing(false);
        });
      } catch (error) {
        console.error('Error processing drawing file with engine:', error);
        setExtractedFloors([]);
        setIsProcessingDrawing(false);
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrawingUpdate = async () => {
    if (!uploadedFileId || !comment.trim()) {
      alert('파일과 코멘트를 모두 입력해주세요.');
      return;
    }

    try {
      // 1. 도면 파일 업데이트
      await facilityService.updateFacilityDrawing(facilityId, {
        drawingFileId: uploadedFileId,
        comment: comment.trim(),
      });
      
      // 2. 층 정보 업데이트
      if (extractedFloors.length > 0) {
        await facilityService.updateFacilityFloors(facilityId, {
          floors: extractedFloors
        });
        
        // 3. 층 정보가 변경되었음을 부모 컴포넌트에 알림
        if (onFloorsExtracted) {
          onFloorsExtracted(extractedFloors);
        }
      }
      
      setIsDialogOpen(false);
      setComment('');
      setUploadedFileId(null);
      setExtractedFloors([]);
      onHistoryUpdate();
    } catch (error) {
      console.error('도면 파일 업데이트 실패:', error);
      alert('도면 파일 업데이트에 실패했습니다.');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setComment('');
    setUploadedFileId(null);
    setExtractedFloors([]);
    fileUpload.clearFileInfo();
  };

  return (
    <Card>
      <CardHeader className="pt-2">
        <div className="flex items-center justify-between">
          <CardTitle>도면 파일 이력</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">새 도면 업로드</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>새 도면 파일 업로드</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    도면 파일 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="file"
                    accept=".glb,.gltf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUploaded(file);
                      }
                    }}
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <p className="text-sm text-gray-500 mt-1">파일 업로드 중...</p>
                  )}
                  {fileUpload.fileInfo && (
                    <p className="text-sm text-green-600 mt-1">
                      업로드 완료: {fileUpload.fileInfo.originalFileName}
                    </p>
                  )}
                  {isProcessingDrawing && (
                    <p className="text-sm text-blue-600 mt-1">도면에서 층 정보 추출 중...</p>
                  )}
                  {extractedFloors.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        추출된 층 정보 ({extractedFloors.length}개):
                      </p>
                      <div className="space-y-1">
                        {extractedFloors.slice(0, 5).map((floor, index) => (
                          <div key={index} className="text-xs text-blue-700">
                            • {floor.name} (ID: {floor.floorId})
                          </div>
                        ))}
                        {extractedFloors.length > 5 && (
                          <div className="text-xs text-blue-600">
                            ... 외 {extractedFloors.length - 5}개
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    변경 사유 <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="도면 파일 변경 사유를 입력하세요"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleDialogClose}>
                    취소
                  </Button>
                  <Button 
                    onClick={handleDrawingUpdate}
                    disabled={!uploadedFileId || !comment.trim() || isUploading}
                  >
                    업로드
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4">도면 파일 이력이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div 
                key={item.id} 
                className="border rounded-lg p-3 bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          현재
                        </Badge>
                      )}
                      <span className="font-medium text-sm">
                        {item.file.originalFileName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.comment}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        {new Date(item.createdAt).toLocaleString('ko-KR')}
                      </span>
                      <span>작성자: {item.createdBy}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(item.file.url, '_blank')}
                    >
                      다운로드
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
