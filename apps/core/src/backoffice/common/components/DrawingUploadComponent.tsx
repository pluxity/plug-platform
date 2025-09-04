import { useFileUploadWithInfo, FileResponse } from '@plug/common-services';

import { Upload, File, FileText } from 'lucide-react';
import React, { useState } from 'react';

import { Button, Card, CardContent } from '@plug/ui';
interface DrawingUploadComponentProps {
  currentFile?: FileResponse;
  onFileUpload: (file: FileResponse) => void;
  isLoading?: boolean;
}

export const DrawingUploadComponent: React.FC<DrawingUploadComponentProps> = ({
  currentFile,
  onFileUpload,
  isLoading = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { execute: uploadFile } = useFileUploadWithInfo();

  const handleFileSelect = async (file: File) => {
  if (isUploading || isLoading) return;

    try {
      setIsUploading(true);
      const uploadedFile = await uploadFile(file);
      onFileUpload(uploadedFile);
    } catch (error) {
  console.error('도면 파일 업로드 실패:', error);
  alert('도면 파일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert('파일 크기가 50MB를 초과합니다.');
        return;
      }
      handleFileSelect(file);
    }
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.includes('image')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (contentType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="space-y-3">
      {currentFile ? (
        <div className="relative">
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors"
                   onClick={() => window.open(currentFile.url, '_blank')}>
                <div className="flex-shrink-0">
                  {getFileIcon(currentFile.contentType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={currentFile.originalFileName}>
                    {currentFile.originalFileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentFile.contentType}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(currentFile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">도면 파일 없음</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="text-center">
        <label htmlFor="drawing-upload" className="cursor-pointer">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            disabled={isUploading || isLoading}
            onClick={() => document.getElementById('drawing-upload')?.click()}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                도면 {currentFile ? '변경' : '업로드'}
              </>
            )}
          </Button>
        </label>
        <input
          id="drawing-upload"
          type="file"
          accept=".dwg,.dxf,.pdf,.png,.jpg,.jpeg"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading || isLoading}
        />
      </div>
      <p className="text-xs text-gray-500 text-center">
        DWG, DXF, PDF, 이미지 파일 지원 (최대 50MB)
      </p>
    </div>
  );
};
