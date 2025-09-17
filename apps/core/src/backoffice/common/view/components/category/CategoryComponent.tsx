import { CategoryNode } from './CategoryNode'

import React, { useCallback } from 'react'
import { toast } from 'sonner';

import { Badge, Button, Input } from '@plug/ui'

import { useCategory, recalculateDepths, getTotalChildrenCount, getMaxDepthOfTree, findNodeById } from '@/backoffice/common/services/hooks/useCategory'
import { CategoryItem, CategoryOperations, CategoryConfig } from '@/backoffice/common/services/types/category'

import { ThumbnailUploader } from './ThumbnailUploader'
import { FolderOpen } from "lucide-react";
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
  enableCodes = true,
  enableThumbnail = false,
  emptyMessage = '등록된 카테고리가 없습니다.',
  ...operations
}) => {
  const {
    rootAddValue,
    rootAddCode,
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
    setRootAddValue('')
    setRootAddCode('')
    setRootThumbnailFileId(undefined)
  }, [setRootAddValue, setRootAddCode, setRootThumbnailFileId])

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
    <div className="flex flex-col gap-5 h-full justify-between">
      <div className="flex gap-4">
        <div>
          <div className="font-bold text-secondary-900 mb-5 flex items-center gap-2">
            <div className="bg-primary-500 w-1 h-5 ml-1 rounded-sm" />
            <div>카테고리 추가하기</div>
          </div>
          <div className="flex flex-col justify-between mb-3 border rounded-lg p-5">
            <div className="flex items-center justify-between w-full mb-2.5">
              <Badge className="h-6 rounded-md">최대 {maxDepth}단계</Badge>
            </div>
            <div className="mb-4 rounded-md bg-secondary-100 p-4 w-80">
              <div className="flex flex-col gap-2.5">
                <Input
                  value={rootAddValue}
                  onChange={(e) => setRootAddValue(e.target.value)}
                  onKeyDown={handleRootKeyDown}
                  placeholder="루트 카테고리 이름"
                  className="h-9 text-sm placeholder:text-gray-400"
                  autoFocus
                  disabled={disabled}
                />
                {enableCodes && (
                  <Input
                    value={rootAddCode}
                    onChange={(e) => setRootAddCode(e.target.value)}
                    onKeyDown={handleRootKeyDown}
                    placeholder="루트 카테고리 코드"
                    className="h-9 text-sm placeholder:text-gray-400"
                    disabled={disabled}
                  />
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                {enableThumbnail && (
                  <ThumbnailUploader
                    onThumbnailChange={setRootThumbnailFileId}
                    onUpload={operations.onThumbnailUpload}
                    disabled={disabled}
                    size={thumbnailSize}
                  />
                )}
                <div className="flex-1" />
                <Button
                  onClick={handleRootAdd}
                  disabled={disabled}
                >
                  추가 하기
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1 w-full h-full">
          <div className="font-bold text-secondary-900 mb-5 flex items-center gap-2">
            <div className="bg-primary-500 w-1 h-5 ml-1 rounded-sm" />
            <div>카테고리 목록</div>
          </div>
          <div className="border rounded-lg p-7 overflow-y-auto h-full flex flex-col gap-2.5">
            {itemsWithCorrectDepths.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">
                  <FolderOpen className="h-12 w-12 text-primary-500" />
                </div>
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
                  onDelete={(id) =>
                    handleCategoryDelete(id, itemsWithCorrectDepths)
                  }
                  onMove={handleCategoryMove}
                  onThumbnailUpload={operations.onThumbnailUpload}
                  disabled={disabled}
                  enableDragDrop={enableDragDrop}
                  thumbnailSize={thumbnailSize}
                  enableCodes={enableCodes}
                  enableThumbnail={enableThumbnail}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {itemsWithCorrectDepths.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-end">
          총 {totalCategoryCount}개의 카테고리가 등록되어 있습니다.
        </div>
      )}
    </div>
  );
}
