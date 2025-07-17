import React, { useState, useRef } from 'react'
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
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onUpload) return

    setUploading(true)
    try {
      const fileId = await onUpload(file)
      onThumbnailChange(fileId)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveThumbnail = () => {
    onThumbnailChange(undefined)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
      {currentThumbnailUrl ? (
        <div className="relative group">
          <img
            src={currentThumbnailUrl}
            alt="썸네일"
            className={`${sizeClasses[size]} object-cover rounded border cursor-pointer`}
            onClick={!disabled ? handleClick : undefined}
          />
          {/* Hover Preview */}
          <div className="absolute left-full top-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-2">
              <img
                src={currentThumbnailUrl}
                alt="썸네일 미리보기"
                className="w-40 h-40 object-cover rounded"
              />
            </div>
          </div>
          {!disabled && (
            <Button
              type="button"
              onClick={handleRemoveThumbnail}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity p-0 min-w-0 h-4"
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
