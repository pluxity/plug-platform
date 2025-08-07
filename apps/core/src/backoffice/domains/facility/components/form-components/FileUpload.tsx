import React, { useRef, useState } from 'react';
import { Button, Input } from '@plug/ui';
import { Upload, X, FileText, Image } from 'lucide-react';
import { useFileUploadWithInfo } from '@plug/common-services';

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileChange: (fileId: number | null) => void;
  onFileUploaded?: (fileInfo: { id: number; url: string; originalFileName: string }) => void;
  currentFileId?: number;
  placeholder?: string;
  disabled?: boolean;
  fileType?: 'image' | 'document';
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  onFileChange,
  onFileUploaded,
  currentFileId,
  placeholder,
  disabled = false,
  fileType = 'document'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const { 
    execute: uploadFile, 
    isLoading, 
    fileInfo,
    clearFileInfo 
  } = useFileUploadWithInfo();

  const handleFileSelect = async (file: File) => {
    try {
      const uploadedFile = await uploadFile(file);
      onFileChange(uploadedFile.id);
      
      // 파일 업로드 완료 시 콜백 호출
      if (onFileUploaded) {
        onFileUploaded({
          id: uploadedFile.id,
          url: uploadedFile.url,
          originalFileName: uploadedFile.originalFileName
        });
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      // TODO: 에러 토스트 표시
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemoveFile = () => {
    clearFileInfo();
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = () => {
    if (fileType === 'image') {
      return <Image size={20} className="text-blue-500" />;
    }
    return <FileText size={20} className="text-blue-500" />;
  };

  const displayFileName = fileInfo?.originalFileName || 
    (currentFileId ? `파일 ID: ${currentFileId}` : '');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      
      {/* 숨겨진 파일 입력 */}
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
      
      {/* 업로드된 파일 표시 */}
      {(fileInfo || currentFileId) && (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            {getFileIcon()}
            <span className="text-sm text-gray-700 truncate">
              {displayFileName}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            disabled={disabled || isLoading}
            className="text-red-600 hover:text-red-700"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      
      {/* 드래그 앤 드롭 영역 */}
      {!fileInfo && !currentFileId && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!disabled ? handleButtonClick : undefined}
        >
          <Upload className={`mx-auto h-12 w-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="mt-2 text-sm text-gray-600">
            {placeholder || '파일을 드래그하거나 클릭하여 업로드'}
          </p>
          <p className="text-xs text-gray-500">
            {accept && `지원 형식: ${accept}`}
          </p>
        </div>
      )}
      
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">업로드 중...</span>
        </div>
      )}
    </div>
  );
};
