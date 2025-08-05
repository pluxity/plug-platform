import React from 'react'
import { Card } from '@plug/ui'
import type { AssetCategoryResponse } from '@plug/common-services'

interface AssetCategoryCardProps {
  category: AssetCategoryResponse
  onClick: (categoryId: number) => void
  className?: string
}

export const AssetCategoryCard: React.FC<AssetCategoryCardProps> = ({
  category,
  onClick,
  className = ''
}) => {
  const handleClick = () => {
    onClick(category.id)
  }

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${className}`}
      onClick={handleClick}
    >
      <div className="p-4">
        {/* 썸네일 */}
        <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          {category.thumbnail?.url ? (
            <img
              src={category.thumbnail.url}
              alt={category.name}
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          )}
        </div>

        {/* 카테고리 정보 */}
        <div>
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
            {category.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            {category.code}
          </p>
          
          {/* 하위 카테고리 개수 또는 에셋 개수 */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            {category.children && category.children.length > 0 ? (
              <span>카테고리 {category.children.length}개</span>
            ) : (
              <span>에셋 {category.assetIds?.length || 0}개</span>
            )}
            
            {/* 뎁스 표시 */}
            <span>레벨 {category.depth}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
