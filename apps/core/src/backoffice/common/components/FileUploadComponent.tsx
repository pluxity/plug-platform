import { useFileUploadWithInfo } from '@plug/common-services';

import { Upload, X, File, Image } from 'lucide-react';
import React, { useState, useRef } from 'react';

import { Button, Card, CardContent } from '@plug/ui';
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  uploadedAt?: string;
}

interface FileUploadComponentProps {
  files: FileItem[];
  onFilesChange: (files: FileItem[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
  disabled?: boolean;
  showThumbnails?: boolean;
  title?: string;
  description?: string;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  files = [],
  onFilesChange,
  accept = "*/*",
  multiple = true,
  maxSize = 10,
  disabled = false,
  showThumbnails = true,
  title = "파일 업로드",
  description = "파일을 드래그하거나 클릭하여 업로드하세요"
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { execute: uploadFile } = useFileUploadWithInfo();

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || isUploading) return;

    setIsUploading(true);
    const newFiles: FileItem[] = [];
    
    try {
      for (const file of Array.from(selectedFiles)) {
        if (file.size > maxSize * 1024 * 1024) {
          alert(`파일 크기가 ${maxSize}MB를 초과합니다: ${file.name}`);
          continue;
        }

        try {
          // 실제 파일 업로드
          const uploadedFile = await uploadFile(file);
          
          const fileItem: FileItem = {
            id: uploadedFile.id.toString(),
            name: uploadedFile.originalFileName,
            size: file.size,
            type: file.type,
            url: uploadedFile.url,
            uploadedAt: uploadedFile.createdAt
          };

          newFiles.push(fileItem);
        } catch (error) {
          console.error('파일 업로드 실패:', error);
          alert(`파일 업로드에 실패했습니다: ${file.name}`);
        }
      }

      if (multiple) {
        onFilesChange([...files, ...newFiles]);
      } else {
        onFilesChange(newFiles.slice(0, 1));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    // Clean up object URLs
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove?.url && fileToRemove.file) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isUploading ? '업로드 중...' : title}
        </p>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <p className="text-xs text-gray-400">
          최대 {maxSize}MB • {accept === "*/*" ? "모든 파일" : accept}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            업로드된 파일 ({files.length}개)
          </h4>
          
          <div className={showThumbnails ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-2"}>
            {files.map((file) => (
              <Card key={file.id} className="relative">
                <CardContent className="p-3">
                  {showThumbnails && isImage(file.type) && file.url ? (
                    <div className="space-y-2">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {isImage(file.type) ? (
                          <Image className="h-8 w-8 text-blue-500" />
                        ) : (
                          <File className="h-8 w-8 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        {file.uploadedAt && (
                          <p className="text-xs text-gray-400">
                            {new Date(file.uploadedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-white shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
