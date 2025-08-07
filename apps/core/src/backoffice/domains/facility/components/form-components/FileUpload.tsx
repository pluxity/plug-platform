import React, { useRef, useState, useEffect } from 'react';
import { Button, Input } from '@plug/ui';
import { Upload, X, FileText, Image } from 'lucide-react';
import { useFileUploadWithInfo, FileResponse } from '@plug/common-services';
import { toast } from 'sonner';

interface FileUploadProps {
  label: string;
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
  label,
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
      {(fileInfo || currentFileInfo || currentFileId) && (
        <div className="space-y-3">
          {/* 이미지 미리보기 */}
          {fileType === 'image' && (currentImageUrl || fileInfo?.url) && (
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src={fileInfo?.url || currentImageUrl || ''}
                  alt="미리보기"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={() => setCurrentImageUrl(null)}
                />
                {/* Edit 모드가 아닐 때만 X 버튼 표시 */}
                {!isEditMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={disabled || isLoading}
                    className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 rounded-full p-1"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {(fileType !== 'image' || (!currentImageUrl && !fileInfo?.url)) && (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2">
                {getFileIcon()}
                <span className="text-sm text-gray-700 truncate">
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
                  className="text-red-600 hover:text-red-700"
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
          border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${(fileInfo || currentFileInfo || currentFileId) ? 'p-3' : 'p-6'}
          ${isDragOver 
            ? (dragValidFileType 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-red-500 bg-red-50'
            ) 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!disabled ? handleButtonClick : undefined}
      >
        <Upload className={`mx-auto ${(fileInfo || currentFileInfo || currentFileId) ? 'h-6 w-6' : 'h-12 w-12'} 
          ${isDragOver 
            ? (dragValidFileType ? 'text-blue-500' : 'text-red-500') 
            : 'text-gray-400'
          }`} 
        />
        <p className={`mt-2 text-sm ${(fileInfo || currentFileInfo || currentFileId) ? 'text-xs' : ''} 
          ${isDragOver 
            ? (dragValidFileType ? 'text-blue-600' : 'text-red-600') 
            : 'text-gray-600'
          }`}
        >
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
          <p className="text-xs text-gray-500">
            지원 형식: {accept}
          </p>
        )}
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">업로드 중...</span>
        </div>
      )}
    </div>
  );
};
