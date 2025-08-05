import React from 'react'
import { Button } from '@plug/ui'
import { 
  useAssets, 
  useAssetCategories, 
  useAssetCategoryNavigation, 
  useCurrentCategoryContent 
} from '@/global/store'
import { AssetCategoryCard } from './AssetCategoryCard'
import { AssetCard } from './AssetCard'

interface AssetExplorerProps {
  onAssetSelect?: (assetId: number) => void
  className?: string
}

export const AssetExplorer: React.FC<AssetExplorerProps> = ({
  onAssetSelect,
  className = ''
}) => {
  // Store hooks
  const { isLoading: assetsLoading, error: assetsError } = useAssets()
  const { isLoading: categoriesLoading, error: categoriesError } = useAssetCategories()
  const { 
    selectedCategoryId, 
    currentCategoryPath, 
    navigateToCategory, 
    goToParentCategory, 
    goToRootCategory 
  } = useAssetCategoryNavigation()
  const { 
    childCategories, 
    currentAssets, 
    hasChildCategories, 
    isRootLevel 
  } = useCurrentCategoryContent()

  const isLoading = assetsLoading || categoriesLoading
  const error = assetsError || categoriesError

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-gray-500">데이터를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-red-500">
          오류가 발생했습니다: {error.message || '알 수 없는 오류'}
        </div>
      </div>
    )
  }

  const handleCategoryClick = (categoryId: number) => {
    navigateToCategory(categoryId)
  }

  const handleAssetClick = (assetId: number) => {
    if (onAssetSelect) {
      onAssetSelect(assetId)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 브레드크럼 네비게이션 */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToRootCategory}
          className="text-blue-600 hover:text-blue-800"
        >
          홈
        </Button>
        
        {currentCategoryPath.map((category) => (
          <React.Fragment key={category.id}>
            <span className="text-gray-400">/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToCategory(category.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              {category.name}
            </Button>
          </React.Fragment>
        ))}
      </div>

      {/* 뒤로가기 버튼 */}
      {!isRootLevel && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToParentCategory}
          >
            ← 뒤로가기
          </Button>
          
          {selectedCategoryId && (
            <span className="text-sm text-gray-600">
              {hasChildCategories ? '하위 카테고리' : '에셋 목록'}
            </span>
          )}
        </div>
      )}

      {/* 컨텐츠 영역 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* 하위 카테고리들 표시 */}
        {hasChildCategories && childCategories.map((category) => (
          <AssetCategoryCard
            key={category.id}
            category={category}
            onClick={handleCategoryClick}
          />
        ))}

        {/* 에셋들 표시 */}
        {!hasChildCategories && currentAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onClick={onAssetSelect ? handleAssetClick : undefined}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {!hasChildCategories && currentAssets.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg
            className="w-12 h-12 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p>이 카테고리에는 에셋이 없습니다.</p>
        </div>
      )}

      {/* 루트 레벨에서 카테고리가 없는 경우 */}
      {isRootLevel && childCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg
            className="w-12 h-12 mb-4"
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
          <p>등록된 에셋 카테고리가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
