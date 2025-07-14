import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Input, Card, CardContent, Badge } from '@plug/ui'

interface ThumbnailUploaderProps {
  currentThumbnailUrl?: string
  onThumbnailChange: (fileId: number | undefined) => void
  onUpload?: (file: File) => Promise<number>
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
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
          {/* Hover Preview - 이미지에만 hover 적용 */}
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
            <button
              type="button"
              onClick={handleRemoveThumbnail}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
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

export interface CategoryItem {
  id: string
  name: string
  code?: string
  children?: CategoryItem[]
  depth: number
  parentId?: string
  thumbnailUrl?: string
  thumbnailFileId?: number
}

export interface CategoryComponentProps {
  items?: CategoryItem[]
  maxDepth?: number
  onCategoryAdd?: (name: string, parentId?: string, thumbnailFileId?: number, code?: string) => Promise<string> | string
  onCategoryUpdate?: (id: string, name: string, thumbnailFileId?: number, code?: string) => Promise<void> | void
  onCategoryDelete?: (id: string) => Promise<void> | void
  onCategoryMove?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => Promise<void> | void
  onCategoryIdUpdate?: (tempId: string, newId: string) => void
  onThumbnailUpload?: (file: File) => Promise<number>
  className?: string
  disabled?: boolean
  enableDragDrop?: boolean
  thumbnailSize?: 'small' | 'medium' | 'large'
}

interface CategoryNodeProps {
  item: CategoryItem
  maxDepth: number
  onAdd: (name: string, parentId?: string, thumbnailFileId?: number, code?: string) => void
  onUpdate: (id: string, name: string, thumbnailFileId?: number, code?: string) => void
  onDelete: (id: string) => void
  onMove?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void
  onThumbnailUpload?: (file: File) => Promise<number>
  disabled?: boolean
  enableDragDrop?: boolean
  thumbnailSize?: 'small' | 'medium' | 'large'
}

const findNodeById = (nodes: CategoryItem[], id: string): CategoryItem | null => {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

const getMaxDepthOfTree = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) {
    return node.depth
  }
  return Math.max(...node.children.map(child => getMaxDepthOfTree(child)))
}

const getChildrenCount = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) return 0
  return node.children.length
}

const getTotalChildrenCount = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) return 0
  let total = node.children.length
  node.children.forEach(child => {
    total += getTotalChildrenCount(child)
  })
  return total
}

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const recalculateDepths = (items: CategoryItem[]): CategoryItem[] => {
  const calculateDepthRecursively = (nodes: CategoryItem[], currentDepth: number): CategoryItem[] => {
    return nodes.map(node => ({
      ...node,
      depth: currentDepth,
      children: node.children ? calculateDepthRecursively(node.children, currentDepth + 1) : undefined
    }))
  }
  
  return calculateDepthRecursively(items, 0)
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  item,
  maxDepth,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
  onThumbnailUpload,
  disabled = false,
  enableDragDrop = true,
  thumbnailSize = 'small'
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editValue, setEditValue] = useState(item.name)
  const [editCode, setEditCode] = useState(item.code || '')
  const [addValue, setAddValue] = useState('')
  const [addCode, setAddCode] = useState('')
  const [dragOver, setDragOver] = useState<'none' | 'top' | 'bottom' | 'inside'>('none')
  const [isDragging, setIsDragging] = useState(false)
  const [editThumbnailFileId, setEditThumbnailFileId] = useState<number | undefined>(item.thumbnailFileId)
  const [addThumbnailFileId, setAddThumbnailFileId] = useState<number | undefined>()

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleEditSubmit = () => {
    if (editValue.trim()) {
      onUpdate(item.id, editValue.trim(), editThumbnailFileId, editCode.trim() || undefined)
      setIsEditing(false)
    }
  }

  const handleEditCancel = () => {
    setEditValue(item.name)
    setEditCode(item.code || '')
    setEditThumbnailFileId(item.thumbnailFileId)
    setIsEditing(false)
  }

  const handleAddSubmit = () => {
    if (addValue.trim()) {
      onAdd(addValue.trim(), item.id, addThumbnailFileId, addCode.trim() || undefined)
      setAddValue('')
      setAddCode('')
      setAddThumbnailFileId(undefined)
      setIsAdding(false)
    }
  }

  const handleAddCancel = () => {
    setAddValue('')
    setAddCode('')
    setAddThumbnailFileId(undefined)
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: 'edit' | 'add') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (action === 'edit') {
        handleEditSubmit()
      } else {
        handleAddSubmit()
      }
    }
    if (e.key === 'Escape') {
      if (action === 'edit') {
        handleEditCancel()
      } else {
        handleAddCancel()
      }
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (!enableDragDrop) return
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!enableDragDrop || !onMove) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const height = rect.height
    
    if (y < height * 0.25) {
      setDragOver('top')
    } else if (y > height * 0.75) {
      setDragOver('bottom')
    } else {
      setDragOver(item.depth < maxDepth ? 'inside' : 'none')
    }
  }

  const handleDragLeave = () => {
    setDragOver('none')
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!enableDragDrop || !onMove) return
    e.preventDefault()
    
    const draggedId = e.dataTransfer.getData('text/plain')
    if (draggedId === item.id) return
    
    if (dragOver === 'top') {
      onMove(draggedId, item.id, 'before')
    } else if (dragOver === 'bottom') {
      onMove(draggedId, item.id, 'after')
    } else if (dragOver === 'inside') {
      onMove(draggedId, item.id, 'inside')
    }
    
    setDragOver('none')
  }

  const hasChildren = item.children && item.children.length > 0
  const canAddChildren = item.depth < maxDepth

  return (
    <div className="relative"      >
        {/* Drag indicators */}
        {enableDragDrop && dragOver === 'top' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
      )}
      {enableDragDrop && dragOver === 'bottom' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />        )}
        
        <div 
        className={`flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md group relative transition-colors ${
          isDragging ? 'opacity-50' : ''
        } ${
          dragOver === 'inside' ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
        }`}
        style={{ paddingLeft: `${item.depth * 20 + 8}px` }}
        draggable={enableDragDrop && !disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {enableDragDrop && !disabled && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move text-gray-400 hover:text-gray-600">
            ⋮⋮
          </div>
        )}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-5 h-5 p-0 text-gray-500 hover:text-gray-700"
            onClick={handleToggleExpand}
            disabled={disabled}
          >
            <span className="text-xs">
              {isExpanded ? '▼' : '▶'}
            </span>
          </Button>
        ) : (
          <div className="w-5 h-5" />
        )}

        <div className="flex-1 flex items-center gap-2">
          {isEditing ? (
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-col gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'edit')}
                  className="h-7 text-sm"
                  placeholder="카테고리 이름"
                  autoFocus
                  disabled={disabled}
                />
                <Input
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'edit')}
                  className="h-6 text-xs"
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center gap-1">
                <ThumbnailUploader
                  currentThumbnailUrl={item.thumbnailUrl}
                  onThumbnailChange={setEditThumbnailFileId}
                  onUpload={onThumbnailUpload}
                  disabled={disabled}
                  size={thumbnailSize}
                />
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-green-600 hover:text-green-700"
                  onClick={handleEditSubmit}
                  disabled={disabled}
                  title="확인"
                >
                  ✓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-red-600 hover:text-red-700"
                  onClick={handleEditCancel}
                  disabled={disabled}
                  title="취소"
                >
                  ✕
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {item.thumbnailUrl && (
                  <div className="relative group/thumbnail">
                    <img
                      src={item.thumbnailUrl}
                      alt={`${item.name} thumbnail`}
                      className={`${sizeClasses[thumbnailSize]} object-cover rounded border`}
                    />
                    <div className="absolute left-full top-0 ml-2 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-2 w-44">
                        <img
                          src={item.thumbnailUrl}
                          alt={`${item.name} 썸네일 미리보기`}
                          className="w-40 h-40 object-cover rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                  {item.code && (
                    <span className="text-xs text-gray-500">
                      {item.code}
                    </span>
                  )}
                </div>
              </div>
              {getChildrenCount(item) > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getChildrenCount(item)}개의 하위 카테고리
                </Badge>
              )}
            </>
          )}
        </div>

        {!isEditing && !disabled && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {canAddChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-blue-600 hover:text-blue-700"
                onClick={() => setIsAdding(true)}
                title="하위 카테고리 추가"
              >
                +
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-gray-600 hover:text-gray-700"
              onClick={() => setIsEditing(true)}
              title="카테고리 수정"
            >
              ✎
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-6 h-6 p-0 ${
                item.children && item.children.length > 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-red-600 hover:text-red-700'
              }`}
              onClick={() => {
                const hasChildren = item.children && item.children.length > 0
                if (hasChildren) {
                  alert(`"${item.name}" 카테고리에 ${item.children!.length}개의 하위 카테고리가 있습니다.\n하위 카테고리를 먼저 삭제한 후 다시 시도해주세요.`)
                  return
                }
                
                onDelete(item.id)
              }}
              title={
                item.children && item.children.length > 0 
                  ? `하위 카테고리 ${item.children.length}개가 있어 삭제할 수 없습니다` 
                  : "카테고리 삭제"
              }
            >
              🗑
            </Button>
          </div>
        )}
      </div>

      {isAdding && (
        <div 
          className="flex flex-col gap-2 p-3 bg-blue-50 rounded-md ml-2"
          style={{ paddingLeft: `${(item.depth + 1) * 20 + 8}px` }}
        >
          <div className="flex flex-col gap-1">
            <Input
              value={addValue}
              onChange={(e) => setAddValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'add')}
              placeholder="새 카테고리 이름"
              className="h-7 text-sm"
              autoFocus
              disabled={disabled}
            />
            <Input
              value={addCode}
              onChange={(e) => setAddCode(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'add')}
              placeholder="새 카테고리 코드"
              className="h-6 text-xs"
              disabled={disabled}
            />
          </div>
          <div className="flex items-center gap-2">
            <ThumbnailUploader
              onThumbnailChange={setAddThumbnailFileId}
              onUpload={onThumbnailUpload}
              disabled={disabled}
              size={thumbnailSize}
            />
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-green-600 hover:text-green-700"
              onClick={handleAddSubmit}
              disabled={disabled}
              title="확인"
            >
              ✓
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-red-600 hover:text-red-700"
              onClick={handleAddCancel}
              disabled={disabled}
              title="취소"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {hasChildren && isExpanded && (
        <div className="ml-2">
          {item.children!.map((child) => (
            <CategoryNode
              key={child.id}
              item={child}
              maxDepth={maxDepth}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onMove={onMove}
              onThumbnailUpload={onThumbnailUpload}
              disabled={disabled}
              enableDragDrop={enableDragDrop}
              thumbnailSize={thumbnailSize}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const CategoryComponent: React.FC<CategoryComponentProps> = ({
  items = [],
  maxDepth = 3,
  onCategoryAdd,
  onCategoryUpdate,
  onCategoryDelete,
  onCategoryMove,
  onCategoryIdUpdate,
  onThumbnailUpload,
  className,
  disabled = false,
  enableDragDrop = true,
  thumbnailSize = 'small'
}) => {
  const [isAddingRoot, setIsAddingRoot] = useState(false)
  const [rootAddValue, setRootAddValue] = useState('')
  const [rootAddCode, setRootAddCode] = useState('')
  const [rootThumbnailFileId, setRootThumbnailFileId] = useState<number | undefined>()
  
  const itemsWithCorrectDepths = recalculateDepths(items)

  const handleCategoryAdd = useCallback(async (name: string, parentId?: string, thumbnailFileId?: number, code?: string) => {
    const tempId = generateUUID()
    
    if (onCategoryAdd) {
      const serverId = await onCategoryAdd(name, parentId, thumbnailFileId, code)
      
      if (onCategoryIdUpdate && serverId && serverId !== tempId) {
        onCategoryIdUpdate(tempId, serverId)
      }
      
      return serverId || tempId
    }
    
    return tempId
  }, [onCategoryAdd, onCategoryIdUpdate])

  const handleCategoryUpdate = useCallback(async (id: string, name: string, thumbnailFileId?: number) => {
    if (onCategoryUpdate) {
      await onCategoryUpdate(id, name, thumbnailFileId)
    }
  }, [onCategoryUpdate])

  const handleCategoryDelete = useCallback(async (id: string) => {
    const nodeToDelete = findNodeById(itemsWithCorrectDepths, id)
    if (!nodeToDelete) {
      alert('삭제할 카테고리를 찾을 수 없습니다.')
      return
    }

    const hasChildren = nodeToDelete.children && nodeToDelete.children.length > 0
    if (hasChildren) {
      return
    }

    const confirmMessage = `"${nodeToDelete.name}" 카테고리를 삭제하시겠습니까?`
    
    if (!confirm(confirmMessage)) {
      return
    }
    
    if (onCategoryDelete) {
      await onCategoryDelete(id)
    }
  }, [onCategoryDelete, itemsWithCorrectDepths])

  const handleCategoryMove = useCallback(async (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
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
      alert('자기 자신이나 하위 카테고리로는 이동할 수 없습니다.')
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
        
        alert(`이동 불가: 최대 깊이 ${maxDepth}를 초과합니다.\n\n"${targetNode.name}" 카테고리 밑으로 이동하면:\n- "${draggedNode.name}"이 Depth ${newBaseDepth}가 됩니다.\n- 최하위 카테고리가 Depth ${newMaxDepth}가 됩니다.${currentStructure}`)
        return
      }
    } else {
      const draggedMaxDepth = getMaxDepthOfTree(draggedNode)
      const draggedDepthSpan = draggedMaxDepth - draggedNode.depth
      const newBaseDepth = targetNode.depth
      const newMaxDepth = newBaseDepth + draggedDepthSpan
      
      if (newMaxDepth > maxDepth) {
        alert(`이동 불가: 최대 깊이 ${maxDepth}를 초과합니다.\n\n같은 레벨(Depth ${newBaseDepth})로 이동하면 최하위 카테고리가 Depth ${newMaxDepth}가 됩니다.`)
        return
      }
    }
    
    if (onCategoryMove) {
      await onCategoryMove(draggedId, targetId, position)
    }
  }, [onCategoryMove, itemsWithCorrectDepths, maxDepth])

  const handleRootAddSubmit = () => {
    if (rootAddValue.trim()) {
      handleCategoryAdd(rootAddValue.trim(), undefined, rootThumbnailFileId, rootAddCode.trim() || undefined)
      setRootAddValue('')
      setRootAddCode('')
      setRootThumbnailFileId(undefined)
      setIsAddingRoot(false)
    }
  }

  const handleRootAddCancel = () => {
    setRootAddValue('')
    setRootAddCode('')
    setRootThumbnailFileId(undefined)
    setIsAddingRoot(false)
  }

  const handleRootKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleRootAddSubmit()
    }
    if (e.key === 'Escape') {
      handleRootAddCancel()
    }
  }

  useEffect(() => {
    prevItemsRef.current = items
  }, [items])

  const prevItemsRef = useRef<CategoryItem[]>([])

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">카테고리 관리</h3>
            <Badge variant="outline" className="text-xs">
              최대 {maxDepth}단계
            </Badge>
          </div>
          {!disabled && (
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
              <Input
                value={rootAddCode}
                onChange={(e) => setRootAddCode(e.target.value)}
                onKeyDown={handleRootKeyDown}
                placeholder="루트 카테고리 코드"
                className="h-7 text-xs"
                disabled={disabled}
              />
            </div>
            <div className="flex items-center gap-2">
              <ThumbnailUploader
                onThumbnailChange={setRootThumbnailFileId}
                onUpload={onThumbnailUpload}
                disabled={disabled}
                size={thumbnailSize}
              />
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0 text-green-600 hover:text-green-700"
                onClick={handleRootAddSubmit}
                disabled={disabled}
                title="확인"
              >
                ✓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0 text-red-600 hover:text-red-700"
                onClick={handleRootAddCancel}
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
              <p className="text-sm">등록된 카테고리가 없습니다.</p>
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
                onDelete={handleCategoryDelete}
                onMove={handleCategoryMove}
                onThumbnailUpload={onThumbnailUpload}
                disabled={disabled}
                enableDragDrop={enableDragDrop}
                thumbnailSize={thumbnailSize}
              />
            ))
          )}
        </div>

        {/* Footer Info */}
        {itemsWithCorrectDepths.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-end">
            총 {itemsWithCorrectDepths.reduce((count, item) => {
              return count + getTotalChildrenCount(item) + 1
            }, 0)}개의 카테고리가 등록되어 있습니다.
          </div>
        )}
        </CardContent>
    </Card>

  )
}

export default CategoryComponent
