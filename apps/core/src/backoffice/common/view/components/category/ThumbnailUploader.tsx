import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@plug/ui'

export interface ThumbnailUploaderProps {
  currentThumbnailUrl?: string
  onThumbnailChange: (fileId: number | undefined) => void
  onUpload?: (file: File) => Promise<number>
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  currentThumbnailUrl,
  onThumbnailChange,
  onUpload,
  disabled = false,
  size = 'small'
}) => {
  const [previewThumbnailUrl, setPreviewThumbnailUrl] = useState('');
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  useEffect(() => {
    setPreviewThumbnailUrl(currentThumbnailUrl || '');
  }, [currentThumbnailUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onUpload) return
  
    const previewUrl = URL.createObjectURL(file)
    setPreviewThumbnailUrl(previewUrl)
  
    setUploading(true)
    try {
      const fileId = await onUpload(file)
      onThumbnailChange(fileId)
    } catch (error) {
      console.error("업로드 중 오류 발생:", error)
    } finally {
      URL.revokeObjectURL(previewUrl)  
      setUploading(false)
    }
  }

  const handleRemoveThumbnail = () => {
    setPreviewThumbnailUrl('')
    onThumbnailChange(undefined)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
      {previewThumbnailUrl ? (
        <div className="relative group">
          <img
            src={previewThumbnailUrl}
            alt="썸네일"
            className={`${sizeClasses[size]} object-cover rounded border-2 border-dashed border-gray-300 cursor-pointer`}
            onClick={!disabled ? handleClick : undefined}
          />
          {!disabled && (
            <Button
              type="button"
              onClick={handleRemoveThumbnail}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors min-w-0 min-h-0 px-0 cursor-pointer"
            >
              ×
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={!disabled ? handleClick : undefined}
          disabled={disabled || uploading}
          className={`${sizeClasses[size]} border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          {uploading ? '⏳' : '📷'}
        </button>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}