import React from 'react'
import { Card } from '@plug/ui'
import type { AssetResponse } from '@plug/common-services'

interface AssetCardProps {
  asset: AssetResponse
  onClick?: (assetId: number) => void
  className?: string
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onClick,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(asset.id)
    }
  }

  return (
    <Card 
      className={`${onClick ? 'cursor-pointer hover:shadow-lg' : ''} transition-shadow duration-200 ${className}`}
      onClick={handleClick}
    >
      <div className="p-4">
        {/* 썸네일 */}
        <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          {asset.thumbnailFile?.url ? (
            <img
              src={asset.thumbnailFile.url}
              alt={asset.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          )}
        </div>

        {/* 에셋 정보 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
            {asset.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            {asset.code}
          </p>
          
          {/* 카테고리 및 파일 정보 */}
          <div className="space-y-1">
            {asset.categoryName && (
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {asset.categoryName}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              {asset.file?.originalFileName && (
                <span className="truncate mr-2">
                  {asset.file.originalFileName}
                </span>
              )}
              
              {/* 생성일 */}
              {asset.createdAt && (
                <span>
                  {new Date(asset.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
