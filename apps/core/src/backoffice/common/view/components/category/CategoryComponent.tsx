import React, { useCallback } from 'react'
import { Card, CardContent, Badge, Button, Input } from '@plug/ui'
import { CategoryItem, CategoryOperations, CategoryConfig } from '@/backoffice/common/services/types/category'
import { useCategory, recalculateDepths, getTotalChildrenCount, getMaxDepthOfTree, findNodeById } from '@/backoffice/common/services/hooks/useCategory'
import { ThumbnailUploader } from './ThumbnailUploader'
import { CategoryNode } from './CategoryNode'
import { toast } from 'sonner'

export interface CategoryComponentProps extends CategoryOperations, CategoryConfig {
  items?: CategoryItem[]
  className?: string
  title?: string
  emptyMessage?: string
}

export const CategoryComponent: React.FC<CategoryComponentProps> = ({
  items = [],
  maxDepth = 3,
  enableDragDrop = true,
  thumbnailSize = 'small',
  disabled = false,
  showCodes = true,
  allowRootAdd = true,
  className,
  title = '카테고리 관리',
  emptyMessage = '등록된 카테고리가 없습니다.',
  ...operations
}) => {
  const {
    isAddingRoot,
    rootAddValue,
    rootAddCode,
    setIsAddingRoot,
    setRootAddValue,
    setRootAddCode,
    setRootThumbnailFileId,
    handleCategoryAdd,
    handleCategoryUpdate,
    handleCategoryDelete,
    handleRootAdd
  } = useCategory(operations)
  
  const itemsWithCorrectDepths = React.useMemo(() => recalculateDepths(items), [items])

  const totalCategoryCount = React.useMemo(() => {
    return itemsWithCorrectDepths.reduce((count, item) => {
      return count + getTotalChildrenCount(item) + 1
    }, 0)
  }, [itemsWithCorrectDepths])

  const resetRootAddForm = useCallback(() => {
    setIsAddingRoot(false)
    setRootAddValue('')
    setRootAddCode('')
    setRootThumbnailFileId(undefined)
  }, [setIsAddingRoot, setRootAddValue, setRootAddCode, setRootThumbnailFileId])

  const handleCategoryMove = async (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    const draggedNode = findNodeById(itemsWithCorrectDepths, draggedId)
    const targetNode = findNodeById(itemsWithCorrectDepths, targetId)
    
    if (!draggedNode || !targetNode) {
      return
    }

    const isDescendant = (parent: CategoryItem, childId: string): boolean => {
      if (parent.id === childId) return true
      if (parent.children) {
        return parent.children.some(child => isDescendant(child, childId))
      }
      return false
    }

    if (isDescendant(draggedNode, targetId)) {
      toast.error('자기 자신이나 하위 카테고리로는 이동할 수 없습니다.')
      return
    }

    if (position === 'inside') {
      const draggedMaxDepth = getMaxDepthOfTree(draggedNode)
      const draggedDepthSpan = draggedMaxDepth - draggedNode.depth
      const newBaseDepth = targetNode.depth + 1
      const newMaxDepth = newBaseDepth + draggedDepthSpan
      
      if (newMaxDepth > maxDepth) {
        const currentStructure = draggedNode.children && draggedNode.children.length > 0 
          ? `\n\n현재 "${draggedNode.name}" 카테고리는 ${draggedDepthSpan + 1}단계의 하위 구조를 가지고 있습니다.`
          : ''
        
        toast.error(`이동 불가: 최대 깊이 ${maxDepth}를 초과합니다.\n\n"${targetNode.name}" 카테고리 밑으로 이동하면:\n- "${draggedNode.name}"이 Depth ${newBaseDepth}가 됩니다.\n- 최하위 카테고리가 Depth ${newMaxDepth}가 됩니다.${currentStructure}`)
        return
      }
    } else {
      const draggedMaxDepth = getMaxDepthOfTree(draggedNode)
      const draggedDepthSpan = draggedMaxDepth - draggedNode.depth
      const newBaseDepth = targetNode.depth
      const newMaxDepth = newBaseDepth + draggedDepthSpan
      
      if (newMaxDepth > maxDepth) {
        toast.error(`이동 불가: 최대 깊이 ${maxDepth}를 초과합니다.\n\n같은 레벨(Depth ${newBaseDepth})로 이동하면 최하위 카테고리가 Depth ${newMaxDepth}가 됩니다.`)
        return
      }
    }
    
    if (operations.onMove) {
      await operations.onMove(draggedId, targetId, position)
    }
  }

  const handleRootKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleRootAdd()
    }
    if (e.key === 'Escape') {
      resetRootAddForm()
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <Badge variant="outline" className="text-xs">
              최대 {maxDepth}단계
            </Badge>
          </div>
          {!disabled && allowRootAdd && (
            <Button
              variant="default"
              onClick={() => setIsAddingRoot(true)}
              className="gap-1 w-auto"
            >
              <span>+</span>
              루트 카테고리 추가
            </Button>
          )}
        </div>

        {/* Root Add Form */}
        {isAddingRoot && (
          <div className="flex flex-col gap-3 p-4 bg-blue-50 rounded-md mb-4">
            <div className="flex flex-col gap-2">
              <Input
                value={rootAddValue}
                onChange={(e) => setRootAddValue(e.target.value)}
                onKeyDown={handleRootKeyDown}
                placeholder="루트 카테고리 이름"
                className="h-8 text-sm"
                autoFocus
                disabled={disabled}
              />
              {showCodes && (
                <Input
                  value={rootAddCode}
                  onChange={(e) => setRootAddCode(e.target.value)}
                  onKeyDown={handleRootKeyDown}
                  placeholder="루트 카테고리 코드"
                  className="h-7 text-xs"
                  disabled={disabled}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <ThumbnailUploader
                onThumbnailChange={setRootThumbnailFileId}
                onUpload={operations.onThumbnailUpload}
                disabled={disabled}
                size={thumbnailSize}
              />
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0 text-green-600 hover:text-green-700"
                onClick={handleRootAdd}
                disabled={disabled}
                title="확인"
              >
                ✓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0 text-red-600 hover:text-red-700"
                onClick={resetRootAddForm}
                disabled={disabled}
                title="취소"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        {/* Category Tree */}
        <div className="space-y-1">
          {itemsWithCorrectDepths.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-sm">{emptyMessage}</p>
              <p className="text-xs text-gray-400 mt-1">
                루트 카테고리를 추가하여 시작하세요.
              </p>
            </div>
          ) : (
            itemsWithCorrectDepths.map((item) => (
              <CategoryNode
                key={item.id}
                item={item}
                maxDepth={maxDepth}
                onAdd={handleCategoryAdd}
                onUpdate={handleCategoryUpdate}
                onDelete={(id) => handleCategoryDelete(id, itemsWithCorrectDepths)}
                onMove={handleCategoryMove}
                onThumbnailUpload={operations.onThumbnailUpload}
                disabled={disabled}
                enableDragDrop={enableDragDrop}
                thumbnailSize={thumbnailSize}
                showCodes={showCodes}
              />
            ))
          )}
        </div>

        {/* Footer Info */}
        {itemsWithCorrectDepths.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-end">
            총 {totalCategoryCount}개의 카테고리가 등록되어 있습니다.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
