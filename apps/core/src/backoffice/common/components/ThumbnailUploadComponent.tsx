import React, { useState } from 'react';
import { Upload, Image } from 'lucide-react';
import { Button, Card, CardContent } from '@plug/ui';
import { useFileUploadWithInfo, FileResponse } from '@plug/common-services';

interface ThumbnailUploadComponentProps {
  currentFile?: FileResponse;
  onFileUpload: (file: FileResponse) => void;
  isLoading?: boolean;
}

export const ThumbnailUploadComponent: React.FC<ThumbnailUploadComponentProps> = ({
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
  console.error('썸네일 업로드 실패:', error);
  alert('썸네일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기가 10MB를 초과합니다.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      handleFileSelect(file);
    }
  };

  return (
    <div className="space-y-3">
      {currentFile ? (
        <div className="relative">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100">
                <img 
                  src={currentFile.url} 
                  alt="썸네일"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(currentFile.url, '_blank')}
                />
              </div>
            </CardContent>
          </Card>
          <div className="mt-2 text-xs text-gray-500 text-center">
            {currentFile.originalFileName}
          </div>
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-6">
            <div className="text-center">
              <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">썸네일 없음</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="text-center">
        <label htmlFor="thumbnail-upload" className="cursor-pointer">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            disabled={isUploading || isLoading}
            onClick={() => document.getElementById('thumbnail-upload')?.click()}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                썸네일 {currentFile ? '변경' : '업로드'}
              </>
            )}
          </Button>
        </label>
        <input
          id="thumbnail-upload"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading || isLoading}
        />
      </div>
    </div>
  );
};
