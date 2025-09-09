import { toast } from 'sonner';

import { Upload, X, FileText, Image } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

import { useFileUploadWithInfo, FileResponse } from '@plug/common-services';
import { Button, Input } from '@plug/ui';
interface FileUploadProps {
  accept?: string;
  onFileChange: (fileId: number | null) => void;
  onFileUploaded?: (fileInfo: FileResponse) => void;
  onFileRemoved?: () => void; // 파일 제거 시 별도 콜백
  currentFileId?: number;
  currentFileInfo?: FileResponse | null;
  placeholder?: string;
  disabled?: boolean;
  fileType?: 'image' | 'document';
  isEditMode?: boolean; // Edit 모드인지 구분
  maxSizeInMB?: number; // 최대 파일 크기 (MB 단위)
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  onFileChange,
  onFileUploaded,
  onFileRemoved,
  currentFileId,
  currentFileInfo,
  placeholder,
  disabled = false,
  fileType = 'document',
  isEditMode = false,
  maxSizeInMB = 50 // 기본값 50MB
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragValidFileType, setDragValidFileType] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  
  const { 
    execute: uploadFile, 
    isLoading, 
    fileInfo,
    clearFileInfo 
  } = useFileUploadWithInfo();

  useEffect(() => {
    if (currentFileInfo && fileType === 'image') {
      setCurrentImageUrl(currentFileInfo.url);
    } else if (currentFileId && fileType === 'image') {
      const imageUrl = `/api/files/${currentFileId}`;
      setCurrentImageUrl(imageUrl);
    } else {
      setCurrentImageUrl(null);
    }
  }, [currentFileInfo, currentFileId, fileType]);

  const validateFileSize = (file: File): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  };

  const validateFileType = (file: File): boolean => {
    if (!accept) return true;
    
    const acceptedTypes = accept.split(',').map(type => type.trim());
    
    for (const acceptedType of acceptedTypes) {
      if (acceptedType.startsWith('.')) {
        const extension = acceptedType.toLowerCase();
        if (file.name.toLowerCase().endsWith(extension)) {
          return true;
        }
      } else if (acceptedType.includes('*')) {
        const [mainType] = acceptedType.split('/');
        if (file.type.startsWith(mainType)) {
          return true;
        }
      } else {
        if (file.type === acceptedType) {
          return true;
        }
      }
    }
    
    return false;
  };

  const handleFileSelect = async (file: File) => {
    try {
      if (!validateFileType(file)) {
        const fileTypeText = fileType === 'image' ? '이미지' : '문서';
        console.error(`Invalid file type: ${file.type}, expected: ${accept}`);
        toast.error(`올바른 ${fileTypeText} 파일을 선택해주세요`, {
          description: `허용된 형식: ${accept}`
        });
        return;
      }

      if (!validateFileSize(file)) {
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        console.error(`File too large: ${fileSizeInMB}MB, max allowed: ${maxSizeInMB}MB`);
        toast.error('파일 크기가 너무 큽니다', {
          description: `현재: ${fileSizeInMB}MB, 최대: ${maxSizeInMB}MB`
        });
        return;
      }

      setCurrentImageUrl(null);
      
      const uploadedFile = await uploadFile(file);
      
      onFileChange(uploadedFile.id);
      
      if (fileType === 'image' && uploadedFile.url) {
        setCurrentImageUrl(uploadedFile.url);
      }
      
      if (onFileUploaded) {
        onFileUploaded(uploadedFile);
      }
      
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      setCurrentImageUrl(null);
      onFileChange(null);
      toast.error('파일 업로드에 실패했습니다', {
        description: '다시 시도해주세요'
      });
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
    
    const items = event.dataTransfer.items;
    if (items && items.length > 0) {
      const file = items[0];
      if (file.kind === 'file') {
        const fileData = file.getAsFile();
        if (fileData) {
          const isValid = validateFileType(fileData);
          setDragValidFileType(isValid);
          return;
        }
      }
    }
    setDragValidFileType(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
    setDragValidFileType(true);
  };

  const handleRemoveFile = () => {
    clearFileInfo();
    setCurrentImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (isEditMode && onFileRemoved) {
      onFileRemoved();
    } else {
      onFileChange(null);
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
    currentFileInfo?.originalFileName ||
    (currentFileId ? `파일 ID: ${currentFileId}` : '');

  return (
    <div className="w-full">
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col gap-4">
        {(fileInfo || currentFileInfo || currentFileId) && (
          <div className="w-full">
            {fileType === 'image' && (currentImageUrl || fileInfo?.url) ? (
              <div className="relative bg-white rounded-sm border border-gray-200">
                <img
                  src={fileInfo?.url || currentImageUrl || ''}
                  alt="미리보기"
                  className="w-full h-52 object-contain rounded-lg p-2 bg-secondary-200"
                  onError={() => setCurrentImageUrl(null)}
                />
                {!isEditMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={disabled || isLoading}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-sm rounded-full p-2 transition-all"
                  >
                    <X size={16} className="text-gray-600" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon()}
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[240px]">
                {displayFileName}
              </span>
                </div>
                {!isEditMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={disabled || isLoading}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <div
          className={`
        relative w-full rounded-xl border-2 border-dashed transition-all duration-200
        ${(fileInfo || currentFileInfo || currentFileId) ? 'p-4' : 'p-8'}
        ${isDragOver
            ? (dragValidFileType
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-red-500 bg-red-50/50'
            )
            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50'
          }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!disabled ? handleButtonClick : undefined}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload
              className={`
            ${(fileInfo || currentFileInfo || currentFileId) ? 'h-8 w-8' : 'h-12 w-12'} 
            ${isDragOver
                ? (dragValidFileType ? 'text-blue-500' : 'text-red-500')
                : 'text-gray-400'
              }
            transition-colors duration-200
          `}
            />
            <div className="text-center">
              <p className={`
            font-medium
            ${(fileInfo || currentFileInfo || currentFileId) ? 'text-sm' : 'text-base'} 
            ${isDragOver
                ? (dragValidFileType ? 'text-blue-700' : 'text-red-700')
                : 'text-gray-700'
              }
          `}>
                {isDragOver
                  ? (dragValidFileType
                      ? `${fileType === 'image' ? '이미지' : '파일'}를 놓아주세요`
                      : `올바른 ${fileType === 'image' ? '이미지' : '파일'} 형식이 아닙니다`
                  )
                  : ((fileInfo || currentFileInfo || currentFileId)
                      ? (fileType === 'image' ? '새 이미지 업로드' : '새 파일 업로드')
                      : (placeholder || '파일을 드래그하거나 클릭하여 업로드')
                  )
                }
              </p>
              {accept && !(fileInfo || currentFileInfo || currentFileId) && !isDragOver && (
                <p className="mt-1 text-xs text-gray-500">
                  지원 형식: {accept}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-sm font-medium text-blue-700">업로드 중...</span>
          </div>
        )}
      </div>
    </div>
  );
};
